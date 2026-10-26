#!/usr/bin/env bash
# 只读的 worktree 修剪审计。按大小、合并状态、未提交的工作、远端/PR 状态，
# 以及最近一次在其中操作的对话，给每个 git worktree 分类。按大小输出一张表，
# 并给出建议的桶。绝不删除任何东西；删除仍是 playbook 里由人把关的一步。
#
# 用法：worktree-audit.sh [-b|--base <ref>] [repo-path]
#   repo-path 默认是当前仓库。
#   -b 设置 MERGED 列对照的引用（例如 origin/integration）。
#   不给的话，基线依次是 origin/HEAD、origin/main、origin/master。
#   origin/HEAD 是远端的默认分支，不一定是 PR 合并进去的分支；
#   两者不同时请传入 -b。
set -u

base=""
while [ $# -gt 0 ]; do
	case "$1" in
	-b|--base) [ $# -ge 2 ] || { echo "错误：$1 需要一个引用" >&2; exit 2; }; base="$2"; shift 2 ;;
	-h|--help) sed -n '2,/^set -u/p' "$0" | sed '$d; s/^# \{0,1\}//'; exit 0 ;;
	-*) echo "错误：未知选项：$1" >&2; exit 2 ;;
	*) break ;;
	esac
done

repo="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -z "$repo" ] && { echo "不在 git 仓库里；请传入仓库路径" >&2; exit 1; }
cd "$repo" || exit 1
git rev-parse --git-dir >/dev/null 2>&1 || { echo "错误：不是 git 仓库：$repo" >&2; exit 1; }

# 主 worktree 是第一项；其余都是候选。
main_wt=$(git worktree list --porcelain | awk '/^worktree /{print $2; exit}')

if [ -z "$base" ]; then
	for cand in "$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)" origin/main origin/master; do
		[ -n "$cand" ] && git rev-parse --verify --quiet "$cand^{commit}" >/dev/null && { base="$cand"; break; }
	done
	[ -z "$base" ] && { echo "错误：没有基线引用（origin/HEAD、origin/main、origin/master 都不存在）；请传入 -b <ref>" >&2; exit 1; }
	echo "警告：没有给出 -b；MERGED 对照 $base" >&2
fi

# 基线驱动合并检查。fetch 是尽力而为（第一遍过期也可以），并且在检查之前跑，
# 因为 -b 可能指向一个还没取回的分支。显式的 refspec 即使在单分支克隆里也能创建它。
case "$base" in
origin/*) git fetch origin "+refs/heads/${base#origin/}:refs/remotes/$base" --quiet 2>/dev/null \
	|| echo "警告：无法获取 $base；merged 列可能过期" >&2 ;;
esac
git rev-parse --verify --quiet "$base^{commit}" >/dev/null 2>&1 || { echo "错误：找不到基线引用：$base" >&2; exit 1; }

# GNU coreutils（Linux、Homebrew gnubin）把 `stat -f` 读成文件系统状态，
# 把 `date -r` 读成一个文件，所以这里一次性选好 stat 和 date 的标志。
if stat -c %Y / >/dev/null 2>&1; then
	stat_fmt=(-c '%Y %n'); fmt_day() { date -d "@$1" '+%Y-%m-%d'; }
else
	stat_fmt=(-f '%m %N'); fmt_day() { date -r "$1" '+%Y-%m-%d'; }
fi

# 按分支取一次 PR 状态，形如 [{number, state, head}]，state 为小写。
# 这个仓库的 PR 能被 Origin CLI 读到时用 Origin，否则用 gh。两者都不行时为空。
prs=$(mktemp)
if command -v origin >/dev/null 2>&1 \
	&& raw=$(origin pr list --author "@me" --state all --limit 1000 \
		--json number,status,headRef 2>/dev/null); then
	printf '%s' "$raw" | jq '[.[] | {number, state: .status, head: .headRef}]' > "$prs" 2>/dev/null
elif raw=$(gh pr list --author "@me" --state all --limit 1000 \
	--json number,state,headRefName 2>/dev/null); then
	printf '%s' "$raw" | jq '[.[] | {number, state: (.state | ascii_downcase), head: .headRefName}]' > "$prs" 2>/dev/null
fi
[ -s "$prs" ] || echo "[]" > "$prs"

# 记录目录：~/.cursor/projects/<仓库路径做成的 slug>/agent-transcripts。
slug=$(printf '%s' "$main_wt" | sed 's#^/##; s#/#-#g')
transcripts="$HOME/.cursor/projects/$slug/agent-transcripts"
now=$(date +%s)

echo "# base: $base"
printf "SIZE\tAGE\tMERGED\tDIRTY\tREMOTE\tPR\tLAST_CHAT\tBUCKET\tWORKTREE\n"

git worktree list --porcelain | awk '/^worktree /{print $2}' | while read -r wt; do
	[ "$wt" = "$main_wt" ] && continue

	size=$(du -sh "$wt" 2>/dev/null | awk '{print $1}')
	head=$(git -C "$wt" rev-parse HEAD 2>/dev/null)
	head_ts=$(git -C "$wt" log -1 --format='%ct' HEAD 2>/dev/null || echo 0)
	age=$([ "$head_ts" -gt 0 ] 2>/dev/null && echo "$(( (now - head_ts) / 86400 ))d" || echo "?")

	# squash 合并的分支不是基线的祖先，所以 PR 状态才是真正的信号；
	# merge-base 只能抓住快进或变基合并。
	git merge-base --is-ancestor "$head" "$base" 2>/dev/null && merged=YES || merged=no

	# 把真正的在制品（已跟踪的编辑）和可丢弃的未跟踪草稿分开。
	porcelain=$(git -C "$wt" status --porcelain 2>/dev/null)
	if [ -z "$porcelain" ]; then dirty=clean
	elif printf '%s\n' "$porcelain" | grep -qv '^??'; then
		dirty="wip:$(printf '%s\n' "$porcelain" | grep -cv '^??')"
	else dirty="scratch:$(printf '%s\n' "$porcelain" | grep -c '^??')"; fi

	branch=$(git -C "$wt" symbolic-ref --quiet --short HEAD 2>/dev/null || echo "")
	if [ -z "$branch" ]; then remote=detached
	elif git -C "$wt" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
		[ "$(git -C "$wt" rev-parse "origin/$branch" 2>/dev/null)" = "$head" ] \
			&& remote=pushed \
			|| remote="ahead$(git -C "$wt" rev-list --count "origin/$branch..HEAD" 2>/dev/null)"
	else remote=no-remote; fi

	pr=$([ -n "$branch" ] && jq -r --arg b "$branch" \
		'.[] | select(.head==$b) | "#\(.number)/\(.state)"' "$prs" 2>/dev/null | head -1)
	[ -z "$pr" ] && pr="-"

	# 记录里最近一次在这个 worktree 中操作过的对话。路径后面要跟着 "/" 或引号，
	# 这样 glint-482 不会匹配到 glint-482-r37。
	last="-"; last_ts=0
	if [ -d "$transcripts" ]; then
		f=$(rg -l -e "${wt}/" -e "${wt}\"" "$transcripts" 2>/dev/null \
			| xargs stat "${stat_fmt[@]}" 2>/dev/null | sort -rn | head -1)
		if [ -n "$f" ]; then last_ts=$(echo "$f" | awk '{print $1}')
			last=$(fmt_day "$last_ts" 2>/dev/null); fi
	fi
	recent=$([ "$last_ts" -gt 0 ] 2>/dev/null && [ $(( (now - last_ts) / 86400 )) -le 4 ] && echo yes || echo no)

	case "$dirty" in wip:*) bucket=hold-wip ;; *)
		case "$pr" in */open|*/draft) bucket=hold-open-pr ;; *)
			if [ "$recent" = yes ]; then bucket=verify-recent-chat
			elif [ "$merged" = YES ] || [ "$pr" != "-" ]; then bucket=safe
			else bucket=review; fi ;;
		esac ;;
	esac

	printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
		"$size" "$age" "$merged" "$dirty" "$remote" "$pr" "$last" "$bucket" "$wt"
done | sort -t$'\t' -k1,1 -rh

rm -f "$prs"

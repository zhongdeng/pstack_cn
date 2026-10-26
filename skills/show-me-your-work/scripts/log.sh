#!/usr/bin/env bash
# 向 show-me-your-work 决策日志（TSV）追加一行格式正确的记录。
# 用法：log.sh <logfile> <phase> <decision> <why> <evidence> <result>
set -euo pipefail

if [ "$#" -ne 6 ]; then
	printf 'usage: log.sh <logfile> <phase> <decision> <why> <evidence> <result>\n' >&2
	exit 1
fi

logfile="$1"
shift

logdir="$(dirname "$logfile")"
if [ -n "$logdir" ] && [ "$logdir" != "." ] && [ ! -d "$logdir" ]; then
	mkdir -p "$logdir"
fi

# 这里用 `>>`，绝不用 `>`。对一份已经存在的日志，网络挂载可能让这次检查失败。
# 那时的代价是多出一行表头，而不是丢掉已有的行。
if [ ! -s "$logfile" ]; then
	printf 'ts\tphase\tdecision\twhy\tevidence\tresult\n' >> "$logfile"
fi

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
# 去掉制表符、换行和 CR，让单元格留在同一行；如果单元格首字符会被电子表格
# 当成公式（=、+、-、@），就在前面加一个单引号。这个技能预期日志会在电子表格里
# 阅读，因此攻击者可控的证据（PR 标题、文件名、生成文本）不能在审阅者打开文件时
# 变成公式执行。
clean() {
	local v
	v=$(printf '%s' "$1" | tr '\t\n\r' '   ')
	case "$v" in
		=*|+*|-*|@*) printf "'%s" "$v" ;;
		*) printf '%s' "$v" ;;
	esac
}
printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
	"$ts" "$(clean "$1")" "$(clean "$2")" "$(clean "$3")" "$(clean "$4")" "$(clean "$5")" \
	>> "$logfile"

# 代码考古（git + 仓库内）

## 这个来源包含什么

- 提交历史（提交信息、日期、作者、diff）
- PR 描述、评审评论和讨论串（通过 `gh`）
- 代码里的行内注释、TODO、FIXME、废弃说明
- ADR（架构决策记录），如果仓库里存了的话
- 测试，测试的名字和断言经常编码了促成某次改动的边界情况
- 同一次提交里一起改动的相关文件（共变信号）
- 仓库里的 CHANGELOG 条目和发布说明
- 提交信息和 PR 正文里的 issue/ticket ID

最可信的来源，直接绑在代码上，也最完整。凡是经过仓库的东西都应该在这里。

## 怎么搜

先扩充种子提交列表：

```bash
# History through renames
git log --follow --oneline -- <file>

# Pickaxe: commits that added or removed this exact text
git log -S '<exact_string_from_code>' -- <file>

# Or for patterns:
git log -G '<regex>' -- <file>

# Who wrote each line and when
git blame -L <start>,<end> <file>

# One commit's full diff
git show <hash>

# Commits between two points affecting this file
git log <old>..<new> -p -- <file>
```

找带外文档：

```bash
# ADRs often live in docs/adr/ or similar
rg -l -i 'architecture.decision' --glob '*.md'

# TODOs and FIXMEs near the target
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <target_file>

# Related tests
rg -l '<symbol>' --glob '*test*'
```

# 代码考古（git + 仓库内）

## 这个来源包含什么

- 提交历史（说明、日期、作者、diff）
- PR 描述、评审评论和讨论线程（通过 `gh`）
- 行内代码注释、TODO、FIXME、弃用说明
- ADR（架构决策记录），如果仓库保存了它们
- 测试。它们的名字和断言常常编码了促成一次改动的边界情况
- 同一次提交里一起修改的相关文件（共同变更信号）
- 仓库里的 CHANGELOG 条目和发行说明
- 提交说明和 PR 正文里的 issue 或工单 ID

最可信的来源，直接系在代码上，也最完整。凡是进过仓库的东西，都应该在这里。

## 如何搜索

扩展种子提交列表：

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

寻找带外文档：

```bash
# ADRs often live in docs/adr/ or similar
rg -l -i 'architecture.decision' --glob '*.md'

# TODOs and FIXMEs near the target
rg -n -C2 '(TODO|FIXME|HACK|XXX|NOTE)' <target_file>

# Related tests
rg -l '<symbol>' --glob '*test*'
```

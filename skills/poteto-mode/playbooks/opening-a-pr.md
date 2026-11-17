### 打开 PR

在每一本其他手册的末尾被调用。

从主干分出的 git 工作树里工作，无关的工作不要放进来。变基成小的、可以单独落地的提交。提交前用来自 `cursor-team-kit` 的 `/deslop` 扫一遍 diff。

标题：`type(scope): subject`，有一个真实符号承载这次改动时就点名它。正文：一分钟能读完的简报，不超过 40 行，按顺序使用这些 `##` 标题，空的丢掉：`## Why`、`## What changed`、`## Scope`、`## Tradeoffs`（只写审查者否则会问的、被否掉的备选）、`## Blast Radius`、`## Verification`。

后续改动按基线分支往上叠。PR 开成可审查。这次运行有 PR 工具时，用它并设 `draft: false`。没有的话，用 `gh pr create`，不要加 `--draft`；Origin 的 CLI 能解析该仓库时，用 `origin pr create --status open`。开 PR 不会启动 babysit。

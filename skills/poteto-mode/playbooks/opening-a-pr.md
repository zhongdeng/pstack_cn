### 打开 PR

在每一本其他手册的末尾被调用。

**工作树。** 从 main 分出的 git 工作树里工作。子代理继承它。同一条分支上的多次 `Task` 调用各自得到自己的工作树，或者在它们之间做 `git fetch && git reset --hard origin/<branch>`。脏分支上有无关工作：把补丁摘出来，开一个新的工作树，再应用。缠住的工作树：从 main 重置，最小地重做。

**提交。** 勤于提交。开 PR 之前变基成小而有序的提交。每一次提交都是未来的一个 PR：可以落地，并且排好序来讲这个故事。修复属于一个刚做的提交时，用 amend。可以分开时，做新提交。提交正文不要重述主题。

**PR。** 提交之前用来自 `cursor-team-kit` 的 `/deslop` 扫一遍 diff，审查之前做 `/no-comments`。用 `/technical-writing` 写每一个 PR 标题、描述和提交正文（除 Diátaxis 以外的每一层，并应用 STE 词汇规则：每个动作一个词，保留冠词，能用朴素动词就不用 `-ing`），然后再应用 `/unslop`。

**标题。** Conventional Commits 的 `type(scope): subject`，末尾不要句号。类型例如 `feat`、`fix`、`docs`、`refactor`、`test`、`chore` 或 `perf`。范围是区域，例如 `pstack` 或 `poteto-mode`。主题短、用祈使，并在有一个真实符号承载这次改动时点名它，例如 `fix(pstack): retarget opening-a-pr babysit trigger`。

**描述。** PR 正文是给已经有 diff 的审查者的一分钟简报，不是实验笔记本。它说明这次改动为什么存在、它留下了什么、它可能弄坏什么，以及你如何证明它能工作。写短而简单的句子，标识符少，不要文字墙。正文会变成 squash 提交的正文，所以把那次提交保持在大约 40 行以内。按这个顺序使用 `##` 标题，不要用粗体领起，没有内容可说的节就丢掉：

- `## Why`：问题和做法，1 到 3 句短句。不要 SHA，不要变基谱系，也不要「based on main」这种开场。
- `## What changed`：1 到 3 条短项目。只有当一个真实符号或路径承载这次改动时才点名它。重命名或改目标要两边都点名。
- `## Scope`：始终要有。1 到 3 条短项，说明它覆盖什么、有意留下什么（一项后续、一个已知缺口）。不要符号、路径，或逐文件的长文。
- `## Tradeoffs`：只写审查者否则会问到的被拒备选。没有真正的选择时跳过。
- `## Blast Radius`：1 到 2 句，说明它碰到谁或什么，以及为什么那是安全的或有风险的。如果 main 是红的，说明让它继续红着的代价。
- `## Verification`：1 到 3 条，每一条是一条真实的运行路径及其结果。性能：一个带单位的主要数字，`before → after`，以及指向 arena 或 swarm 目录的链接，其余的放那里。不要样本量方法论、swarm 复述，或指标表。

这些节之后，当视频或截图能证明一条说法时附上它们。完整 SHA、swarm 或 arena 通道的复述、杠杆修正长文、逐文件清单，以及「CLEAN」裁决，放进一个链接的产物，不放进正文。

**托管平台。** 在第一次 PR 操作之前解析托管平台，并在创建、编辑、查看、看守和合并上保持这个选择。GitHub CLI（`gh`）是默认。如果 `command -v origin` 成功并且 Origin 能解析该仓库，优先用 `origin pr ...`。如果 Origin 不在，或不能解析该仓库，留在 `gh` 并记下这次回退。不要要求 Graphite（`gt`）。

**内建 PR 工具。** 当这次运行提供了内建 PR 工具时，创建、编辑、改目标和标为就绪都经它完成，绝不经托管平台 CLI。用 CLI 做出的 PR 会漏掉该工具所跟踪的东西。工具没有覆盖的一切，以及这次运行没有这种工具时的每一次 PR 操作，使用已解析的托管平台。

**大小和栈。** 偏好五个窄 PR，而不是一个大 PR。栈是一条基分支链。根 PR 的目标是主干。每一个子分支变基到其父的确切 tip，并且它的 PR 以父分支为目标。父合并时，按 `playbooks/shipping.md` 第 4 步把它的子移到主干。没有内建 PR 工具时，按已解析的托管平台，用 `origin pr create --status open --base <parent-branch>` 或 `gh pr create --base <parent-branch>` 创建子 PR，并用 `origin pr edit <pr> --base <parent-branch>` 或 `gh pr edit <pr> --base <parent-branch>` 改一个的目标。只为独立的工作从主干分出。在大量的栈工作之前，先变基到主干。

**就绪。** 每个 PR 都以就绪打开，绝不要作为草稿。内建 PR 工具可能默认草稿，所以经它的每一次创建调用都设 `draft: false`。用 Origin 时传 `--status open`。用 `gh` 时省略 `--draft`。如果一个 PR 仍然以草稿打开，经 PR 工具把它标为就绪，或按已解析的托管平台运行 `origin pr ready <number>` 或 `gh pr ready <number>`。在你提及 PR 状态之前，运行 `origin pr view <number>` 或 `gh pr view <number>`。

**Babysit。** 开一个 PR 并不开始 Babysit。贴出 URL，继续构建。先完成这个阶段或这叠栈。只有当整叠栈存在、并且用户要求时，才单独跑一遍 Babysit。对每个新 PR 都做 Babysit 会拖住构建，并把检查花在稍后的波次会重启的提交上。反馈漂离意图时，推回去。

一个开 PR 的子代理要跑 `interrogate`、`/deslop` 和 `/no-comments`，并贴出 URL。它回到父级，不做 Babysit，除非它是 Autopilot-full 或 Autopilot-stack 的负责人。那位负责人的简报指定了 Babysit 循环，而这正是 `playbooks/babysit.md` 在等的那句请求。负责人在它的代码就绪报告之后开始循环，按它的手册报告可合并或 STACK-READY，并且不受这里以及 `playbooks/babysit.md` 里那些「等到整叠栈建好才 Babysit」的规则约束。

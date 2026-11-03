### 开 PR

在每个其他作战手册结束时调用。

**Worktree。** 从 main 拉一个 git worktree 干活。子智能体继承它。同一分支上的多个 `Task` 调用各自拿一个 worktree，或者在它们之间跑 `git fetch && git reset --hard origin/<branch>`。分支上有无关改动、状态脏：先 patch 出来，开新 worktree，再 apply。worktree 乱成一团：从 main reset，最小化重做。

**提交。** 放心多提交。开 PR 前 rebase 成小而有序的提交。每个提交都是一个未来的 PR：可落地，顺序能讲清故事。修复属于刚做的那个提交就 amend。能拆开就新开一个提交。提交正文不要复述标题。

**PR。** 提交前用 `cursor-team-kit` 里的 `/deslop` 过一遍 diff，评审前跑 `/no-comments`。每个 PR 标题、描述和提交正文都用 `/technical-writing` 写（除 Diátaxis 外的每一层，并套用 STE 词汇规则：一个动作一个词，保留冠词，能用普通动词就不用 `-ing`），然后再套 `/unslop`。

**标题。** Conventional Commits 格式 `type(scope): subject`，结尾不加句号。Type 用 `feat`、`fix`、`docs`、`refactor`、`test`、`chore` 或 `perf` 之类。Scope 是区域，比如 `pstack` 或 `poteto-mode`。Subject 要短、用祈使句，承载改动的真实符号要点名，例如 `fix(pstack): retarget opening-a-pr babysit trigger`。

**描述。** PR 正文是给手里有 diff 的评审者看的一分钟简报，不是实验记录本。它说明改动为什么存在、刻意不做什么、可能弄坏什么、你怎么证明它能用。句子短而简单，少用标识符，不要大段文字。正文会变成 squash 提交的正文，所以那个提交控制在 40 行左右。用 `##` 标题，不要用加粗引导句，按这个顺序，没话说的段落直接删掉：

- `## Why`：问题和做法，1 到 3 句短句。不要 SHA、不要 rebase 家谱、不要"基于 main"之类的开场。
- `## What changed`：1 到 3 条短要点。只有真实符号或路径承载改动时才点名。重命名或重定向要把两边都写出来。
- `## Scope`：必须有。1 到 3 条短项，说明覆盖什么、刻意不覆盖什么（后续工作、已知缺口）。不要符号、路径，也不要逐文件的长篇。
- `## Tradeoffs`：只写评审者否则会追问的被否掉的方案。没有真正的取舍就跳过。
- `## Blast Radius`：1 到 2 句，说明影响谁或什么，以及为什么安全或为什么有风险。如果 main 是红的，说明让它继续红着的代价。
- `## Verification`：1 到 3 条要点，每条是一个真实跑过的路径和结果。性能：给一个主数字带单位，`before → after`，其余细节链接到 arena 或 swarm 目录。不要样本量方法论、swarm 复述或指标表格。

段落之后，能证明某个说法的就附视频或截图。完整 SHA、swarm 或 arena 泳道复述、杠杆修正长文、逐文件清单和"CLEAN"结论放进链接的附件里，不要放正文。

**Forge。** 第一次 PR 操作前先确定用哪个 forge，create、edit、view、watch、merge 全程都用它。GitHub CLI（`gh`）是默认。如果 `command -v origin` 成功且 Origin 能解析仓库，优先用 `origin pr ...`。如果 Origin 不存在或解析不了仓库，就用 `gh`，并记下这个回退。不要求 Graphite（`gt`）。

**内置 PR 工具。** 运行时提供了内置 PR 工具时，创建、编辑、重定向和标记就绪都走它，绝不走 forge CLI。CLI 建的 PR 会漏掉工具追踪的东西。工具不覆盖的事，以及运行时没有这种工具时的所有 PR 操作，都用已确定的 forge。

**大小和栈。** 五个窄 PR 好过一个大的。栈是一条 base 分支链。根 PR 指向 trunk。每个子分支 rebase 到父分支的确切 tip 上，它的 PR 指向父分支。父分支合并后，按 `playbooks/shipping.md` 第 4 步把子分支挪到 trunk 上。没有内置 PR 工具时，按已确定的 forge，用 `origin pr create --status open --base <parent-branch>` 或 `gh pr create --base <parent-branch>` 建子 PR，用 `origin pr edit <pr> --base <parent-branch>` 或 `gh pr edit <pr> --base <parent-branch>` 重定向。只有独立工作才从 trunk 拉分支。大栈开工前先 rebase 到 trunk。

**就绪状态。** 每个 PR 都以就绪状态开，绝不开成 draft。内置 PR 工具可能默认 draft，所以通过它每次创建都设 `draft: false`。用 Origin 时传 `--status open`。用 `gh` 时省掉 `--draft`。如果 PR 还是开成了 draft，通过 PR 工具标记就绪，或按已确定的 forge 跑 `origin pr ready <number>` 或 `gh pr ready <number>`。提到 PR 状态前先跑 `origin pr view <number>` 或 `gh pr view <number>`。

**Babysit。** 开 PR 不会启动 babysit。把 URL 发出去，继续干活。先把这一阶段或这个栈做完。只有用户在整个栈都存在之后要求时，才单独跑一轮 babysit。每个新 PR 都 babysit 会拖住构建，把检查花在后续波次会重启的提交上。反馈偏离意图时要顶回去。

开 PR 的子智能体跑 `/deslop` 和 `/no-comments`，然后发 URL。它回到父级，不做 babysit，除非它是 Autopilot-full 或 Autopilot-stack 的负责人。那个负责人的任务书里指派了 babysit 循环，也就是 `playbooks/babysit.md` 在等的那个请求。负责人在代码就绪报告之后启动循环，报告 merge-ready，并且不受这里和 `playbooks/babysit.md` 里那些要求等整个栈建完才 babysit 的规则约束。

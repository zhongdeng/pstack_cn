# pstack

我是 [poteto](https://x.com/poteto)。我不是总裁，也不是 CEO，但我在 Meta、Netflix 和 Cursor 经手过数百万行代码。我也在 React 核心团队，参与构建和维护 React Compiler。

越来越多人觉得，AI 写出了太多注水代码。我同意。我不想像一支二十人的注水艺人团队那样交付。没有质量的吞吐量，不是我追求的目标。想要快，就先走深。

**pstack 是我的答案。** 这些就是我每天在 Cursor 用来交付高质量代码的同一批 skill。它把 Cursor 变成一支真正的工程团队。目标不是把代码行数拉到最大，事实上正好相反。pstack 帮你少写代码，但写出更高质量的代码。

**pstack 给你无所畏惧的并行。** 当你能在一个 agent 上走深，并信任它写出良好、可验证的代码时，你才能真正有信心地并行。用 `poteto-mode` 同时启动多个 agent，并信任它们会把严格的工程原则用到自己的工作上。

**Cursor 让你兼得各方所长。** 每个前沿模型都有自己的长处和短处。pstack 可以搭配任何模型。事实上，我的很多 skill 使用多模型工作流，来利用每个模型独有的长处。

fork 它。改进它。把它变成你的。欢迎 PR！

## 安装

```bash
/add-plugin pstack
```

在 Claude Code 里：

```bash
/plugin marketplace add cursor/plugins
/plugin install pstack@cursor-plugins
```

Claude Code 对第三方市场默认关闭自动更新，所以 pstack 会停在你安装的那个版本。要打开自动更新，运行 `/plugin`，打开 **marketplaces** 标签页，选中 `cursor-plugins`，然后选择 **enable auto-update**。想手动更新一次，运行 `claude plugin update pstack@cursor-plugins`。

Claude Code 会给插件命令和 agent 加前缀，所以 `/poteto-mode` 就是 `/pstack:poteto-mode`。[Claude Code 适配器](./docs/harness/claude-code.md)映射了其余每一个 Cursor 名称。在 Claude Code 里，`/pstack:setup-pstack` 会把你的模型选择写到 `~/.claude/rules/pstack-models.md`；需要 Cursor 独有功能的步骤，例如 Bugbot 或自动化，会被跳过，并附上一行说明。

Claude Code 安装的是一份生成出来的 pstack 副本，包括这份 readme 和指南，来自仓库根目录的 [`harness/pstack/`](https://github.com/cursor/plugins/tree/main/harness/pstack)。你改完 pstack 之后，从仓库根目录运行 `node scripts/generate-pstack-harness-trees.mjs` 并提交结果。生成副本过期时，CI 会失败。

## 开始

两步：

1. 运行 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)，选一个推理预算，并选择你想用的模型。
2. 凡是需要严格对待的事，都用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。

刚来？[pstack 指南](./docs/guide/README.md)会带你走完第一个真实任务，从安装和写提示词，一直到验证和通宵运行。卡住了，或者不确定哪个 skill 合适？问 [`/poteto-help`](./skills/poteto-help/SKILL.md)。

就这些。其他 skill 看情况使用，这个 mode skill 会在需要时替你调用它们。开箱时，这个 mode 按模型的长处分派工作：代码委派（feature、refactoring、bug fix、perf、hillclimb）交给 Grok，而最难的改动、文字和判断交给 Opus 5.5。默认面板是 Opus 5.5 / Grok。[`/setup-pstack`](./skills/setup-pstack/SKILL.md) 可以改其中任何一项。

## 用法

在任务开始时使用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。它读取你的请求，从一组行动手册里挑选，并在步骤需要时运行其他 skill。

在输入任务之前，先从 `/` 菜单里选中 `/poteto-mode`，这样 Cursor 会把这个 skill 附到消息上。

### 直接用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)

这个 skill 是主快捷方式。每当我需要 agent 做严格的工程工作时，我就用它。它带有二十三份行动手册：

```
/poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even when idle. repro
first, then fix and verify.
```

```
/poteto-mode i'm going to bed. land the stack even if ci flakes. i want everything merged by
morning.
```

<details>
<summary>二十三份行动手册</summary>

| 行动手册 | 适用于 |
|---|---|
| [调查](./skills/poteto-mode/playbooks/investigation.md) | 一个只读问题。x 是怎么工作的，为什么 y 要做成这样，我们有把握吗。 |
| [缺陷修复](./skills/poteto-mode/playbooks/bug-fix.md) | 复现一处缺陷，找出根因，并用运行时证据修复。 |
| [性能](./skills/poteto-mode/playbooks/perf-issue.md) | 追踪一次测到的变慢，并对照基线改进它。 |
| [爬山优化](./skills/poteto-mode/playbooks/hillclimb.md) | 针对一个指标、朝一个目标做持续而科学的改进，用改前改后的测量循环各个假设，每一个被接受的胜出单独一次提交。 |
| [运行时取证](./skills/poteto-mode/playbooks/runtime-forensics.md) | 凭插桩诊断一个现场症状（泄漏、空闲时 CPU 空转、毛刺）。 |
| [追踪取证](./skills/poteto-mode/playbooks/trace-forensics.md) | 诊断一份已采集的性能分析产物（cpuprofile、trace、spindump、堆快照）。 |
| [功能](./skills/poteto-mode/playbooks/feature.md) | 新的或改变了的行为，从一个已命名的数据形状构建。 |
| [重构](./skills/poteto-mode/playbooks/refactoring.md) | 一处保持行为不变的结构或形状改动。 |
| [原型](./skills/poteto-mode/playbooks/prototype.md) | 一份用完即弃的草图，用来低成本地做设计或行为上的决定，或通过观察来解决一个靠经验才能判定的分叉。 |
| [视觉一致](./skills/poteto-mode/playbooks/visual-parity.md) | 两种实现之间像素级精确的 UI 一致。 |
| [编写 skill](./skills/poteto-mode/playbooks/authoring-a-skill.md) | 编写或编辑一份 SKILL.md。 |
| [评测](./skills/poteto-mode/playbooks/eval.md) | 以盲测检验一次 skill 或提示词改动如何影响 agent 行为。 |
| [看护](./skills/poteto-mode/playbooks/babysit.md) | 把一个 PR 或一条栈推到可合并：冲突、评审线程、CI。 |
| [合入](./skills/poteto-mode/playbooks/shipping.md) | 独立验证一条全绿的栈，然后把连续的已验证部分自底向上合入，默认经 GitHub，Origin 可用时经 Origin。 |
| [自主运行](./skills/poteto-mode/playbooks/autonomous-run.md) | 把一个长任务一路推进到完成，中途不停。 |
| [编排](./skills/poteto-mode/playbooks/orchestrate.md) | 交给单独一个协调者对话的常设项目：跨多日、许多堆叠的 PR、成队的子 agent。 |
| [autopilot-full](./skills/poteto-mode/playbooks/autopilot-full.md) | 把相互独立的 PR 跑到已合并，每个 PR 一个负责人。一次 swarm 验证每一个代码就绪的 head，此后对补丁的每一次改动都重新检查一次。 |
| [autopilot-stack](./skills/poteto-mode/playbooks/autopilot-stack.md) | 构建并验证一条线性的基分支栈，供操作者评审并合入。 |
| [会话接手](./skills/poteto-mode/playbooks/session-pickup.md) | 恢复或接手先前某个 agent 进行中的工作。 |
| [安全暂停](./skills/poteto-mode/playbooks/pause-safely.md) | 干净地挂起进行中的工作，以便日后恢复。 |
| [多阶段计划](./skills/poteto-mode/playbooks/multi-phase-plan.md) | 跨多个阶段或堆叠 PR 的工作。 |
| [工作树清理](./skills/poteto-mode/playbooks/worktree-cleanup.md) | 通过修剪已合并或已放弃的工作树以及过期的 iOS 模拟器来回收磁盘，并且有安全门控。 |
| [开 PR](./skills/poteto-mode/playbooks/opening-a-pr.md) | 用小而有序的提交开一个就绪的 PR，标题用 Conventional Commits，正文用简报体。在每一份其他行动手册的末尾调用。 |

</details>



调用之后它会：

1. 把你的任务匹配到一份[行动手册](./skills/poteto-mode/playbooks/)，并打开一份待办列表，最前面的条目就是它的步骤，逐字复制进来。
2. 随着步骤触发，路由到其他 skill。
3. 写出已经去掉 AI 腔的回复，说法同时面向使用者和维护者。

完整的规则和行动手册在 [`skills/poteto-mode/SKILL.md`](./skills/poteto-mode/SKILL.md)。

要跨轮保持 [`/poteto-mode`](./skills/poteto-mode/SKILL.md) 生效，从 `/` 菜单里选中它，然后按 option+enter（Mac）或 alt+enter（Windows），而不是按 enter。这会把它变成一种[自定义模式](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，Cursor 在 Agents 窗口和 CLI 里都提供它。在你退出该模式之前，它每一轮都留在上下文里。直接按 enter 只会把它附到一条消息上。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 Cursor 的 `/loop` 命令配合得非常好。你可以让 Cursor 连续工作很多个小时，而不牺牲严格性。

## skill

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 会在某一步需要时替你运行其中大部分（`how`、`why`、`architect`、`arena`、`swarm`、`interrogate`、`unslop`、`no-comments`、`technical-writing`、`tdd`，以及各条原则）。下面这张表是给你想直接用某一个的时候看的：

```
/how do we cancel runs? do we have an n+1 when we look up every run to cancel?
```

```
/interrogate review this pr.
```

<details>
<summary>全部 skill</summary>

| skill | 什么时候用 |
|---|---|
| [`/poteto-mode`](./skills/poteto-mode/SKILL.md) | 任何非平凡任务的默认入口。 |
| [`/poteto-help`](./skills/poteto-help/SKILL.md) | 你刚接触 pstack，或者不确定哪个 skill、哪份行动手册或哪条原则合适。它弄清你想做什么，回答那一部分，并交给你一条可以照着输入的提示词。只有你输入 `/poteto-help` 时才会运行。 |
| [`/in-your-own-words`](./skills/in-your-own-words/SKILL.md) | 你想让 agent 在开始之前先复述你的目标和问题。只有你输入 `/in-your-own-words` 时才会运行。 |
| [`/sharpen`](./skills/sharpen/SKILL.md) | 你想在发送之前把一条提示词改得更深，而不是更大：顶尖专业人士会做哪些你没开口要的事，他们会从什么原始材料起步，他们的方法和工具，以及一份能证明结果正确的外部核对。它交回改写后的提示词，并让你的选择保持开放。它不执行任务。只有你输入 `/sharpen` 时才会运行。 |
| [`/how`](./skills/how/SKILL.md) | 你想要一份某个子系统如何工作的走读。 |
| [`/why`](./skills/why/SKILL.md) | 你想知道为什么某样东西要做成这样。它在运行时发现可用的 MCP，并并行查询每一类证据（源码管理、议题跟踪、长篇文档、实时聊天、基础设施可观测性、错误跟踪、分析数仓）。 |
| [`/recall`](./skills/recall/SKILL.md) | 你正在开始或恢复工作，想把你在某个话题上的近期上下文，从你自己的聊天历史和共享记录里重建出来，交回一份紧凑的当前状态简报。 |
| [`/ketchup`](./skills/ketchup/SKILL.md) | 你想知道这次聊天自你上一条消息以来变了什么，用白话和小图呈现，并把每一件正等你处理的事项列出来，只凭这条回复就能做决定，哪怕这会让回复变长。 |
| [`/ketchup-video`](./skills/ketchup-video/SKILL.md) | 你想把 `/ketchup` 的进度补课做成一段无声的幻灯片短视频，正等你处理的那些事项以文字放在下面。 |
| [`/blast-radius`](./skills/blast-radius/SKILL.md) | 你有一处看起来很小的改动，想知道它还可能弄坏别的什么，并且那个让它安全的唯一事实是靠运行代码证明的，而不是断言出来的。 |
| [`/architect`](./skills/architect/SKILL.md) | 你正要写跨过函数边界的代码，想先把调用方的用法、类型和模块形状定下来。 |
| [`/arena`](./skills/arena/SKILL.md) | 你想对同一件事做 N 次并行尝试，然后取每一份里最好的部分。 |
| [`/swarm`](./skills/swarm/SKILL.md) | 你想要 N 个并行工作者处理不同的切片或赛跑，然后得到一份汇总报告。 |
| [`/interrogate`](./skills/interrogate/SKILL.md) | 你有一份 diff，想让不同的模型试着打破它，包括一个严格的代码质量视角。 |
| [`/automate-me`](./skills/automate-me/SKILL.md) | 你想要一个属于自己的 `-mode` skill，根据你实际的工作方式起草。 |
| [`/make-bot-ui`](./skills/make-bot-ui/SKILL.md) | 你想要一个页面或仪表盘，上面的按钮通过 webhook 唤醒一个 Grok Bot，包括发送方密钥的交接和 Tailscale。 |
| [`/setup-pstack`](./skills/setup-pstack/SKILL.md) | 你想按角色挑选 pstack 使用哪些模型。它检测你的模型并写一条配置规则。 |
| [`/reflect`](./skills/reflect/SKILL.md) | 一个长任务落地了，你想把这次的配方捕捉成对 skill 的一处编辑。 |
| [`/correct`](./skills/correct/SKILL.md) | 你在为同样的错误反复纠正 agent。它从历史里挖掘错误类别，在管用的最高一层修复每一类（架构，然后是类型、lint 和 CI，然后是测试，文档放在最后），并维护一张表，把每条规则和强制它的东西配成对。 |
| [`/teach`](./skills/teach/SKILL.md) | 你想真正理解一处改动或一个子系统，而不只是拿到一份摘要。它运行 how + why，并织成一份白话解释，一张图一张图地搭起来。 |
| [`/tdd`](./skills/tdd/SKILL.md) | 你在修一个 bug，而且有一条便宜的本地测试路径。先写失败的测试，再写修复。 |
| [`/benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) | 你跑了一次基准测试，或测到了一次加速或回退。在你报告或据此行动之前，先核验这个数字（限制因素、调优、错误、重复运行、端到端相关性）。 |
| [`/no-comments`](./skills/no-comments/SKILL.md) | 评审前剥掉注释；拉起 Comment Sicko，修复被接受的发现，并为声称的约束提供编码方式。 |
| [`/typescript-best-practices`](./skills/typescript-best-practices/SKILL.md) | 你正在阅读或编辑 TypeScript。把 type-system-discipline 这条原则落实到语法上。 |
| [`/figure-it-out`](./skills/figure-it-out/SKILL.md) | 没有一份附带的行动手册合适。为这个任务设计一份严格、可审计的行动手册。 |
| [`/show-me-your-work`](./skills/show-me-your-work/SKILL.md) | 你想要一条可评审的决策轨迹。把决策记到一份你可以提交的 tsv 里。 |
| [`/create-verification-skill`](./skills/create-verification-skill/SKILL.md) | 你的项目没有脚本化的办法来证明应用行为。生成一个项目本地的 verify skill，带一份功能地图，适用于任何语言或平台。 |
| [`/maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | 你的 verify skill 的功能地图已经相对应用发生漂移。一次源码波次加上一次实机走查，最多一个 PR 的已证实修正。 |
| [`/create-formal-verification-skill`](./skills/create-formal-verification-skill/SKILL.md) | 测试够不到那个会打破竞态、重试、状态机、解析器或不安全代码的情形。用合适的工具验证一条性质，并生成一个项目本地的 skill，在每次改动时重新检查它。 |
| [`/maintain-formal-verification-skill`](./skills/maintain-formal-verification-skill/SKILL.md) | 你的形式化验证所覆盖的代码自上次检查以来变了。更新模型、harness 或性质以匹配代码，重新运行，并说明每一次失败是验证侧的漂移，还是代码里的 bug。 |
| [`/statechart`](./skills/statechart/SKILL.md) | 行为的负责人需要看见它，而不是去读一份规格。把用户所见画成一张从 TLA+ 模型生成的 Mermaid 状态图，把每个状态标为可用、仍然错误、或已被你打开的 PR 修好，并把 TLC 找到的每个 bug 画成一条编号路径。也可以把一张已经谈妥的图变成 TLA+ 骨架，或对照一份已有规格审计代码。 |
| [`/unslop`](./skills/unslop/SKILL.md) | 你在清理文字。去掉 AI 的痕迹。 |
| [`/bro`](./skills/bro/SKILL.md) | 你想把上一条消息用普通人的语言重说一遍，不要行话。 |
| [`/technical-writing`](./skills/technical-writing/SKILL.md) | 分层的文档标准（Diátaxis + Google developer style + STE + Global English），用于文档、RFC、readme、PR 描述和提交说明。 |

</details>



### 示例

多数时候，我在任务开头输入 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)，让它路由到一份行动手册。其他 skill 在步骤需要时触发。有几个我会直接拿来用。


<details>
<summary>全部示例</summary>

```
bug fix:           /poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even
                   when idle. repro first, then fix and verify.
perf:              /poteto-mode a big list takes a second or two to load even though we virtualize.
                   run a cpu trace and tell me why.
feature:           /poteto-mode build a small feature behind a feature flag. verify it really works.
prototype:         /poteto-mode build two prototypes of the markdown renderer so we can compare.
                   spawn an agent for each.
multi-phase:       /poteto-mode open source these skills as a plugin. nothing internal leaks, work
                   in a temp dir, show me the dependency graph first.
overnight run:     /poteto-mode i'm going to bed. land the stack even if ci flakes. i want
                   everything merged by morning.
babysit:           /poteto-mode check on pr 123. anything outstanding?
visual parity:     /poteto-mode the row spacing is too tall when this flag is on. the second image
                   is correct. repro and fix until it matches.
figure it out:     /poteto-mode i'm stepping away. migrate every caller from the synchronous store
                   to the new async one, keeping behavior identical. i want to trust it was done
                   right when i'm back.
how:               /how do we cancel runs? do we have an n+1 when we look up every run to cancel?
why:               /why is this feature flag not on yet?
architect:         design this instrumentation to be high signal with no false positives. /architect
                   this first.
arena:             /arena take my prompt to the arena verbatim. i want to compare their proposals
                   with yours.
swarm:             /swarm check every package under packages/ against its check.sh. one worker per
                   package. one report.
interrogate:       /interrogate review this pr.
tdd:               /tdd implement
unslop:            can we unslop and tighten the new changes?
reflect:           /reflect that took too long. capture what we learned so the next run doesn't
                   repeat it.
correct:           /correct
show-me-your-work: /show-me-your-work keep a decision trail i can review when i'm back.
automate-me:       /automate-me
help:              /poteto-help which skill should i use to review this branch?
```

</details>

## `poteto-agent` 与 Comment Sicko 子 agent

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 跑在收到它的那个对话里。那个对话拥有行动手册、待办列表，以及每一次子 agent 拉起。

pstack 还附带 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md)，作为一次运行期间被拉起的委派的包装。它在做任何工作之前，会完整读完 `poteto-mode`，包括其中内联的原则索引。换成 `generalPurpose` 就会跳过这次阅读，从而走偏。不要拉起 `poteto-agent` 来自己执行行动手册。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md) 经由同一层包装路由。

pstack 还附带 [Comment Sicko](./agents/comment-sicko.md)，一个只读的注释评审者，以 `subagent_type: "comment-sicko"` 的形式提供。通常通过 [`/no-comments`](./skills/no-comments/SKILL.md) 调用它，而不是直接调用。

## 原则

二十四条简短的 skill，每条一个原则。`poteto-mode` 在内部为它们建了索引，并在任务开始时读取该索引。独立文件之所以存在，是为了让其他 skill 能按名字引用一条原则，也让索引能指向每一条的完整规则。

<details>
<summary>全部二十四条原则</summary>

| 原则 | 分组 | 规则 |
|---|---|---|
| [laziness-protocol](./skills/principle-laziness-protocol/SKILL.md) | 核心 | 偏向删除，以及能解决问题的最小改动。 |
| [foundational-thinking](./skills/principle-foundational-thinking/SKILL.md) | 核心 | 在写逻辑之前应用：选定核心类型和数据结构，排好脚手架工作和功能工作的先后，问清并发参与者共享什么。把数据结构弄对，下游代码就会变得显然。 |
| [redesign-from-first-principles](./skills/principle-redesign-from-first-principles/SKILL.md) | 核心 | 重新设计时，把这条需求当作从第一天起就是一条基础假设，而不是后补钉上去。 |
| [attack-the-premise](./skills/principle-attack-the-premise/SKILL.md) | 核心 | 当两个或更多共享同一前提、又没通过同一道关卡的修复出现时应用。把前提写下来，并在你再写下一个假定它成立的修复之前，直接检验它。 |
| [subtract-before-you-add](./skills/principle-subtract-before-you-add/SKILL.md) | 核心 | 先去掉死重、冗余的校验器和桩引用，再在更简单的基底上构建。 |
| [minimize-reader-load](./skills/principle-minimize-reader-load/SKILL.md) | 核心 | 数清问题与答案之间的层数，以及读者脑子里的隐藏状态；折叠只有一个调用方的包装，并缩小可变作用域。 |
| [outcome-oriented-execution](./skills/principle-outcome-oriented-execution/SKILL.md) | 核心 | 在有明确阶段边界的计划性重写和迁移期间应用。向目标架构收敛；不要用一次性的兼容代码去维持平滑的中间状态。 |
| [experience-first](./skills/principle-experience-first/SKILL.md) | 核心 | 选择用户的愉悦，而不是实现上的方便；少交付打磨好的功能，而不是多交付粗糙的功能。 |
| [exhaust-the-design-space](./skills/principle-exhaust-the-design-space/SKILL.md) | 核心 | 先做 2-3 个相互竞争的原型，并排比较，再做决定。 |
| [build-the-lever](./skills/principle-build-the-lever/SKILL.md) | 核心 | 应用于任何非平凡的工作，不只是批量工作：编辑、迁移、分析、检查。打造那个去做它或证明它的工具（codemod、脚本、生成器，或一份你的子 agent 会遵循的 skill），而不是手工做。这个工具就是评审者可以重跑的产物。 |
| [model-the-domain](./skills/principle-model-the-domain/SKILL.md) | 架构 | 把领域编码进一种结构，而不是散落的条件判断。 |
| [boundary-discipline](./skills/principle-boundary-discipline/SKILL.md) | 架构 | 把守卫集中在系统边界（CLI、配置、网络、外部 API）；信任内部类型，并把业务逻辑留在纯函数里。 |
| [type-system-discipline](./skills/principle-type-system-discipline/SKILL.md) | 架构 | 让非法状态无法表示，给语义原语打上品牌，在边界解析外部数据，穷尽变体，从权威 schema 派生。 |
| [make-operations-idempotent](./skills/principle-make-operations-idempotent/SKILL.md) | 架构 | 无论先前有过怎样的部分运行，都收敛到同一个终态。 |
| [migrate-callers-then-delete-legacy-apis](./skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | 架构 | 在同一波里迁移调用方并删除旧 API，而不是保留兼容层。 |
| [separate-before-serializing-shared-state](./skills/principle-separate-before-serializing-shared-state/SKILL.md) | 架构 | 先消除共享；只有当唯一的共享写入者是一条真实不变量时，才从结构上串行化。 |
| [prove-it-works](./skills/principle-prove-it-works/SKILL.md) | 验证 | 在完成任务之后、宣布完成之前应用。对照真实产物来验证（跑这个功能、读实际的值、检查 diff），而不是替代物、自我报告，或 “it compiles.”。 |
| [fix-root-causes](./skills/principle-fix-root-causes/SKILL.md) | 验证 | 把每个症状追溯到系统第一次走错的地方，并在那里修复。一个守卫只有在它处理的状态本身合法时，才算修复。 |
| [sequence-verifiable-units](./skills/principle-sequence-verifiable-units/SKILL.md) | 验证 | 应用于多步工作（清扫、迁移、一批相似的编辑），以及你如何堆叠提交和 PR。把工作拆成小单元，每一个都以可验证的状态结束，检查完一个再开始下一个，并安排交付顺序，让这个序列自己向评审者证明自己。 |
| [test-behavior-not-implementation](./skills/principle-test-behavior-not-implementation/SKILL.md) | 验证 | 在你编写、修改或保留一个测试时应用。断言代码的使用者能够观察到的东西，这样当该行为损坏时测试失败，而只有内部实现变化时测试仍然通过。 |
| [explain-the-number](./skills/principle-explain-the-number/SKILL.md) | 验证 | 在你信任、报告或依据一个你测量到的数字采取行动之前应用：一次加速、一次回退、一个吞吐量、一个延迟，或一次评测结果。找出是什么限制了它，并排除它测到的并不是你以为的那项工作。 |
| [guard-the-context-window](./skills/principle-guard-the-context-window/SKILL.md) | 委派 | 把批量工作路由给子 agent；主线程里留摘要，不留原始载荷。 |
| [never-block-on-the-human](./skills/principle-never-block-on-the-human/SKILL.md) | 委派 | 继续推进，呈现结果，让人在事后纠正方向；把确认留给不可逆的动作。 |
| [encode-lessons-in-structure](./skills/principle-encode-lessons-in-structure/SKILL.md) | 元 | 把规则编码成 lint、元数据标志、运行时检查或脚本，而不是更多文字。 |

</details>

## 这里不附带

`poteto-mode` 会引用、但没有打包进来的几样东西：

- `/deslop` 和 `deslop` skill 随 `cursor-team-kit` 插件提供。
- `control-cli`（用于 CLI 和 TUI）和 `control-ui`（用于浏览器、Electron、Web）也在 `cursor-team-kit` 里。
- `/create-skill` 是 Cursor 的内置命令。Cursor 还内置了一个会盯着 PR 的 `/autopilot`。在 `poteto-mode` 里，关于 PR 状态的请求会改走[看护行动手册](./skills/poteto-mode/playbooks/babysit.md)。

想要全套的话，把 `cursor-team-kit` 和 pstack 一起安装。

## 为什么没有规划类 skill？

Cursor 已经有一个很好的 Plan 模式，它和 pstack 配合得很好。但就我个人而言，我不相信规划。最好的规格就是代码。如果你确实想做一份计划，[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 能覆盖，但它不是默认。

## 把它变成你的

`poteto-mode` 是我的风格。你未必想要完全一样的东西。

输入 [`/automate-me`](./skills/automate-me/SKILL.md)。它挖掘你最近的对话记录，根据你实际的工作方式起草一个 `<your-name>-mode` skill，并在底层经由 pstack 路由。你把 pstack 留作底座，同时得到一个属于你自己的、与 `poteto-mode` 并排的路由 skill。

模型也可以配置。输入 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)。它检测你有权访问的模型，并写一条始终应用的小规则，把每个角色（代码、判断、各个评审面板）映射到一个模型。每个 skill 都会读它，规则缺失时回退到合理的默认值，所以你只覆盖你想改的。

当某个默认值发生变化，变化之前写好的规则仍会钉住旧默认值。删掉那些角色行，或者删掉文件，然后重新运行 `/setup-pstack`。重跑会保留任何一个模型与默认值不同的角色。

## 自动化

pstack 还附带一套休眠中的 [benny 自动化包](./automations/benny/)。benny 对 Slack 的问题报告做分诊，然后用真实的 UI 证据复现并修复已确认的 bug。它的文件没有注册为斜杠 skill。

要设置的话，让 Cursor 指向 [`FOR_AGENTS.md`](./automations/benny/FOR_AGENTS.md)。设置过程会把这个包复制到目标仓库的 `.cursor/automations/benny/`，在那里启用 pstack 以共享 skill，并把用户配置留在复制出来的包之外。benny 跑在 Cursor 自动化上，因此仅限 Cursor。

## 许可证

MIT

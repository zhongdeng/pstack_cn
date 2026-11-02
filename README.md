# pstack

我是 [poteto](https://x.com/poteto)。我不是总裁也不是 CEO，但我在 Meta、Netflix 和 Cursor 处理过数百万行代码。我也是 React 核心团队成员，参与构建和维护 React Compiler。

越来越多人觉得 AI 写的代码太多 AI 腔（slop）。我同意。我不想带着二十个 AI 腔制造者一起发布。没有质量的吞吐量不是我想追求的目标。想跑得快，先往深里走。

**pstack 就是我的答案。** 这些技能就是我在 Cursor 每天用来交付高质量代码的那一套。它把 Cursor 变成一个真正的工程团队。目标不是最大化代码行数，恰恰相反。pstack 帮你写得更少，但质量更高。

**pstack 给你无所畏惧的并行能力。** 当你能在一个智能体上深入下去，并相信它会写出可验证的好代码，你就能真正放心地并行。用 `poteto-mode` 启动多个智能体，相信它们会对工作应用严格的工程原则。

**Cursor 给你集各家之长。** 每个前沿模型都有强项和弱项。pstack 可以搭配任何模型使用。事实上，我的很多技能都用多模型工作流，发挥每个模型的独特优势。

fork 它。改进它。变成你自己的。欢迎 PR！

## 安装

```bash
/add-plugin pstack
```

在 Claude Code 中：

```bash
/plugin marketplace add cursor/plugins
/plugin install pstack@cursor-plugins
```

Claude Code 对第三方市场默认关闭自动更新，所以 pstack 会停留在你安装的版本。要开启，运行 `/plugin`，打开 **marketplaces** 标签页，选择 `cursor-plugins`，然后选 **enable auto-update**。要手动更新一次，运行 `claude plugin update pstack@cursor-plugins`。

Claude Code 会给插件命令和智能体加前缀，所以 `/poteto-mode` 变成 `/pstack:poteto-mode`。[Claude Code 适配器](./docs/harness/claude-code.md)映射了其他所有 Cursor 名称。在 Claude Code 中，`/pstack:setup-pstack` 会把你的模型选择写入 `~/.claude/rules/pstack-models.md`，需要 Cursor 独有功能的步骤（例如 bugbot 或 automations）会被跳过，并附一行说明。

Claude Code 安装的是 pstack 的生成副本，包括这份 readme 和指南，来自仓库根目录的 [`harness/pstack/`](https://github.com/cursor/plugins/tree/main/harness/pstack)。改动 pstack 后，在仓库根目录运行 `node scripts/generate-pstack-harness-trees.mjs` 并提交结果。生成副本过期时 CI 会失败。

## 快速开始

两步：

1. 运行 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)，选一个推理预算，再选你想用的模型。
2. 做任何需要严谨性的工作时，用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。

第一次来？[pstack 指南](./docs/guide/README.md)带你走完一个真实任务，从安装、写提示词到验证和通宵运行。卡住了，或者不确定该用哪个技能？问 [`/poteto-help`](./skills/poteto-help/SKILL.md)。

就这样。其他技能都是按需使用的，mode 技能会在需要时替你调用。开箱即用时，mode 按模型强项分工：代码类委派（功能、重构、修 bug、性能、爬山优化）交给 grok，最难的改动、文字和判断交给 opus 5.5。默认面板是 opus 5.5 / grok。[`/setup-pstack`](./skills/setup-pstack/SKILL.md) 可以改其中任何一项。

## 用法

在任务开始时用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)。它读取你的请求，从一组作战手册中挑选，并按步骤需要运行其他技能。

在输入任务前，先从 `/` 菜单选 `/poteto-mode`，这样 Cursor 会把技能附加到消息上。

### 直接用 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)

这个技能是主快捷入口。我需要智能体做严谨工程工作时就用它。它自带二十三个作战手册：

```
/poteto-mode this pr has a subtle bug where the scroll drifts every 750ms even when idle. repro
first, then fix and verify.
```

```
/poteto-mode i'm going to bed. land the stack even if ci flakes. i want everything merged by
morning.
```

<details>
<summary>二十三个作战手册</summary>

| 作战手册 | 适用场景 |
|---|---|
| [investigation](./skills/poteto-mode/playbooks/investigation.md) | 只读问题。x 是怎么工作的，y 为什么这样建，我们确定吗。 |
| [bug fix](./skills/poteto-mode/playbooks/bug-fix.md) | 复现缺陷，定位根因，用运行时证据修复。 |
| [perf](./skills/poteto-mode/playbooks/perf-issue.md) | 追踪实测到的变慢，并对照基线改进。 |
| [hillclimb](./skills/poteto-mode/playbooks/hillclimb.md) | 针对一个目标持续、科学地改进某个指标，循环假设并做前后测量，每个被接受的改进提交一次。 |
| [runtime forensics](./skills/poteto-mode/playbooks/runtime-forensics.md) | 从埋点诊断线上症状（泄漏、空闲 CPU 空转、卡顿）。 |
| [trace forensics](./skills/poteto-mode/playbooks/trace-forensics.md) | 诊断捕获的性能分析产物（cpuprofile、trace、spindump、堆快照）。 |
| [feature](./skills/poteto-mode/playbooks/feature.md) | 新增或改变行为，从具名的数据形状出发构建。 |
| [refactoring](./skills/poteto-mode/playbooks/refactoring.md) | 保持行为不变的结构或形状改动。 |
| [prototype](./skills/poteto-mode/playbooks/prototype.md) | 一次性草图，低成本地做设计或行为决策，或通过观察来定夺实证分歧。 |
| [visual parity](./skills/poteto-mode/playbooks/visual-parity.md) | 两套实现之间像素级一致的 UI 等价。 |
| [authoring a skill](./skills/poteto-mode/playbooks/authoring-a-skill.md) | 编写或编辑 SKILL.md。 |
| [eval](./skills/poteto-mode/playbooks/eval.md) | 盲测技能或提示词改动如何影响智能体行为。 |
| [babysit](./skills/poteto-mode/playbooks/babysit.md) | 把 PR 或 PR 栈推进到可合并：冲突、评审线程、CI。 |
| [shipping](./skills/poteto-mode/playbooks/shipping.md) | 独立验证一个全绿的 PR 栈，然后默认通过 GitHub（可用时用 origin）自底向上落地连续已验证的提交。 |
| [autonomous run](./skills/poteto-mode/playbooks/autonomous-run.md) | 不停顿地把长任务推进到完成。 |
| [orchestrate](./skills/poteto-mode/playbooks/orchestrate.md) | 把长期项目交给一个协调聊天：跨多天、多个堆叠 PR、成群的子智能体。 |
| [autopilot-full](./skills/poteto-mode/playbooks/autopilot-full.md) | 把独立 PR 推进到合并，每个 PR 一个负责人。一个 swarm 验证每个代码就绪的 head，之后对补丁的每次改动都重新检查。 |
| [autopilot-stack](./skills/poteto-mode/playbooks/autopilot-stack.md) | 不含合并的 autopilot-full。构建并验证 PR 供操作者评审和落地，只把 PR 堆叠在它所基于的 PR 上。 |
| [session pickup](./skills/poteto-mode/playbooks/session-pickup.md) | 恢复或接管前一个智能体进行中的工作。 |
| [pause safely](./skills/poteto-mode/playbooks/pause-safely.md) | 干净地挂起进行中的工作，以便之后恢复。 |
| [multi-phase plan](./skills/poteto-mode/playbooks/multi-phase-plan.md) | 跨阶段或跨堆叠 PR 的工作。 |
| [worktree cleanup](./skills/poteto-mode/playbooks/worktree-cleanup.md) | 通过清理已合并或废弃的 worktree 和陈旧的 iOS 模拟器回收磁盘，带安全门控。 |
| [opening a pr](./skills/poteto-mode/playbooks/opening-a-pr.md) | 从有序的小提交开一个就绪 PR，标题用 conventional commits，正文用简报风格。每个其他作战手册结束时都会调用。 |

</details>



调用时它会：

1. 把你的任务匹配到一个[作战手册](./skills/poteto-mode/playbooks/)，打开一个待办列表，开头几项就是它的步骤，逐字复制。
2. 按步骤触发路由到其他技能。
3. 写出不 AI 腔的回复，面向消费者和维护者。

完整规则和作战手册在 [`skills/poteto-mode/SKILL.md`](./skills/poteto-mode/SKILL.md)。

要让 [`/poteto-mode`](./skills/poteto-mode/SKILL.md) 跨轮次保持开启，从 `/` 菜单选它，然后按 option+enter（Mac）或 alt+enter（Windows）而不是 enter。这样它会变成[自定义模式](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，Cursor 会在智能体窗口和 CLI 中提供。它会每轮都留在上下文中，直到你退出该模式。直接按 enter 只会把它附加到一条消息。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 Cursor 的 `/loop` 命令配合得极好。你可以让 Cursor 连续工作很多小时而不牺牲严谨性。

## 技能

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 会在步骤需要时替你运行其中大部分（`how`、`why`、`architect`、`arena`、`swarm`、`interrogate`、`unslop`、`no-comments`、`technical-writing`、`tdd` 以及各项原则）。下表是当你想要直接调用某一个时用的：

```
/how do we cancel runs? do we have an n+1 when we look up every run to cancel?
```

```
/interrogate review this pr.
```

<details>
<summary>所有技能</summary>

| 技能 | 何时使用 |
|---|---|
| [`/poteto-mode`](./skills/poteto-mode/SKILL.md) | 任何非平凡任务的默认入口。 |
| [`/poteto-help`](./skills/poteto-help/SKILL.md) | 你是 pstack 新手，或不确定哪个技能、作战手册或原则合适。它会弄清你想做什么，回答那部分，并给你一段可直接输入的提示词。只在你输入 `/poteto-help` 时运行。 |
| [`/in-your-own-words`](./skills/in-your-own-words/SKILL.md) | 你想让智能体在开始前复述你的目标和问题。只在你输入 `/in-your-own-words` 时运行。 |
| [`/sharpen`](./skills/sharpen/SKILL.md) | 你想在发送前把提示词变深而不是变大：顶级专业人士会做而你没要求的事、他们会从什么原始材料起步、他们的方法和工具，以及一个外部检查来确认结果正确。交回重写后的提示词，把你的选择留给你。不执行任务。只在你输入 `/sharpen` 时运行。 |
| [`/how`](./skills/how/SKILL.md) | 你想了解某个子系统如何工作的走查。 |
| [`/why`](./skills/why/SKILL.md) | 你想知道某样东西为什么这样建。运行时发现可用的 MCP，并行查询每个证据类别（源码控制、问题跟踪、长文文档、实时聊天、基础设施可观测性、错误跟踪、分析仓库）。 |
| [`/recall`](./skills/recall/SKILL.md) | 你开始或恢复工作时，想从自己的聊天历史和共享记录中重建某个主题的近期上下文，交回一份紧凑的当前状态简报。 |
| [`/ketchup`](./skills/ketchup/SKILL.md) | 你想知道自你上条消息以来这个聊天里改了什么，用平实语言和小图示，列出每一项等你处理的事，且仅凭回复就能决定，即使这让回复变长。 |
| [`/ketchup-video`](./skills/ketchup-video/SKILL.md) | 你想把 `/ketchup` 的追平内容做成带字幕的幻灯片短视频，等你处理的调用以文字形式放在下面。 |
| [`/blast-radius`](./skills/blast-radius/SKILL.md) | 你有一个看起来很小的改动，想知道它还可能破坏什么，并用运行代码而非断言来证明那个“安全”所依赖的关键事实。 |
| [`/architect`](./skills/architect/SKILL.md) | 你即将写跨函数边界的代码，想先定下调用方的用法、类型和模块形状。 |
| [`/arena`](./skills/arena/SKILL.md) | 你想对同一件事做 N 个并行尝试，然后取各自最好的部分。 |
| [`/swarm`](./skills/swarm/SKILL.md) | 你想让 N 个并行工作者处理不同切片或竞速，然后汇总成一份报告。 |
| [`/interrogate`](./skills/interrogate/SKILL.md) | 你有一个 diff，想让不同模型试着攻破它，只保留有运行证明的发现。 |
| [`/automate-me`](./skills/automate-me/SKILL.md) | 你想要自己的 `-mode` 技能，根据你实际的工作方式起草。 |
| [`/make-bot-ui`](./skills/make-bot-ui/SKILL.md) | 你想要一个页面或仪表盘，按钮通过 webhook 唤醒 Grok Bot，包括 sender-key 交接和 Tailscale。 |
| [`/setup-pstack`](./skills/setup-pstack/SKILL.md) | 你想按角色选择 pstack 用哪些模型。检测你的模型并写一条配置规则。 |
| [`/reflect`](./skills/reflect/SKILL.md) | 一个长任务落地了，你想把配方固化为技能编辑。 |
| [`/correct`](./skills/correct/SKILL.md) | 你总是为同样的错误纠正智能体。从历史中挖掘错误类别，在可行的最高层级修复每一类（架构，然后类型、lint 和 CI，然后测试，文档最后），并维护一张表，把每条规则和它的执行方式配对。 |
| [`/teach`](./skills/teach/SKILL.md) | 你想真正理解一个改动或子系统，而不只是拿到摘要。运行 how + why，编织成一份平实的解释，逐图构建。 |
| [`/tdd`](./skills/tdd/SKILL.md) | 你在修 bug，且有廉价的本地测试路径。先写失败的测试，再修复。 |
| [`/benchmark-checklist`](./skills/benchmark-checklist/SKILL.md) | 你跑了基准测试或测了加速/回退。在报告或据此行动前审查这个数字（限流器、调优、错误、重复运行、端到端相关性）。 |
| [`/no-comments`](./skills/no-comments/SKILL.md) | 评审前剥离注释；生成 Comment Sicko，修复被接受的发现，为声称的约束提供编码方案。 |
| [`/typescript-best-practices`](./skills/typescript-best-practices/SKILL.md) | 你在阅读或编辑 TypeScript。把类型系统纪律原则落到语法上。 |
| [`/figure-it-out`](./skills/figure-it-out/SKILL.md) | 没有内置作战手册合适。为任务设计一个严谨、可审计的作战手册。 |
| [`/show-me-your-work`](./skills/show-me-your-work/SKILL.md) | 你想要可评审的决策轨迹。把决策记录到可提交的 tsv。 |
| [`/create-verification-skill`](./skills/create-verification-skill/SKILL.md) | 你的项目没有脚本化方式来证明应用行为。生成一个项目本地的验证技能，带功能地图，适用于任何语言或平台。 |
| [`/maintain-verification-skill`](./skills/maintain-verification-skill/SKILL.md) | 你的验证技能的功能地图已与应用漂移。源码扫描 + 一次实机检查，最多一个 PR 的已证明修正。 |
| [`/create-formal-verification-skill`](./skills/create-formal-verification-skill/SKILL.md) | 测试无法触及会破坏竞态、重试、状态机、解析器或不安全代码的场景。用合适的工具验证一个性质，并生成项目本地技能在每次改动时复查。 |
| [`/maintain-formal-verification-skill`](./skills/maintain-formal-verification-skill/SKILL.md) | 你的形式验证覆盖的代码自上次检查后已改动。更新模型、运行框架或性质以匹配代码，重跑，并说明每个失败是验证漂移还是代码 bug。 |
| [`/statechart`](./skills/statechart/SKILL.md) | 拥有该行为的人需要看到它，而不是读规格。检查 TLA+ 模型，把用户看到的东西画成 mermaid 状态图，标出每个违反规则的状态，并给出到每个状态的最短路径。 |
| [`/unslop`](./skills/unslop/SKILL.md) | 你在清理文字。去除 AI 腔。 |
| [`/bro`](./skills/bro/SKILL.md) | 你想把最后一条消息用平实人话重述，不要术语。 |
| [`/technical-writing`](./skills/technical-writing/SKILL.md) | 分层文档标准（Diátaxis + Google 开发者风格 + STE + Global English），用于文档、RFC、readme、PR 描述、提交信息。 |

</details>



### 示例

我大多在任务开始时输入 [`/poteto-mode`](./skills/poteto-mode/SKILL.md)，让它路由到作战手册。其他技能按步骤需要触发。有几个我会直接调用。


<details>
<summary>所有示例</summary>

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

## `poteto-agent` 和 Comment Sicko 子智能体

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 在接收它的聊天中运行。那个聊天拥有作战手册、待办列表和每次子智能体生成。

pstack 还提供 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md)，作为运行期间生成的委派任务的包装器。它在做任何工作前完整读取 `poteto-mode`，包括其内联原则索引。换成 `generalPurpose` 会跳过这次读取并产生漂移。不要生成 `poteto-agent` 来运行作战手册本身。

[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 和 [`subagent_type: "poteto-agent"`](./agents/poteto-agent.md) 走同一个包装器。

pstack 还提供 [Comment Sicko](./agents/comment-sicko.md)，一个只读注释评审器，以 `subagent_type: "comment-sicko"` 提供。通常通过 [`/no-comments`](./skills/no-comments/SKILL.md) 调用，而不是直接调用。

## 原则

二十四个短技能，每个一条原则。`poteto-mode` 内联索引它们，并在任务开始时读取该索引。独立文件的存在是为了让其他技能能按名称引用原则，也让索引能指向每条原则的完整规则。

<details>
<summary>全部二十四条原则</summary>

| 原则 | 分组 | 规则 |
|---|---|---|
| [laziness-protocol](./skills/principle-laziness-protocol/SKILL.md) | core | 倾向删除和解决问题的最小改动。 |
| [foundational-thinking](./skills/principle-foundational-thinking/SKILL.md) | core | 写逻辑前应用：选择核心类型和数据结构，安排脚手架与功能工作的顺序，问并发参与者共享什么。把数据结构搞对，下游代码就变得显然。 |
| [redesign-from-first-principles](./skills/principle-redesign-from-first-principles/SKILL.md) | core | 把需求当作第一天的根本假设来重新设计，而不是硬加上去。 |
| [attack-the-premise](./skills/principle-attack-the-premise/SKILL.md) | core | 当两个或更多共享同一前提的修复都卡在同一道门时应用。把前提写下来，直接检验它，再写下一个假设它的修复。 |
| [subtract-before-you-add](./skills/principle-subtract-before-you-add/SKILL.md) | core | 先移除死重、冗余校验器和桩引用，再在更简单的基础上构建。 |
| [minimize-reader-load](./skills/principle-minimize-reader-load/SKILL.md) | core | 数一数问题和答案之间的层数，以及读者脑中的隐藏状态；合并单调用方包装器，缩小可变作用域。 |
| [outcome-oriented-execution](./skills/principle-outcome-oriented-execution/SKILL.md) | core | 在有明确阶段边界的计划重写和迁移中应用。收敛到目标架构；不要用一次性兼容代码保留平滑的中间状态。 |
| [experience-first](./skills/principle-experience-first/SKILL.md) | core | 选用户愉悦而非实现便利；少发几个打磨好的功能，而不是多发几个粗糙的。 |
| [exhaust-the-design-space](./skills/principle-exhaust-the-design-space/SKILL.md) | core | 构建 2-3 个竞争原型，并排比较后再决定。 |
| [build-the-lever](./skills/principle-build-the-lever/SKILL.md) | core | 适用于任何非平凡工作，不只是批量工作：编辑、迁移、分析、检查。构建做这件事或证明它的工具（codemod、脚本、生成器，或子智能体遵循的技能），而不是手工做。工具是评审者能重跑的产物。 |
| [model-the-domain](./skills/principle-model-the-domain/SKILL.md) | architecture | 用结构编码领域，而不是散落的条件分支。 |
| [boundary-discipline](./skills/principle-boundary-discipline/SKILL.md) | architecture | 把守卫集中在系统边界（CLI、配置、网络、外部 API）；信任内部类型，把业务逻辑留在纯函数里。 |
| [type-system-discipline](./skills/principle-type-system-discipline/SKILL.md) | architecture | 让非法状态无法表示，给语义原语打品牌，在边界解析外部数据，穷尽变体，从权威 schema 派生。 |
| [make-operations-idempotent](./skills/principle-make-operations-idempotent/SKILL.md) | architecture | 无论之前是否有部分运行，都收敛到同一最终状态。 |
| [migrate-callers-then-delete-legacy-apis](./skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | architecture | 在同一波次迁移调用方并删除旧 API，而不是保留兼容层。 |
| [separate-before-serializing-shared-state](./skills/principle-separate-before-serializing-shared-state/SKILL.md) | architecture | 先消除共享；只有当单一共享写入者是真正的不变量时，才在结构上串行化。 |
| [prove-it-works](./skills/principle-prove-it-works/SKILL.md) | verification | 完成任务后、宣布完成前应用。对照真实产物验证（运行功能、读取实际值、检查 diff），而不是代理、自述或“它能编译”。 |
| [fix-root-causes](./skills/principle-fix-root-causes/SKILL.md) | verification | 把每个症状追溯到系统第一次出错的地方，并在那里修复。只有当它处理的状态合法时，守卫才算修复。 |
| [sequence-verifiable-units](./skills/principle-sequence-verifiable-units/SKILL.md) | verification | 适用于多步工作（扫描、迁移、一系列相似编辑）以及你如何堆叠提交和 PR。把工作拆成小单元，每个都以可验证状态结束，下一个之前检查每个，并安排交付顺序，让序列向评审者证明自己。 |
| [test-behavior-not-implementation](./skills/principle-test-behavior-not-implementation/SKILL.md) | verification | 在你编写、修改或保留测试时应用。断言代码用户能观察到的东西，这样行为破坏时测试失败，只有内部改动时测试继续通过。 |
| [explain-the-number](./skills/principle-explain-the-number/SKILL.md) | verification | 在你信任、报告或依据你测得的数字行动前应用：加速、回退、吞吐量、延迟或 eval 结果。找出限制它的因素，并排除它测的是你以为的工作之外的东西。 |
| [guard-the-context-window](./skills/principle-guard-the-context-window/SKILL.md) | delegation | 把批量工作路由给子智能体；主线程保留摘要，而不是原始负载。 |
| [never-block-on-the-human](./skills/principle-never-block-on-the-human/SKILL.md) | delegation | 继续推进，呈现结果，让人事后纠正；只为不可逆操作保留确认。 |
| [encode-lessons-in-structure](./skills/principle-encode-lessons-in-structure/SKILL.md) | meta | 把规则编码为 lint、元数据标志、运行时检查或脚本，而不是更多文字。 |

</details>

## 未随包提供

`poteto-mode` 引用但未捆绑的几样东西：

- `/deslop` 和 `deslop` 技能在 `cursor-team-kit` 插件中提供。
- `control-cli`（用于 CLI 和 TUI）和 `control-ui`（用于浏览器、Electron、Web）也在 `cursor-team-kit` 中提供。
- `/create-skill` 是 Cursor 内置的。Cursor 还内置了 `/autopilot` 来监视 PR。在 `poteto-mode` 内，PR 状态请求会转到 [babysit 作战手册](./skills/poteto-mode/playbooks/babysit.md)。

想要完整套装，就把 `cursor-team-kit` 和 pstack 一起安装。

## 为什么没有规划技能？

Cursor 已有很好的 plan mode，和 pstack 配合得很好。但个人而言，我不相信规划。最好的规格是代码。如果你确实想做计划，[`/poteto-mode`](./skills/poteto-mode/SKILL.md) 覆盖了，但不是默认。

## 变成你自己的

`poteto-mode` 是我的风格。你可能不想要完全一样。

输入 [`/automate-me`](./skills/automate-me/SKILL.md)。它挖掘你近期的对话记录，根据你实际的工作方式起草一个 `<your-name>-mode` 技能，底层路由到 pstack。你保留 pstack 作为基础，最终在 `poteto-mode` 旁边拥有自己的路由技能。

模型也可配置。输入 [`/setup-pstack`](./skills/setup-pstack/SKILL.md)。它检测你能访问的模型，并写一条小的始终应用的规则，把每个角色（代码、判断、评审面板）映射到模型。每个技能都读取它，规则缺失时回退到合理默认值，所以你只覆盖你想改的。

当默认值改变时，在改变之前写的规则仍会固定旧默认值。删掉那些角色行，或删掉文件，再运行 `/setup-pstack`。重跑会保留任何模型与默认值不同的角色。

## 自动化

pstack 还提供一个休眠的 [benny 自动化包](./automations/benny/)。benny 分诊 Slack 问题报告，然后用真实 UI 证据复现并修复确认的 bug。它的文件未注册为斜杠技能。

要设置，把 Cursor 指向 [`FOR_AGENTS.md`](./automations/benny/FOR_AGENTS.md)。设置会把包复制到目标仓库的 `.cursor/automations/benny/`，在那里为共享技能启用 pstack，并把用户配置留在复制的包之外。benny 运行在 Cursor automations 上，所以仅限 Cursor。

## 许可证

MIT
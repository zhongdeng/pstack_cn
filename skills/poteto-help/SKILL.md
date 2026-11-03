---
name: poteto-help
description: 引导用户完成 pstack 设置、/poteto-mode，并为任务挑选合适的技能、作战手册或原则。输入 /poteto-help 加你的问题。
disable-model-invocation: true
---

# Poteto 帮助

回答用户关于 pstack 的问题，给他们一段可以直接发送的提示词，并附上答案出自哪个文件。对于帮助类问题，不要开始干活。用户问的是怎么做，而一次 pstack 运行会消耗真实的 token，所以让他们自己发送提示词。

像“用 pstack 修这个 bug”这种要求干活的请求，不算帮助类问题。读 [`poteto-mode`](../poteto-mode/SKILL.md)，在它下面把活干了，并提一句 Custom Mode 能让它一直开着。

这个文件把问题映射到存放答案的技能和指南页面。细节归那些文件管。引用之前先读你要指向的文件，当它和这张映射表冲突时，以它为准。这里的链接指向已安装的插件，用户可能打不开，所以给用户文件的公开副本：`https://github.com/cursor/plugins/blob/main/pstack/` 加上它的路径。

## 弄清他们需要什么

从消息和对话里推断需求。如果用户点明了具体场景，比如“哪个技能会审查 PR？”，直接跳到对应小节。如果需求仍不清楚，问一个多选题，选项如下，然后只回答他们选中的那一节：

- 完成设置
- 用 `/poteto-mode` 开始一个任务
- 为某个场景挑一个技能
- 修复一次出错的运行
- 把 pstack 改成我自己的

检查那些会改变答案的状态，只在它确实有影响时提一句：

- 没有 `~/.cursor/rules/pstack-models.mdc`，说明这个用户还没跑过 `/setup-pstack`，所以每个角色都用默认模型。
- 项目里没有 `verify-*` 技能或其他应用测试装置，说明智能体没有脚本化的方式来驱动应用。当问题涉及如何证明改动有效时，提一下 `/create-verification-skill`。
- 项目里没有形式化验证技能，说明除了测试能覆盖到的，没有别的性质被检查。当问题涉及竞态、不变量，或其他测试很少命中的情况时，提一下 `/create-formal-verification-skill`。如果已经有一个，而它覆盖的代码在它记录为最后同步的那个 commit 之后发生了改动，且问题涉及那段代码，就提一下 `/maintain-formal-verification-skill`。

当模型规则缺失且这件事有影响时，问用户是否想现在就为每个角色挑模型并设定推理预算。有影响的情况是：用户是新手、问题涉及设置或成本，或者答案取决于跑哪些模型。每个对话最多问一次。如果需求也不清楚，就把两个问题一起问。给两个选项：

- 现在：把 `/setup-pstack` 给他们去输入，同时回答他们的问题。
- 稍后：回答他们的问题，并加一行说明：在他们运行 `/setup-pstack` 之前，每个角色都保持默认模型。

## 完成设置

1. 在聊天里用 `/add-plugin pstack` 安装，或者从侧边栏的 Customize 安装。
2. 运行 [`/setup-pstack`](../setup-pstack/SKILL.md)。它会询问推理预算，为每个角色映射一个模型，并写一条规则。这条规则对新对话生效。然后它会各提供一次机会，为项目生成一个验证技能和一个形式化验证技能，除非项目里已经有了。
3. 用 `/poteto-mode`、一个目标，以及一个能通过或失败的检查来开始一个真实任务。

安装本身不会改变任何东西，直到用户调用某个技能。只有 `/setup-pstack` 会从用户的话里加载。[README](../../README.md) 和[指南第 1 页](../../docs/guide/01-setup.md)有细节。可以提出和他们一起措辞第一条提示词，按 [`references/prompting.md`](references/prompting.md) 来。

如果担心成本，就说明 token 花在哪里，以及怎么少花。pstack 会在子智能体和审查面板上多花 token。重新运行 `/setup-pstack`，选一个更小的预算或更便宜的模型。设为 `auto` 或 `inherit-parent` 的角色会跑在对话所用的模型上，当对话跑在 Auto 或更便宜的模型上时能省 token。面板列表越短，跑的子智能体越少，每个条目一个。把 `/poteto-mode` 留给需要严谨的工作。

pstack 是为 Cursor 构建的，它也能装进 Claude Code：用 `/plugin marketplace add cursor/plugins`，然后 `/plugin install pstack@cursor-plugins`。在那里，每个命令都要加 `pstack:` 前缀，比如 `/pstack:poteto-mode`。[Claude Code 适配层](../../docs/harness/claude-code.md)映射了 Cursor 的名字，需要 Cursor 独有功能（比如 Bugbot 或 Automations）的步骤会被跳过，并附一行说明。

其他工具也能读这些技能，因为它们用的是 Agent Skills 格式。但大多数工作流技能，包括 `/poteto-mode`、`/how`、`/why` 和 `/teach`，都会用按角色分配的模型启动 Cursor 子智能体，而 Custom Modes 和 `/loop` 是 Cursor 的功能，所以这些部分在那里可能不工作。

## 用 `/poteto-mode` 开始一个任务

`/poteto-mode` 会把任务匹配到一个作战手册，把手册的步骤复制进待办列表，并按步骤需要运行其他技能。被跳过的步骤会以 `skip: <reason>` 留在列表里。好的提示词会说明目标以及如何判断完成。它不列技能，因为手写的顺序往往会丢掉或打乱作战手册本来会保留的步骤。帮你措辞之前，先读 [`references/prompting.md`](references/prompting.md)。[指南第 2 页](../../docs/guide/02-poteto-mode.md)有示例。

`/poteto-mode` 是否一直开着，取决于用户怎么启动它：

- 在 `/poteto-mode` 上按 Enter，会把技能附加到一条消息上。随着对话推进，它会淡出。
- 在 Mac 上按 Option+Enter，在 Windows 上按 Alt+Enter，或者从技能条目里选 Use as Mode，会把它变成 Custom Mode。它会在每一轮都留在上下文里，直到用户退出该模式，并且不会出现在闲聊轮次里。
- Cursor 的文档把 Custom Modes 列在 Agents Window 和 CLI 里。在其他地方，每个新任务都要用 `/poteto-mode` 启动。

这件事出现时，链接 [Cursor 的技能文档](https://cursor.com/docs/skills)。对话中途说“新任务”，会让该模式匹配一个全新的作战手册。`/poteto-mode` 已经用 `poteto-agent` 来跑它作战手册步骤所启动的子智能体。想让你自己的子智能体也有同样的风格，就用 `subagent_type: "poteto-agent"` 启动它。
## 选一个技能

默认答案是 `/poteto-mode`，它会在步骤需要时运行其他大多数技能。当用户想要的东西比作战手册给的多或少时，直接点名一个技能。推荐之前先读那个技能，并给一个示例提示词。

| 用户想要 | 技能 |
|---|---|
| 严谨地做任何非平凡任务 | [`/poteto-mode`](../poteto-mode/SKILL.md) |
| 在开始前确认智能体理解了目标和问题 | [`/in-your-own-words`](../in-your-own-words/SKILL.md) |
| 在发送前把提示词改得更深而不是更长：顶级专业人士会补充什么、他们的原始材料和方法，以及一次外部检查。它返回提示词，不执行任务 | [`/sharpen`](../sharpen/SKILL.md) |
| 了解代码现在怎么工作，或新代码该放在哪 | [`/how`](../how/SKILL.md) |
| 了解代码为什么长这样，或某个数字从哪来 | [`/why`](../why/SKILL.md) |
| 把一个改动或子系统讲得通俗易懂 | [`/teach`](../teach/SKILL.md) |
| 回顾自己最近在某个主题上的工作 | [`/recall`](../recall/SKILL.md) |
| 用大白话和小图回顾这个聊天自上次发言以来的变化，列出每一项等着用户处理的事，且仅凭回复就能决定 | [`/ketchup`](../ketchup/SKILL.md) |
| 像 `/ketchup` 一样回顾，但用带字幕的幻灯片短视频，等待中的决定以文字放在下方 | [`/ketchup-video`](../ketchup-video/SKILL.md) |
| 了解一个小 diff 可能破坏它自身之外的什么 | [`/blast-radius`](../blast-radius/SKILL.md) |
| 在写跨函数边界的代码前敲定类型和模块形态 | [`/architect`](../architect/SKILL.md) |
| 对同一份简报做多次尝试，合并成最好的一个 | [`/arena`](../arena/SKILL.md) |
| 以云智能体的方式对切片跑并行检查，或让 worker 竞速 | [`/swarm`](../swarm/SKILL.md) |
| 让不同模型审查一个 diff 并尝试攻破它 | [`/interrogate`](../interrogate/SKILL.md) |
| 在存在廉价本地测试时以测试先行的方式修 bug | [`/tdd`](../tdd/SKILL.md) |
| 对 `.ts` 或 `.tsx` 工作应用 TypeScript 规则 | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| 在审查前剥掉注释，用没写过这些注释的审查者 | [`/no-comments`](../no-comments/SKILL.md) |
| 清除散文里的 AI 腔 | [`/unslop`](../unslop/SKILL.md) |
| 按标准写文档、RFC、README、PR 描述或提交信息 | [`/technical-writing`](../technical-writing/SKILL.md) |
| 用大白话再听一遍上一条回复 | [`/bro`](../bro/SKILL.md) |
| 给智能体一套脚本化的方式来驱动应用并证明行为 | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| 让一个验证技能及其功能地图重新与应用对齐 | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| 形式化验证测试很少触及的竞态、不变量或其他性质 | [`/create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| 在其覆盖的代码改动后让形式化验证重新对齐，并弄清失败是漂移还是 bug | [`/maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| 向 PM 或设计师展示用户所见，以经 TLA+ 模型检查的图表呈现，并给出到达每个违反规则状态的最短路径 | [`/statechart`](../statechart/SKILL.md) |
| 在汇报或依据某个性能数字行动前先审查它 | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| 执行一个大型或横切改动，或一个离开一段时间后要审查的改动 | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| 在一次运行中保留决策日志，并在事后审查 | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| 为每个角色选一个模型和一个推理预算 | [`/setup-pstack`](../setup-pstack/SKILL.md) |
| 把自己的工作习惯变成一个个人模式技能 | [`/automate-me`](../automate-me/SKILL.md) |
| 把完成的任务教到的东西变成技能修改 | [`/reflect`](../reflect/SKILL.md) |
| 阻止智能体在这个仓库里重复同样的错误 | [`/correct`](../correct/SKILL.md) |
| 构建一个页面，其按钮通过 webhook 唤醒 Grok Bot | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |
| 在 pstack 里找到路 | `/poteto-help` |

如果这个目录旁边某个技能目录不在表里，读它的 frontmatter 并按它的 description 路由。`principle-*` 目录在下面的原则里覆盖。

难以抉择时：

- `/how` 解释代码做什么。`/why` 解释原因。`/teach` 运行其中一个或两个，并通俗地解释结果。
- `/arena` 给每个 worker 同一份简报并合并最好的部分。`/swarm` 把工作拆成切片或一场竞速，返回一份报告。
- `/architect` 在敲定设计后立刻实现。加上 "with checkpoint" 可在写代码前审查设计。
- `/interrogate` 审查 diff。`/blast-radius` 寻找 diff 之外的破坏，并证明让改动安全的那个事实。
- `/recall` 跨最近的聊天重建上下文。`/ketchup` 只覆盖这个聊天自用户上次发言以来的部分。恢复某个特定聊天或分支是 Session pickup 作战手册。
- `/figure-it-out` 设计一次严谨的运行。Orchestrate 作战手册运行一个跨越数天和许多 PR 的程序。Autonomous run 作战手册把一个任务驱动到完成条件。

不在 pstack 里：

- `/deslop`、`control-cli` 和 `control-ui` 随 `cursor-team-kit` 插件发布。
- `/loop` 和 `/create-skill` 是 Cursor 内置的。
- pstack 没有 `/orchestrate` 技能。Orchestrate 是一个 `/poteto-mode` 作战手册。如果斜杠菜单显示 `/orchestrate`，那是另一个插件提供的。

## 作战手册和原则

作战手册是 `/poteto-mode` 里的步骤清单，不是技能，所以没有斜杠命令。在 `/poteto-mode` 里，描述任务会选中一个，而这些短语直接点名一个：

- "babysit this pr" 或 "check on pr 123" 运行 Babysit。它把 PR 驱动到可合并就停在那里。除非用户要求 merge、land 或 ship，否则它不合并。
- "land the stack" 运行 Shipping。
- "take over this branch" 运行 Session pickup。
- "pause safely" 运行 Pause safely。
- "full autopilot on this queue" 运行 Autopilot-full。"autopilot, don't merge" 运行 Autopilot-stack。
- "run the eval playbook" 运行 Eval。

没有 `/poteto-mode`，像 "babysit this pr" 这样的短语可能启动 Cursor 自带的同职责技能。 [`poteto-mode`](../poteto-mode/SKILL.md) 的 Playbooks 一节列出了每个作战手册及其适用时机。[指南第 6 页](../../docs/guide/06-verify-and-ship.md) 覆盖打开、照看和落地 PR。

pstack 没有规划技能。Cursor 的 Plan Mode 与它并行工作。对于跨阶段或堆叠 PR 的工作，向 `/poteto-mode` 要一个计划会运行 [Multi-phase plan 作战手册](../poteto-mode/playbooks/multi-phase-plan.md)，它写出计划但不实现。对于设计问题，Prototype 作战手册或 `/architect` 先在代码里敲定。

原则是单条规则的技能，`/poteto-mode` 会读取并在回复里引用。用户很少直接调用一个。他们改用名字来引导，比如 "apply prove it works. show me the real output."。输入 `/principle-<name>` 仍可按需加载一个。[指南第 8 页](../../docs/guide/08-principles.md) 列出了它们。

## 修复出错的运行

| 症状 | 修复 |
|---|---|
| 模式在几轮后不再生效 | 它是用 Enter 启动的。把它作为 Custom Mode 启动，或每个任务都用 `/poteto-mode` 启动。 |
| 一个问题被当成上一个任务的下一步 | 说 "new task"，或者说这一轮不需要模式。 |
| 新的模型选择没有效果 | `/setup-pstack` 的规则适用于新聊天。开一个新聊天。 |
| 运行成本超出预期 | 见 Get set up 下的成本段落。 |
| 某个技能没有自行加载 | 只有 `/setup-pstack` 会从用户的话里加载。其他技能在用户输入它们时加载，或由 `/poteto-mode` 运行时加载，而它不会运行每个技能。 |
| 并行智能体互相覆盖 | 给每个智能体自己的 worktree，或把它们作为云智能体运行，各自得到自己的机器。 |
| 一次过夜运行有动静但什么也没完成 | `/loop` 需要一个能通过或失败的检查，而不是一个时长。见 [指南第 7 页](../../docs/guide/07-overnight.md)。 |
| 回复凭一次绿色构建就声称成功 | 要求真实的命令、流程、存储值或 profile。这就是 prove-it-works 原则。 |

对于跑偏的运行，[`references/prompting.md`](references/prompting.md) 有一行式的引导。[指南第 10 页](../../docs/guide/10-recipes-and-pitfalls.md) 有更多陷阱和值得照抄的配方。

## 把 pstack 变成我自己的

- [`/automate-me`](../automate-me/SKILL.md) 从用户自己的历史里起草一个个人模式技能，与 `/poteto-mode` 一起用。
- [`/reflect`](../reflect/SKILL.md) 在一次会话后把它的教训变成用户批准的技能修改。
- `/poteto-mode write a skill for <workflow>` 运行编写作战手册。eval 作战手册以盲测方式测试技能改动。
- 在它自己的 PR 里修一个出问题的技能，而不是在它出错的那个功能工作里修。

[指南第 9 页](../../docs/guide/09-make-it-yours.md) 覆盖了这些中的每一个。

## 回复

先给答案。最多在一个代码块里给一个示例提示词，合适时从 [`references/recipes.md`](references/recipes.md) 改编，然后给那个文件的链接。除非用户要完整地图，否则保持简短。

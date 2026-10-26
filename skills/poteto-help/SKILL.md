---
name: poteto-help
description: 引导用户完成 pstack 的设置、/poteto-mode，以及为一项任务挑选技能、行动手册或原则。输入 /poteto-help 并带上一个问题。
disable-model-invocation: true
---

# Poteto 帮助

回答用户关于 pstack 的问题，交给他们一条可以发送的提示词，并链上答案所来自的文件。对于帮助问题，不要开始做那项工作。用户问的是怎么做，而一次 pstack 运行会花掉真实的 token，所以让他们自己把提示词发出去。

一条要求做事的消息，例如「用 pstack 修这个缺陷」，不是帮助问题。阅读 [`poteto-mode`](../poteto-mode/SKILL.md)，在它之下做这项工作，并提一次：自定义模式能让它保持开启。

本文件把问题映射到持有答案的技能和指南页。细节归那些文件所有。在引用你所路由到的文件之前先读它，当它与这张地图不一致时，以它为准。这里的链接指向已安装的插件，用户可能打不开，所以把该文件的公开副本给用户：`https://github.com/cursor/plugins/blob/main/pstack/` 再加上它的路径。

## 弄清他们需要什么

从消息和对话推断需求。点了名的情况，例如「哪个技能审查 PR？」，直接进入它的小节。如果需求仍不清楚，就问一个包含以下选项的单选问题，然后只回答他们选的那一节：

- 完成设置
- 用 `/poteto-mode` 开始一项任务
- 为一种情况挑选技能
- 修好一次出了问题的运行
- 把 pstack 变成我自己的

检查会改变答案的状态，只有在它确实改变答案时才提及：

- 没有 `~/.cursor/rules/pstack-models.mdc` 意味着这个用户还没跑过 `/setup-pstack`，因此每个角色都用它的默认模型。
- 项目里没有 `verify-*` 技能或其他应用测试夹具，意味着代理没有脚本化的方式来驱动应用。当问题是关于证明一项变更有效时，提及 `/create-verification-skill`。
- 项目里没有形式化验证技能，意味着没有任何性质被检查到测试所能达到的范围之外。当问题是关于竞态、不变量或其他测试很少命中的情况时，提及 `/create-formal-verification-skill`。当已经有一个，且它所覆盖的代码在它记录为上次同步的提交之后又变了，如果问题触及那段代码，就提及 `/maintain-formal-verification-skill`。

当模型规则缺失且这事重要时，问用户是否想现在为每个角色挑一个模型并定一个推理预算。当用户是新的、问题关于设置或费用，或者答案取决于哪些模型在跑时，这事就重要。每段对话最多问一次。如果需求也不清楚，就把两个问题一起问。给出两个选择：

- 现在：把 `/setup-pstack` 给他们去输入，同时也回答他们的问题。
- 以后：回答他们的问题，并加一行，说明在他们运行 `/setup-pstack` 之前，每个角色都保持默认模型。

## 完成设置

1. 在对话里用 `/add-plugin pstack` 安装，或从侧边栏的 Customize 安装。
2. 运行 [`/setup-pstack`](../setup-pstack/SKILL.md)。它询问推理预算，把模型映射到每个角色，并写一条规则。这条规则应用于新对话。然后它各提供一次，为项目生成验证技能和形式化验证技能，除非项目已经有了。
3. 用 `/poteto-mode`、一个目标，以及一个能通过或失败的检查，来开始一项真实任务。

在用户调用一项技能之前，安装不会改变任何东西。只有 `/setup-pstack` 会从用户的话里加载。[README](../../README.md) 和 [指南第 1 页](../../docs/guide/01-setup.md) 里有细节。提议和他们一起写好第一条提示词，依照 [`references/prompting.md`](references/prompting.md)。

如果担心的是费用，就说明 token 花在哪里，以及如何少花。pstack 把额外的 token 花在子代理和评审组上。重新运行 `/setup-pstack`，并选一个更小的预算或更便宜的模型。设为 `auto` 或 `inherit-parent` 的角色跑在对话的模型上，当对话跑在 Auto 或更便宜的模型上时，这样能省 token。更短的评审组列表会跑更少的子代理，每个条目一个。把 `/poteto-mode` 留给需要严格性的工作。

pstack 是为 Cursor 做的，它也可以装进 Claude Code，用 `/plugin marketplace add cursor/plugins`，然后 `/plugin install pstack@cursor-plugins`。在那里，每条命令都带 `pstack:` 前缀，例如 `/pstack:poteto-mode`。[Claude Code 适配器](../../docs/harness/claude-code.md) 映射 Cursor 的名字，而需要 Cursor 独有功能的步骤，例如 Bugbot 或 Automations，会跳过并附一行说明。

其他工具也能读这些技能，因为它们使用 Agent Skills 格式。但大多数工作流技能，包括 `/poteto-mode`、`/how`、`/why` 和 `/teach`，会以按角色划分的模型启动 Cursor 子代理，而自定义模式和 `/loop` 是 Cursor 的功能，所以那些部分在那里可能不能用。

## 用 `/poteto-mode` 开始一项任务

`/poteto-mode` 把任务匹配到一份行动手册，把行动手册的步骤复制进待办列表，并在步骤需要时运行其他技能。它跳过的步骤仍留在列表里，记为 `skip: <reason>`。一条好的提示词陈述目标，以及如何判断做完了。它不列举技能，因为手写的顺序往往会丢掉或重排行动手册会保留的步骤。在帮忙措辞之前，先读 [`references/prompting.md`](references/prompting.md)。[指南第 2 页](../../docs/guide/02-poteto-mode.md) 里有例子。

`/poteto-mode` 是否保持开启，取决于用户如何启动它：

- 在 `/poteto-mode` 上按 Enter，把技能附到一条消息上。随着对话往下走，它会淡去。
- 在 Mac 上 Option+Enter，或在 Windows 上 Alt+Enter，或从技能条目里选 Use as Mode，会把它变成自定义模式。它在每个回合都留在上下文里，直到用户退出该模式，并且它不进入随意的回合。
- Cursor 的文档在 Agents Window 和 CLI 里列出了自定义模式。在其他地方，每项新任务都用 `/poteto-mode` 开始。

当这一点出现时，链上 [Cursor 的技能文档](https://cursor.com/docs/skills)。对话中途，「新任务」会让模式去匹配一份全新的行动手册。`/poteto-mode` 已经用 `poteto-agent` 来启动其行动手册步骤所生成的子代理。要想让你自己的子代理用同样的风格，用 `subagent_type: "poteto-agent"` 来启动它。

## 挑选技能

默认答案是 `/poteto-mode`，它会在步骤需要时运行其他大多数技能。当用户想要比行动手册所给的更多或更少时，直接点名一项技能。在推荐之前先读该技能，并给一条示例提示词。

| 用户想要 | 技能 |
|---|---|
| 严谨地做任何非平凡任务 | [`/poteto-mode`](../poteto-mode/SKILL.md) |
| 在它开始之前，检查代理是否理解了他们的目标和问题 | [`/in-your-own-words`](../in-your-own-words/SKILL.md) |
| 在发送之前让提示词被改写得更深而不是更大：顶尖专业人士会补上什么、他们的原材料和方法，以及一次外部核对。它返回提示词，并不做这项任务 | [`/sharpen`](../sharpen/SKILL.md) |
| 知道代码现在如何工作，或新代码应该住在哪里 | [`/how`](../how/SKILL.md) |
| 知道代码为什么是这个形状，或一个数字从哪里来 | [`/why`](../why/SKILL.md) |
| 理解一处变更或一个子系统，讲得明白 | [`/teach`](../teach/SKILL.md) |
| 跟上他们自己在某个话题上最近的工作 | [`/recall`](../recall/SKILL.md) |
| 跟上这次对话里自他们上一条消息以来的变化，用白话和少量图示，每一项正等着他们的事项都列出来，并且只靠回复就能决定 | [`/ketchup`](../ketchup/SKILL.md) |
| 像 `/ketchup` 那样跟上，用一段幻灯片短静音视频，等待中的决定作为它下面的文字 | [`/ketchup-video`](../ketchup-video/SKILL.md) |
| 知道一个小 diff 在它自身之外可能弄坏什么 | [`/blast-radius`](../blast-radius/SKILL.md) |
| 在跨越函数边界的代码之前，先定下类型和模块形状 | [`/architect`](../architect/SKILL.md) |
| 对同一份任务书做几次尝试，合并成最好的那一份 | [`/arena`](../arena/SKILL.md) |
| 以云代理的方式，对切片做并行检查，或让工作单元竞赛 | [`/swarm`](../swarm/SKILL.md) |
| 让不同的模型审查一份 diff，并试图打破它 | [`/interrogate`](../interrogate/SKILL.md) |
| 当存在廉价的本地测试时，测试先行地修缺陷 | [`/tdd`](../tdd/SKILL.md) |
| 把 TypeScript 规则用于 `.ts` 或 `.tsx` 的工作 | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| 在审查之前剥掉注释，用一个没有写过这些注释的审查者 | [`/no-comments`](../no-comments/SKILL.md) |
| 把散文里的 AI 破绽清掉 | [`/unslop`](../unslop/SKILL.md) |
| 按某一标准写文档、RFC、README、PR 描述或提交说明 | [`/technical-writing`](../technical-writing/SKILL.md) |
| 再用白话听一遍上一条回复 | [`/bro`](../bro/SKILL.md) |
| 给代理一种脚本化的方式来驱动应用并证明行为 | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| 把一项验证技能及其功能地图重新对齐到应用 | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| 形式化地验证竞态、不变量或其他测试很少达到的性质 | [`/create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| 在它所覆盖的代码变更之后，把形式化验证重新对齐，并弄清一次失败是漂移还是缺陷 | [`/maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| 向产品经理或设计师展示用户所看到的、由模型核对过的图，每个缺陷画成一条带编号的路径，把一张商定的图变成 TLA+ 骨架，或对照它的 TLA+ 规格审计代码 | [`/statechart`](../statechart/SKILL.md) |
| 在报告一个性能数字或据以行动之前先核验它 | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| 跑一项大的或横切的变更，或一项在人离开之后再来审查的变更 | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| 在一次运行期间保持一份决策日志，并在之后审查它 | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| 为每个角色挑一个模型，并定一个推理预算 | [`/setup-pstack`](../setup-pstack/SKILL.md) |
| 把他们自己的工作习惯变成一项个人模式技能 | [`/automate-me`](../automate-me/SKILL.md) |
| 把一项完成的任务所教会的东西变成技能编辑 | [`/reflect`](../reflect/SKILL.md) |
| 阻止代理在这个仓库里重复同样的错误 | [`/correct`](../correct/SKILL.md) |
| 做一页其按钮能通过 webhook 唤醒 Grok Bot 的页面 | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |
| 在 pstack 里找到路 | `/poteto-help` |

如果旁边有一个技能目录不在表里，就读它的 frontmatter，并按其描述来路由。`principle-*` 目录在下面的原则一节覆盖。

难分的情况：

- `/how` 解释代码做什么。`/why` 解释原因。`/teach` 运行其中一个或两个，并把结果用白话讲出来。
- `/arena` 给每个工作单元同一份任务书，并合并最好的部分。`/swarm` 把工作分成切片或一场竞赛，并返回一份报告。
- `/architect` 在定下设计之后立刻实现。加上「with checkpoint」，就可以在它写代码之前审查设计。
- `/interrogate` 审查 diff。`/blast-radius` 寻找 diff 之外的破坏，并证明那一个让变更安全的事实。
- `/recall` 跨最近的对话重建上下文。`/ketchup` 只覆盖这次对话中用户上一条消息以来的部分。恢复某一段特定对话或分支，是 Session pickup 行动手册。
- `/figure-it-out` 设计一次严格的运行。Orchestrate 行动手册运行一个跨越数天和许多 PR 的项目。Autonomous run 行动手册把一项任务驱动到一个完成条件。

不在 pstack 里：

- `/deslop`、`control-cli` 和 `control-ui` 随 `cursor-team-kit` 插件发布。
- `/loop` 和 `/create-skill` 是 Cursor 内置的。
- pstack 没有 `/orchestrate` 技能。Orchestrate 是一份 `/poteto-mode` 行动手册。如果斜杠菜单显示 `/orchestrate`，那是另一个插件提供的。

## 行动手册与原则

行动手册是 `/poteto-mode` 内部的步骤列表，不是技能，所以它们没有斜杠命令。在 `/poteto-mode` 内部，描述任务就会挑中一份，而这些说法会直接点名一份：

- 「照看这个 pr」或「看看 pr 123」会运行 Babysit。它把 PR 驱动到可以合并并停在那里。除非用户要求合并、落地或发布，否则它不合并。
- 「落地这个栈」运行 Shipping。
- 「接管这个分支」运行 Session pickup。
- 「安全暂停」运行 Pause safely。
- 「对这个队列全自动驾驶」运行 Autopilot-full。「把它们叠成栈，先不要发布」运行 Autopilot-stack。
- 「跑 eval 行动手册」运行 Eval。

没有 `/poteto-mode` 时，像「照看这个 pr」这样的说法可能会改为启动 Cursor 自己的、做同一件事的技能。[`poteto-mode`](../poteto-mode/SKILL.md) 的 Playbooks 一节列出每一份行动手册以及它何时适用。[指南第 6 页](../../docs/guide/06-verify-and-ship.md) 涵盖开 PR、照看和落地 PR。

pstack 没有规划技能。Cursor 的 Plan Mode 可以与它一起使用。对于跨越多个阶段或叠放 PR 的工作，向 `/poteto-mode` 要一份计划会运行 [Multi-phase plan 行动手册](../poteto-mode/playbooks/multi-phase-plan.md)，它写下计划并不实现它。对于设计问题，Prototype 行动手册或 `/architect` 会先在代码里把它定下来。

原则是 `/poteto-mode` 会阅读并在回复里引用的单条规则技能。用户很少直接调用某一个。他们改为用名字来驾驭，例如「应用 prove it works。给我看真实输出。」输入 `/principle-<name>` 仍然可以按需加载一个。[指南第 8 页](../../docs/guide/08-principles.md) 列出它们。

## 修好一次出了问题的运行

| 症状 | 修复 |
|---|---|
| 模式在几个回合之后不再起作用 | 它是用 Enter 启动的。把它作为自定义模式启动，或每项任务都用 `/poteto-mode` 开始。 |
| 一个问题被当成了上一项任务的下一步 | 说「新任务」，或者说这个回合不需要该模式。 |
| 一个新的模型选择没有效果 | `/setup-pstack` 的规则应用于新对话。新开一段。 |
| 运行费用比预期高 | 见「完成设置」下面的费用那段。 |
| 一项技能没有自己加载 | 只有 `/setup-pstack` 会从用户的话里加载。其他的在用户输入它们时加载，或在 `/poteto-mode` 运行它们时加载，而它并不会运行每一项技能。 |
| 并行代理互相覆盖 | 给每个代理它自己的工作树，或者把它们作为云代理来跑，各自有自己的机器。 |
| 一次过夜运行有动静但什么都没完成 | `/loop` 需要一个能通过或失败的检查，而不是一段时长。见 [指南第 7 页](../../docs/guide/07-overnight.md)。 |
| 回复凭一次绿色构建声称成功 | 要求真实的命令、流程、存下的值或剖析。那就是 prove-it-works 原则。 |

对于一次漂走的运行，[`references/prompting.md`](references/prompting.md) 里有一行就能驾驭的说法。[指南第 10 页](../../docs/guide/10-recipes-and-pitfalls.md) 里有更多坑，以及值得照抄的配方。

## 把 pstack 变成我自己的

- [`/automate-me`](../automate-me/SKILL.md) 从用户自己的历史起草一项个人模式技能，与 `/poteto-mode` 一起使用。
- [`/reflect`](../reflect/SKILL.md) 在一次会话之后，把它的教训变成用户批准的技能编辑。
- `/poteto-mode write a skill for <workflow>` 运行编写行动手册。eval 行动手册对一项技能变更做盲测。
- 在它自己的 PR 里修一个行为不对的技能，而不是在它出错的那项功能工作里面修。

[指南第 9 页](../../docs/guide/09-make-it-yours.md) 涵盖以上每一项。

## 回复

先给答案。最多在一个代码块里给一条示例提示词，有合适的就从 [`references/recipes.md`](references/recipes.md) 改编，然后给出那个文件的链接。保持简短，除非用户要的是整张地图。

---
name: technical-writing
description: "分层技术写作标准：Diátaxis 结构、Google 开发者风格句子、STE 指令规则、Global English 语法。用于 /technical-writing，或在编写、评审文档、RFC、readme、PR 描述、提交信息时使用。"
disable-model-invocation: true
---

# 技术写作

写到疲惫的工程师第一遍就能看懂。四层全部用上。

三层规则高于这四层：

- **删掉每个不干活的词。** 一句话去掉某个词还成立，这个词就删。"In order to" 就是 "to"。"It is important to note that" 什么都不是。
- **用短的日常词。** 用 "use"，不用 "utilize"。用 "help"，不用 "facilitate"。用 "do"，不用 "perform"。长词必须用精确性来换它的长度。
- **规则把句子改坏了，就换个方式改，或者别动它。** 一句话遵守了所有规则，读起来却像机器写的，那就是失败。

代码库就是词表。写真实的符号、文件、flag 或命令名，不要写同义词，也不要描述它。

不要造术语。用开发者会直接说出口的词："move"、"delete"、"a budget that only decreases"，不要用 "evacuate"、"ratchet"、"endgame"。文档第一次出现某个命名模式时讲清它的含义，用命名模式没问题。在回复里提出一个新的违规词和它的替换词，作为对 `unslop` 抽象隐喻规则的补充，附上 diff。不要改那个技能。

## 变化节奏

一篇文档可以遵守每一层，读起来还是像机器写的：每句都截得很短，哪里都没有观点，没有任何具体的东西。

- 有意识地混合句子长度。短句落一个点。长句带一个事实，连同它的条件或后果。
- 一句一个想法，不等于一句一个长度。把装了两个想法的句子拆开。带一个想法的长句留着。
- 模式允许的地方要有观点。解释要权衡取舍，那就说出你怎么看，而不是罗列利弊。参考保持干。
- 具体胜过干瘪。不要写 "schema changes can cause issues"，要写 "a column rename fails the build"。

## 先选模式（Diátaxis）

一篇文档，一个模式。两个问题就能定：内容是指导行动（做）还是帮助理解（想），是服务于学习还是工作？

- 行动 + 学习：**教程**。
- 行动 + 工作：**操作指南**。
- 理解 + 工作：**参考**。
- 理解 + 学习：**解释**。

这个罗盘可以用在整篇文档上，也可以用在单独一句话上。

**教程：边做边学。** 学习者能不能成功是你的责任，不是他的。开头说学习者要做出什么，不要说他要"学到"什么。每一步都产出看得见的结果，早出现、经常出现。告诉他们应该看到什么：预期输出、提示符的变化、日志行。解释压到一个从句加一个链接。保持具体。用"我们"来写，用命令式："First, do x. Now, do y."

**操作指南：通向目标的步骤。** 解决一个人遇到的问题，不是机器能执行的一个操作。假定读者有能力，跳过教学。只讲行动：不跑题，不铺垫背景，不为完整而完整。这些用链接给。允许分叉和判断："If you want x, do y." 按任务给指南起名："How to calibrate the radar array"，不要叫 "Radar array calibration"。

**参考：供查阅的事实。** 只描述。不指导，不说服，不发表意见。干、完整、确定。陈述事实、选项、限制和错误，不加任何含糊。结构照抄被描述的东西，让代码和文档能对照着看。材料放在读者预期的地方。能由代码生成的就生成。

**解释：理解与原因。** 一个范围明确的话题，脱离产品也能读。每个标题前面都能加一个隐含的"关于……"。锚定一个真实的"为什么"问题。给出上下文：设计决策、历史、约束、备选方案。只有这里允许有观点，别处都不行。

不要混模式：教程里不放参考表格，参考里不手把手教，操作指南里不辩论。拆开，用链接连。

## 对着读者写句子（Google 开发者风格）

- 用"你"称呼读者，用现在时。"Will" 只用于确实以后才发生的事。
- 说清谁做什么："the compiler checks"，不要写 "is checked"。只有施动者未知或不重要时才用被动。
- 指令写成命令："Click Submit." 事实平铺直叙。永远不要写 "should be done"。
- 条件放在指令前面："To delete the document, click Delete."
- 常见情况放前面。例外放后面。
- 像一个懂行的朋友在说话。不用流行词，不用比喻，指令里不加 "please"，步骤里永远不写 "simply"、"easy"、"quickly"。真那么简单，读者就不会在这儿了。
- 不要预告（"we will soon support..."），不要连续几句用同一个短语开头。
- 链接文字要说清链接去哪：页面标题或一句简短描述。永远不要写 "click here"。优先在本页给一句上下文，而不是链出去。
- 标题要带观点，不只是话题（"Pick the mode first"，不是 "Modes"）。用句首大写。任务标题是光秃秃的动词短语（"Create an instance"）。概念标题是名词短语。每页一个 h1，不跳级。
- 顺序用编号列表，其他用项目符号。列表前用一句完整的话引出。各项保持平行。
- 代码用代码字体。UI 元素用粗体。用序列逗号。不要写 "etc."，在开头说明列表不完整。

## 让陈述一次只装一件事（STE 规则）

- 一句一条指令。其他句子也是一句一个想法。
- 超过约 20 词的指令拆开，其他句子超过约 25 词也拆开。
- 警告或条件放在它守护的步骤前面："If hot oil touches your skin, injuries can occur."
- "the" 和 "a" 要留着："Remove backup file" 有两种读法。"Remove the backup file" 只有一种。
- 每个词一个含义、一个职责，然后一直保持。如果 "check" 是检查的意思，就别再拿它表示约束。
- 每个动作固定一个词："start" 就一路 "start"，不要这里 "start" 那里 "initiate"。
- 步骤写成直接命令，永远不要写成叙述，也永远不要用被动："Install the component"，不要写 "the component must be installed"。
- 能不用 "-ing" 形式的词就不用。

## 不留有歧义的句子（Global English）

- "only"、"not" 这类词紧挨着它修饰的词："only fails on growth" 和 "fails only on growth" 意思不同。
- 拆开长名词串："the proto import budget check script" 改成 "the script that checks the proto-import budget"。
- 每个 "it"、"they"、"this" 都指向一个明确的东西。拿不准就重复名词。永远不要用 "this" 或 "which" 指代整个从句。
- 不要丢动词："Phase 1 moves the converters and Phase 2 the runtime" 让 Phase 2 没了动词。给它补上。
- 表示结构的小词要留着，比如 "Ensure that the switch is off" 里的 "that"。永远不要拿清晰度换字数。
- 并列时重复冠词能防止误读，就重复："the client and the host"，当它们是两个东西时，不要写 "the client and host"。
- 一句话能有两种分组方式时，说清 "and" 或 "or" 连接的是哪些部分。"Both...and"、"either...or"、"if...then" 都是免费的消歧工具。
- 用句号，不用分号。破折号换成新句子。
- 括号里的文字要么是完整的语法单位，要么自成一句。永远不要用 "(s)" 构成复数。
- 不用斜杠：写 "a, b, or both"，不要写 "a/b" 或 "and/or"。
- 每个东西从头到尾只用一个名字。一篇文档把同一个东西叫"the gate"、"the ratchet"、"the budget check"，等于教了三样东西。没变的东西不要换叫法。
- 不用习语、口语、拉丁缩写和隐喻。

## 语气与仓库约定

- 这个技能碰到的每篇文档都要套用 **unslop** 技能。AI 腔的模式目录归那个技能管：AI 词汇、废话、含糊、格式上的破绽。
- PR 描述和提交信息也是写作。除 Diátaxis 之外的每一层都适用于它们。PR 正文是一份简报，评审者一分钟内能读完。不要贴 swarm 日志、SHA 列表或指标表格。用链接给。
- 产品 UI 文案不是文档。那些用你产品的文案规范。
- 代码片段用 tab 缩进。写真实路径。每个计数或目录树的说法，在落地它的那个提交上必须为真，并附上能重新生成它的命令。

## 示例

改前：

> Configuration of the proto import ratchet budget script parameters is performed via budget.json. Note that it's important to remember that running with --write, which updates the committed budget to reflect the current count, should only be done when lowering it. If exceeded, CI fails.

改后：

> `budget.mjs` reads the committed budget from `budget.json` and counts the files that import protos. If the count exceeds the budget, CI fails. Run `budget.mjs --write` only to lower the budget.

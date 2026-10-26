---
name: technical-writing
description: "分层的技术写作标准：Diátaxis 结构、Google 开发者风格的句子、STE 指令规则、Global English 句法。在使用 /technical-writing，或编写、审查文档、RFC、readme、PR 描述或提交说明时使用。"
disable-model-invocation: true
---

# 技术写作

写到一个疲倦的工程师第一遍就能懂。四层全部应用。

有三条规则位于各层之上：

- **删掉每一个不干活的词。** 句子去掉某个词仍然成立，这个词就该走。「In order to」就是「to」。「It is important to note that」等于零。
- **用短的、日常的词。** 用「use」，不用「utilize」。用「help」，不用「facilitate」。用「do」，不用「perform」。一个长词必须用精确性来买下它的长度。
- **一条规则把句子写得更差时，换一种办法修这个句子，或者别动它。** 一个遵循了每一条规则、读起来却像机器写的句子，已经失败了。

代码库就是词表。写真实的符号、文件、标志或命令名，不要写同义词，也不要写对它的描述。

不要发明行话。用开发者会说出口的词：「move」「delete」「a budget that only decreases」，而不是「evacuate」「ratchet」或「endgame」。一个有名字的模式可以，只要文档在第一次出现时说明它是什么意思。在你的回复里，把一个新的冒犯词和它的替换提议为对 `unslop` 抽象比喻规则的一处增补，并附上 diff。不要编辑那个技能。

## 变化节奏

一份文档可以服从每一层，读起来仍然像机器写的：每句都剪得很短，哪里都没有看法，没有一样东西是具体的。

- 有意地混合句子长度。短句把一个点钉住。长句带着一个事实和它的条件或后果。
- 一句一个想法，并不意味着一句一个长度。把带着两个想法的句子拆开。留下带着一个想法的长句。
- 在模式允许的地方要有看法。解释在权衡取舍，所以说出你怎么看它们，而不是罗列利弊。参考保持干。
- 具体，而不要无菌。不是「schema changes can cause issues」，而是「a column rename fails the build」。

## 先选定模式（Diátaxis）

一份文档，一种模式。两个问题来选定它：内容是在告知行动（做）还是理解（想），以及它服务的是学习还是工作？

- 行动 + 学习：**tutorial**。
- 行动 + 工作：**how-to**。
- 理解 + 工作：**reference**。
- 理解 + 学习：**explanation**。

把这个罗盘用在整份文档上，或用在一个句子上。

**tutorial：在做中学。** 学习者的成功是你的工作，不是他们的。开头说学习者将要构建什么，而不是他们将要「learn」什么。每一步都产出一个看得见的结果，要早，要频繁。告诉他们应该看到什么：预期输出、提示的变化、那一行日志。解释剪到一个从句加一个链接。保持具体。用「we」来写，写成命令：「First, do x. Now, do y.」

**how-to：通向一个目标的步骤。** 解决一个人遇到的问题，而不是机器能够执行的一个操作。假定对方有能力，跳过教学。只有行动：不要离题，不要背景，不要为了完整而完整。那些改成链接。允许分叉和判断：「If you want x, do y.」用任务来给指南命名：「How to calibrate the radar array」，而不是「Radar array calibration」。

**reference：供查阅的事实。** 只描述。不要指令，不要劝说，不要意见。干、完整、确定。陈述事实、选项、限制和错误，不要闪烁其词。镜像被描述之物的结构，这样代码和文档可以一起导航。把材料放在读者预期的地方。能从代码生成的就生成。

**explanation：理解，以及为什么。** 一个有边界的题目，离开产品也能读。每个标题都应该受得住前面隐含的「About...」。锚定在一个真实的为什么问题上。给出上下文：设计决定、历史、约束、备选。意见在这里允许，在别处不允许。

不要混合模式：tutorial 里不要 reference 表，reference 里不要 tutorial 式的手把手，how-to 里不要争论。拆开并链接。

## 把句子写给读者（Google developer style）

- 用「you」对读者说话，用现在时。只有事情确实发生在以后时才用「Will」。
- 说出谁做什么：「the compiler checks」，而不是「is checked」。只有行动者未知或无关紧要时，被动才可以。
- 把指令写成命令：「Click Submit.」平实地陈述事实。绝不要「should be done」。
- 把条件放在指令之前：「To delete the document, click Delete.」
- 常见情况放前面。例外放后面。
- 听起来像一个懂行的朋友。不要流行词，不要比喻性语言，指令里不要「please」，过程里绝不要「simply」「easy」或「quickly」。如果它很简单，读者就不会在这里。
- 不要预先宣布（「we will soon support...」），也不要让连续的句子以同一个短语开头。
- 用说出链接去向的词来做链接：页面标题或一句短描述。绝不要「click here」。偏好页面上的一句上下文，而不是链出去。
- 标题承载的是要点，不只是话题（「Pick the mode first」，而不是「Modes」）。句首大写。任务标题是一个光秃的动词短语（「Create an instance」）。概念标题是一个名词短语。每页一个 h1，不要跳级。
- 序列用编号列表，其他一切用项目符号。用一个完整的句子引出列表。项目保持平行。
- 代码用代码字体。UI 元素用粗体。使用序列逗号。丢掉「etc.」，并在前面说明列表是部分的。

## 让陈述一次只承载一条（STE 规则）

- 一句一条指令。其他地方也是一句一个想法。
- 拆开长于大约 20 个词的指令，以及其他长于大约 25 个词的句子。
- 把警告或条件放在它所守卫的步骤之前：「If hot oil touches your skin, injuries can occur.」
- 保留「the」和「a」：「Remove backup file」有两种读法。「Remove the backup file」只有一种。
- 给每个词一个意思和一份工作，然后守住它。如果「check」的意思是检查，就不要再用它来表示约束。
- 每个动作选一个词并坚持：「start」，不要这里用「start」、那里用「initiate」。
- 把过程写成直接命令，绝不要写成叙述，也绝不要用被动：「Install the component」，而不是「the component must be installed」。
- 能不用「-ing」词就不用。

## 不留下可以有两种读法的句子（Global English）

- 让「only」和「not」这类词紧挨着它们所改变的那个词：「only fails on growth」和「fails only on growth」说的是不同的事。
- 拆开长的名词串：「the proto import budget check script」变成「the script that checks the proto-import budget」。
- 让每一个「it」「they」和「this」指向一件明显的东西。拿不准时重复那个名词。绝不要用「this」或「which」去指整个从句。
- 不要丢掉动词：「Phase 1 moves the converters and Phase 2 the runtime」让 Phase 2 没有动词。给它一个。
- 保留那些显示结构的小词，例如「Ensure that the switch is off」里的「that」。绝不要用清晰去换词数。
- 当冠词能防止误读时，在并列里重复它：它们是两件东西时，写「the client and the host」，而不是「the client and host」。
- 当一个句子可以有两种分组时，说清「and」或「or」连接的是哪些部分。「Both...and」「either...or」和「if...then」是免费的消歧器。
- 用句号，不用分号。把长破折号换成一个新句子。
- 让括号里的文字成为一个完整的语法单位，或它自己的句子。绝不要用「(s)」构成复数。
- 不要斜杠：写「a, b, or both」，而不是「a/b」或「and/or」。
- 每件东西到处都用一个名字来称呼。一份文档对同一件东西说「the gate」「the ratchet」和「the budget check」，就是在教三件东西。没有变的东西不要换着叫。
- 跳过习语、口语、拉丁缩写和比喻。

## 声音与仓库细节

- 对这个技能碰到的每一份文档应用 **unslop** 技能。那个技能拥有 AI 腔模式目录：AI 词汇、填充、闪烁、格式上的破绽。
- PR 描述和提交说明也是写作。除 Diátaxis 以外的每一层都适用于它们。PR 正文是一份审查者能在一分钟内读完的简报。不要粘贴 swarm 日志、SHA 列表或指标表。链接它们。
- 产品 UI 字符串不是文档。那些用你的产品的文案指南。
- 代码片段用制表符缩进。写真实路径。让每一个计数或树的说法在把它落地的那个提交上为真，并附上重新生成它的命令。

## 改写示例

改写前：

> Configuration of the proto import ratchet budget script parameters is performed via budget.json. Note that it's important to remember that running with --write, which updates the committed budget to reflect the current count, should only be done when lowering it. If exceeded, CI fails.

改写后：

> `budget.mjs` reads the committed budget from `budget.json` and counts the files that import protos. If the count exceeds the budget, CI fails. Run `budget.mjs --write` only to lower the budget.

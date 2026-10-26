# 把它变成你的

poteto-mode 是一个人的风格。它底下的行动手册、路由和模型角色，配上你的风格一样好用。这一页涵盖：生成一个个人 mode，从一次会话捕捉教训，修好仓库让 agent 不再重复错误，编写一个聚焦的 skill，以及在你信任一次 skill 改动之前测试它。

从比你以为的更小开始。第一天你不需要很多 skill，甚至不需要这整个插件。把提示词写明白，看 agent 在哪里失败，当同一种失败出现两次时，再加上一个 skill 或一项检查。

## 用 `/automate-me` 生成你自己的 mode

```text
/automate-me
```

你不用描述你的风格，因为 [`/automate-me`](../../skills/automate-me/SKILL.md) 从你的历史里把它读出来。它在当前工作区挖掘你最近的对话记录，寻找反复出现的偏好，在你喜欢回复、委派、验证、代码、文字和流程的方式上，然后问你哪些模式真的是你。它通过 Cursor 内置的 `create-skill` 流程起草 `.cursor/skills/<your-name>-mode/SKILL.md`，让草稿经过 [`/unslop`](../../skills/unslop/SKILL.md)，并从工作树开一个 PR，让你像评审任何其他改动一样评审它。

习惯漂移时再跑一次：

```text
/automate-me update my mode skill with everything since its last edit
```

更新模式只挖掘这个 skill 上次变化以来的历史。它保留你没有否定过的规则，修订有了新证据的那些，并且只为新模式增加章节。

## 用 `/reflect` 捕捉一次会话的教训

就在一个教了你什么的任务之后，运行：

```text
/reflect that took way too long. capture what we learned so the next run doesn't repeat it.
```

[`/reflect`](../../skills/reflect/SKILL.md) 把对话记录发给三个并行评审者，然后一个综合者把提议分进 `Accepted`、`Rejected` 和 `Backlog`，并在任何 skill 改动之前等待你的批准。只有当一条提议会改变未来的某个决定时才批准它。一次古怪的会话是轶事，不是规则。

## 用 `/correct` 修好环境

当你一次又一次为同一个错误纠正 agent 时，修复属于仓库，不属于你的下一条提示词。按它们能守住的程度给选项排序：

1. 用架构或更好的数据结构，让这个错误不可能发生。
2. 用类型挡住它，或用一条错误信息点明修复的 lint 或 CI 检查挡住它。
3. 用测试抓住它。
4. 把它写成文档或 agent 规则。agent 跳过一条规则时什么都不会失败，所以这个放最后。

人工评审不在这份清单上。一个必须在每个 PR 上抓住同一个错误的评审者，正是这个要修的问题。[`/correct`](../../skills/correct/SKILL.md) 做这件事：

```text
/correct agents keep calling the database client directly instead of going through the repository layer
```

它读最近的提交、revert、评审评论，以及解释变通办法的注释，然后把错误分成类别。一个类别要发生过两次才计数。它一次一个提交地修复最频繁的类别，在管用的最高一层，并证明每一项新检查会在一个真实的过往错误上失败。它还在 agent 指示文件里保留一张表，把每条规则和强制它的东西配成对，这样一条没有东西强制的规则会显示为重复。回复列出每个类别及其证据、所选的层，以及为什么更高的一层行不通。

不带参数运行它，它就自己从历史里找出类别。`/reflect` 和 `/correct` 把工作分开。`/reflect` 从一次会话改进 skill。`/correct` 改变仓库，让一个错误类别不能再回来。当修复是一条新边界时，把它和 `/architect` 配在一起。[并行跑很多项目](./07-overnight.md#run-many-projects-in-parallel) 里有一条提示词，在整个仓库上把两者都做了。

## 编写一个聚焦的 skill

当你已经知道想捕捉的工作流：

```text
/poteto-mode write a skill for verifying database migrations in this repo
```

编写一个 skill 匹配[编写或修改 skill 行动手册](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，它经由 Cursor 内置的 `create-skill` 路由，校验 frontmatter 和链接，并通过开 PR 行动手册交付结果。面向 agent 的文字比面向人的文字标准更高，因为一句没有帮助的话会变成某个未来 agent 遵循的指示。让行动手册守住这个标准，而不是凭空手写一份 `SKILL.md`。

两种特殊情况有自己的生成器。一个必须驱动你的应用并证明行为的 skill 是验证 skill，所以改用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 和 [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md)。一个用模型检验器、一份证明或其他验证器检查你代码的一条性质的 skill 是形式化验证 skill，所以改用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 和 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)。[验证并交付](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill) 涵盖这两种。

## 用 `/technical-writing` 按标准写文档

skill 不是你交付的唯一文字。对于文档、RFC、readme、PR 描述和提交说明：

```text
/technical-writing review the readme changes
```

[`/technical-writing`](../../skills/technical-writing/SKILL.md) 应用一套分层标准。它的目标是疲惫的工程师第一遍就能看懂的文字。它先选定文档的模式（教程、操作指南、参考或解释），然后一句一句地工作：谁做什么，一句一个意思，没有一句话能读出两种意思。用它评审你或 agent 刚写的东西，或者在你要一份文档时事先点名它。

## 盲测一次 skill 改动

一次 skill 编辑会影响之后的每一次会话，所以像对待实验那样测试它。采纳别人的 skill 也一样。在你留下它之前，确认它让 agent 在你的工作上变得更好。

```text
/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.
```

当一个 skill 一直没抓住，而你知道它应该做什么时，在一个任务里改它并测试它：

```text
/poteto-mode update the review skill so it flags missing migrations, and eval the change.
```

事先要求评测，能让编辑保持诚实。从一次糟糕会话写出来的修复，往往会过拟合那次会话，而经过许多次编辑，skill 会漂移。评测在它交付之前抓住漂移。

[评测行动手册](../../skills/poteto-mode/playbooks/eval.md)围绕一种失败模式建立，也就是观察者效应。知道自己正在被评测的 agent 行为会不一样。所以候选 agent 拿到的是一份看起来很自然的任务，放在清理过的目录里，绝不会见到 “eval” 或 “candidate” 这两个词，也绝不会知道彼此的存在。一个裁判在中性标签下给所有输出打分，而沿链跟随是根据每个候选实际读了哪些文件来评分，不是根据它自己的声称。

在接受裁决之前，你自己读每一份输出。如果你不同意裁判，先怀疑评分标准，再怀疑你的判断。

## 用 `/make-bot-ui` 做一个 bot 界面

有一个看情况使用的 skill 是给 Grok Bot 用户的。[`/make-bot-ui`](../../skills/make-bot-ui/SKILL.md) 构建一个小页面，上面的按钮通过一个 webhook routine 唤醒一个 bot。例如，你可以滑过一个评审队列，每一次滑动都让 bot 对那一项采取行动。你机器上的一个服务器持有这个 webhook 的发送方密钥，所以密钥从不到达浏览器或对话。这个 skill 也涵盖在 Tailscale 上暴露这个页面。

**陷阱：** 不要因为一个 skill 表现不对就在任务中途编辑它。在它自己的 PR 里修它，并让任务继续往前。一次缠进功能工作里交付的 skill 编辑，对评审是看不见的，也无法评测。

下一篇：[配方与陷阱](./10-recipes-and-pitfalls.md)。

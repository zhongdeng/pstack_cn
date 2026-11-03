# 让它变成你自己的

poteto-mode 是一个人的风格。它底下的作战手册、路由和模型角色，换成你的风格一样能用。这一页讲怎么生成一个属于你自己的模式、从一次会话里提炼经验、修好仓库让智能体不再重复犯错、写一个聚焦的技能，以及在信任一个技能改动之前先测它。

起步比你想象的更小。第一天你不需要很多技能，甚至不需要这整个插件。就正常地写提示词，观察智能体在哪里失败，同一个失败出现两次时再加一个技能或一道检查。

## 用 `/automate-me` 生成你自己的模式

```text
/automate-me
```

你不用描述自己的风格，因为 [`/automate-me`](../../skills/automate-me/SKILL.md) 会从你的历史记录里把它读出来。它挖掘当前工作区里你最近的对话记录，找出反复出现的偏好，包括你希望怎么回复、怎么委派、怎么验证，以及代码、文字和流程上的习惯，然后问你哪些模式才是真正的你。它通过 Cursor 内置的 `create-skill` 流程起草 `.cursor/skills/<your-name>-mode/SKILL.md`，把草稿过一遍 [`/unslop`](../../skills/unslop/SKILL.md)，再从 worktree 开一个 PR，让你像审其他改动一样审它。

习惯变了就再跑一次：

```text
/automate-me update my mode skill with everything since its last edit
```

更新模式只挖掘技能上次改动之后的历史。它保留你还没推翻的规则，用新证据修订有变化的规则，只给新模式加新章节。

## 用 `/reflect` 提炼一次会话的经验

刚做完一个让你学到东西的任务，马上跑：

```text
/reflect that took way too long. capture what we learned so the next run doesn't repeat it.
```

[`/reflect`](../../skills/reflect/SKILL.md) 把对话记录发给三个并行的评审者，再由一个综合者把提案分成 `Accepted`、`Rejected` 和 `Backlog`，在改动任何技能之前等你批准。只有当一个提案会改变未来的某个决策时才批准它。一次奇怪的会话是轶事，不是规则。

## 用 `/correct` 修好环境

当你一遍又一遍地为同一个错误纠正智能体，修复该落在仓库里，而不是你的下一条提示词里。按约束力从强到弱给选项排序：

1. 用架构或更好的数据结构让这个错误不可能发生。
2. 用类型挡住它，或者用 lint 或 CI 检查挡住它，让报错信息直接说出怎么修。
3. 用测试抓住它。
4. 把它写成文档或智能体规则。智能体跳过一条规则时什么都不会失败，所以这个排最后。

人工评审不在这个列表上。一个必须在每个 PR 上都抓住同一个错误的评审者，正是这里要解决的问题。[`/correct`](../../skills/correct/SKILL.md) 干这件事：

```text
/correct agents keep calling the database client directly instead of going through the repository layer
```

它读最近的提交、回滚、评审评论，以及解释变通做法的注释，然后把错误归类。一个类出现过两次才算数。它按每个类一个提交的方式修最常见的那些类，在能生效的最高层级上修，并证明每个新检查在真实的历史错误上会失败。它还会在智能体指令文件里维护一张表，把每条规则和强制执行它的东西配成一对，这样没有任何东西强制执行的规则就会以重复的形式暴露出来。回复里列出每个类、它的证据、选定的层级，以及为什么更高层级行不通。

不带参数运行，它会自己从历史里找出这些类。`/reflect` 和 `/correct` 分工明确。`/reflect` 从一次会话改进技能。`/correct` 改仓库，让一个错误类回不来。当修复是一条新边界时，把它和 `/architect` 搭配使用。[并行跑多个项目](./07-overnight.md#run-many-projects-in-parallel) 里有一个提示词，能在整个仓库范围内同时做这两件事。

## 写一个聚焦的技能

当你已经知道想沉淀的工作流：

```text
/poteto-mode write a skill for verifying database migrations in this repo
```

写技能会匹配 [编写或修改技能作战手册](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，它走 Cursor 内置的 `create-skill`，校验 frontmatter 和链接，再通过开 PR 作战手册把结果发出去。面向智能体的文字比面向人的文字门槛更高，因为一句没用的句子会变成未来某个智能体照做的指令。让作战手册来守这个门槛，别手写 `SKILL.md`。

有两种特殊情况有自己的生成器。一个技能如果要驱动你的应用并证明行为，那它是验证技能，改用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 和 [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md)。一个技能如果用模型检查器、证明或其他验证器检查你代码的某个性质，那它是形式化验证技能，改用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 和 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)。[验证并交付](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill) 两种都讲了。

## 用 `/technical-writing` 按标准写文档

技能不是你唯一要交付的文字。文档、RFC、readme、PR 描述和提交信息，用：

```text
/technical-writing review the readme changes
```

[`/technical-writing`](../../skills/technical-writing/SKILL.md) 套用的是一套分层标准。它的目标是让一个累了的工程师第一遍就能读懂的的文字。它先定文档的模式（教程、操作指南、参考还是解释），然后逐句打磨：谁做什么，一句一个想法，没有能读出两种意思的句子。用它来审你或智能体刚写的东西，或者在你要文档的时候一开始就点名用它。

## 盲测一个技能改动

一次技能改动会影响之后每一次会话，所以像对待实验一样测它。采用别人的技能也一样。在留下它之前，先确认它让你的工作上的智能体变得更好。

```text
/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.
```

当一个技能总是漏掉东西、而你知道它该做什么时，在一个任务里同时改和测：

```text
/poteto-mode update the review skill so it flags missing migrations, and eval the change.
```

一开始就要 eval，能让改动保持诚实。从一次糟糕会话写出来的修复容易过拟合那次会话，改得多了技能就会漂移。eval 在它发布之前抓住这种漂移。

[Eval 作战手册](../../skills/poteto-mode/playbooks/eval.md) 围绕一个失败模式设计，就是观察者效应。一个知道自己正在被评估的智能体会表现不一样。所以候选智能体拿到的是一个看起来自然的任务，放在清理过的目录里，绝不出现 "eval" 或 "candidate" 这些词，也绝不知道彼此的存在。一个裁判在匿名标签下给所有输出打分，链式跟随则根据每个候选实际读了哪些文件来评，而不是根据它自己声称的。

在接受判定之前，每个输出都自己读一遍。如果你不同意裁判，先怀疑评分标准，再怀疑自己的判断。

## 用 `/make-bot-ui` 做一个机器人 UI

有一个场景化的技能是给 Grok Bot 用户用的。[`/make-bot-ui`](../../skills/make-bot-ui/SKILL.md) 做一个小页面，页面上的按钮通过 webhook 例程唤醒一个机器人。比如，你可以滑动浏览一个评审队列，每滑一次就让机器人对那一条动手。你机器上的一个服务器持有 webhook 的发送方密钥，所以密钥永远不会到浏览器或聊天里。这个技能也讲了怎么在 Tailscale 上暴露这个页面。

**坑：** 别因为一个技能表现不对就在任务中途改它。在它自己的 PR 里修，让任务继续跑。一个缠在功能工作里一起发布的技能改动，评审看不见，也没法评估。

下一步：[配方与坑](./10-recipes-and-pitfalls.md)。

# 配方与坑

值得照抄的提示词，然后是每个人都会犯一次的错误。换成你自己的路径和完成条件。这些配方故意写得很随意。实际敲进去的时候就是这样，技能也能读懂意图。

![她一边品尝做好的菜，一边看着机器人照着食谱盒做饭，柜台上方钉着写有 /how、/tdd 和 /loop 的卡片。](./images/recipes.jpg)

## 理解一个陌生的子系统

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

先看机制，再看历史。每个技能的报告都会告诉你它搜了哪些来源，这样你就知道答案建立在什么之上。

## 动代码之前先复述一份嘈杂的报告

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

理解错了会在复述里露出来，那时候纠正只要一条消息。在智能体说出它自己的判断之前，先别讲你自己的猜测。`/in-your-own-words` 只要复述，不带作战手册。

## 发送之前先把提示词磨利

```text
/sharpen write the onboarding doc for the new billing service.
```

智能体会点出专家会做而你没要求的事、他们会从什么原始材料入手、他们的方法和工具，以及一个能确认结果对不对的外部检查。它把你原来的提示词改写成会要求这些的版本，但不做这个任务。改写读着对了再发出去。

## 先做原型再选

```text
/poteto-mode prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

你从能跑的东西里挑，而不是从描述里挑。智能体一路上会自己回答关于布局和时序的问题。

## 把定下来的设计变成计划

```text
/poteto-mode turn this design into a plan. small verifiable PRs, each with its own proof.
```

设计定下来之后再问。计划就是交付物，它会点出由哪本作战手册来执行。

## 对设计征求第二意见

```text
ask /arena for a second opinion on this thread and our approach
```

你现在的设计变成几个候选之一，综合结论会告诉你评审团是找到了更好的方案，还是确认了你原有的方案。跟一个改起来代价高昂的设计相比，这点成本很小。

## 并行检查互不依赖的切片

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

每个 worker 负责一个包。父级等所有切片都完成，返回一份 `PASS`、`ISSUES` 或 `BLOCKED` 报告，而不是把 worker 的原始输出一股脑倒出来。

## 带着怀疑审查一个分支

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

这些限定词是干实事的。"don't change anything yet" 让它保持只读，挑刺规则预先过滤掉噪音，让经过验证的发现值得你花时间。

## 通过一个失败的测试修 bug

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"if there's a cheap test path" 很重要。硬用脆弱的 mock 塞一个测试进去，证明的东西比跑真实命令还少，作战手册可以这么说。

## 复现并修复一份报告，附上证据

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

"if it repros on main" 让这次运行在 bug 已经消失时提前停下。视频让你在读 diff 之前就能检查修复。

## 证明一个测试很少触及的性质

```text
/create-formal-verification-skill the retry queue. a message must never be delivered twice.
```

你会得到一个在给定范围内所有情况下都检查过的性质，如果代码已经违反了它，会得到一个用你代码的语言表述的反例，还会得到一个项目技能，下一个智能体在这段代码有任何改动时都会运行它。

## 发布数字之前先审一遍

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

你会得到更快、更慢、没有可测量的差异，或无法定论，附带运行次数、范围，以及是什么限制了这个数字。

## 别再纠正同一个错误

```text
/correct agents keep adding new config flags without registering them in the schema
```

修复以架构、类型、lint 或测试的形式落进仓库，下一个智能体就犯不了这个错。

## 只问怎么做，不动手开工

```text
/poteto-help how do i get poteto-mode to stay on every turn?
```

你会得到一个答案、一条可以发送的提示词，以及一个指向源头的链接。在你发出那条提示词之前，什么都不会运行。

## 你不在的时候让一次运行保持诚实

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

完整的约定在[过夜那一页](./07-overnight.md)。只要任务和完成条件已经在对话里，简短版就够用。

## 把跑偏的运行拉回来

纠偏提示词就一行：

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

你很少需要更多字。你需要的是对的词，[原则那一页](./08-principles.md)就是词汇表。

## 用大白话拿到回复

```text
/bro
```

这就是全部提示词。[`/bro`](../../skills/bro/SKILL.md) 把最后一条消息像一个人对另一个人说话那样复述一遍，不用行话，更短。当一条回复技术上很详尽而你仍然不知道它说了什么时，就用它。

## 补上一个你放着没管的聊天

```text
/ketchup
```

[`/ketchup`](../../skills/ketchup/SKILL.md) 用大白话告诉你自你最后一条消息以来发生了什么，然后列出每一个等你决定的调用，附上它的选择、证据和风险。它在汇报时不改动任何东西。

想看着补课过程，就跑 [`/ketchup-video`](../../skills/ketchup-video/SKILL.md)。它用一段带字幕的幻灯片短视频展示发生了什么，并在下面以文字列出等你决定的调用。

## 那些坑

- **在提示词里罗列技能。** "use /how then /architect then /arena" 会打乱作战手册已经排好的步骤。说清目标和约束。只有在要覆盖默认行为时才点名技能。
- **模糊的完成条件。** "make it better" 让 `/loop` 没东西可检查。给一个能通过或失败的命令或产物。
- **一上来就讲你对原因的判断。** 智能体会往你指的方向搜。先让它复述问题，再分享你的直觉。
- **接受第一个设计。** 一次尝试就锁死了模型想到的第一个形状。要原型或 `/architect`，从证据里挑。
- **打磨一个抽象的计划。** 对没有代码支撑的计划做对抗性审查，会凭空造出永远不会发生的风险。先用原型把悬而未决的问题定下来，再审查已经建出来的东西。
- **在一个 worktree 里跑并行智能体。** 它们会互相覆盖，没人分得清哪个智能体改了什么。把它们当云智能体跑，或者说 "own worktree per attempt"。
- **在信任循环之前就开始循环。** 一个无法验证自己工作的循环只会让没检查的工作更快。先把验证技能弄好。
- **相信一个没审过的数字。** 一个热缓存或一条被跳过的代码路径都能伪造出加速。在数字被用到任何地方之前先跑 `/benchmark-checklist`。
- **手工纠正同一个错误。** 聊天里的纠正只帮一次运行。`/correct` 修好仓库，让之后的运行不再重犯。
- **用 `/arena` 做覆盖。** `/arena` 重复一个设计或代码简报，然后挑一个基底，把最好的部分嫁接上去。`/swarm` 切分切片或声明的竞速分支，汇总成一份报告。
- **接受每一条审查评论。** 机器人和人都会把真发现和噪音列在同一张单子里。`/interrogate` 只保留重跑能证明的发现，并列出它丢掉了什么以及为什么，你可以往任一方向推翻。
- **把 `auto` 当成模型 slug。** `auto` 和 `inherit-parent` 的意思是"省略 model 字段，让子智能体继承父聊天的模型"。[安装](./01-setup.md)讲了这些角色。
- **凭一次绿色的构建就报告成功。** 构建只证明它能编译。要真实命令、流程、存储的值或 profile，并期待证据出现在回复里。
- **手写一个 `SKILL.md`。** 让它走[编写或修改技能作战手册](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，这样验证和审查都会发生。

这就是全部指南。如果你跳着看了，回到[安装](./01-setup.md)跑一个真实任务。习惯来自使用，而不是阅读。

回到[指南索引](./README.md)。

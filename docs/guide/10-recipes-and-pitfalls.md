# 配方与陷阱

值得照抄的提示词，然后是每个人都会犯一次的错误。换上你自己的路径和完成条件。这些配方故意写得很随意。实际打字时就是这样，而 skill 从简短的话里就能读懂意图。

![她品尝一道做好的菜，机器人照着食谱盒做菜，柜台上方别着写有 /how、/tdd 和 /loop 的卡片。](./images/recipes.jpg)

## 理解一个不熟悉的子系统

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

先机制，后历史。每个 skill 的报告都会告诉你它搜过哪些来源，所以你知道答案立足在什么上。

## 在碰代码之前先复述一份嘈杂的报告

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

误读会在复述里暴露出来，在那里纠正只花一条消息。在 agent 说出它自己的说法之前，把你自己的推测留在心里。`/in-your-own-words` 只要复述，不要行动手册。

## 发送之前先磨尖一条提示词

```text
/sharpen write the onboarding doc for the new billing service.
```

agent 点出专家会做哪些你没开口要的事，他们会从什么原始材料起步，他们的方法和工具，以及一份能证明结果正确的外部核对。它交回改写后的、正好要这些的提示词，并且不执行任务。当改写读起来对了，就发送它。

## 选定之前先做原型

```text
/poteto-mode prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

你从跑起来的东西里挑，不从描述里挑。agent 沿途回答它自己的布局和耗时问题。

## 把一份已定的设计变成计划

```text
/poteto-mode turn this design into a plan. small verifiable PRs, each with its own proof.
```

只在设计定下来之后再要。计划就是交付物，它点名将要执行它的那份行动手册。

## 对一份设计再要一个意见

```text
ask /arena for a second opinion on this thread and our approach
```

你当前的设计变成若干候选之一，综合会告诉你面板是找到了更好的东西，还是确认了你已有的。比起一个推翻代价很高的设计，它花费很少。

## 并行检查相互独立的切片

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

每个工作者拥有一个包。父级等待每一个切片，并返回一份 `PASS`、`ISSUES` 或 `BLOCKED` 的报告，而不是工作者的原始倾倒。

## 怀疑地评审一个分支

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

这些限定语在做真正的工作。“don't change anything yet” 让它保持只读，而吹毛求疵那条规则预先滤掉噪音，这样 `Act on` 里的发现才值得你的时间。

## 通过一个失败的测试修 bug

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

“if there's a cheap test path” 要紧。强迫一个测试穿过脆弱的 mock，比跑真实命令证明得更少，而行动手册被允许这样说。

## 带证明地复现并修复一份报告

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

“if it repros on main” 让运行在 bug 已经不在时提前停下。视频让你在读 diff 之前核对修复。

## 证明测试很少够到的一条性质

```text
/create-formal-verification-skill the retry queue. a message must never be delivered twice.
```

你得到一条性质，在声明范围内的每一种情形里被检查；如果代码已经打破它，还有一个用你代码自己的术语写成的反例；以及一个项目 skill，下一个 agent 在那份代码的任何改动上运行它。

## 在贴出数字之前核验它

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

你得到更快、更慢、没有可测差异，或无结论，并带上运行次数、范围，以及是什么限制了这个数字。

## 停止纠正同一个错误

```text
/correct agents keep adding new config flags without registering them in the schema
```

修复以架构、类型、lint 或测试的形式落在仓库里，这样下一个 agent 不能再犯这个错误。

## 问怎么做，而不开始工作

```text
/poteto-help how do i get poteto-mode to stay on every turn?
```

你得到一个答案、一条待发送的提示词，以及一个到来源的链接。在你发送那条提示词之前，什么都不会运行。

## 在你离开时让一次运行保持诚实

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

完整约定在[通宵那一页](./07-overnight.md)。一旦任务和完成条件已经在对话里，短形式就够用。

## 把一次漂走的运行拧回来

掌舵的提示词是一行：

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

你很少需要更多的字。你需要对的名字，而[原则那一页](./08-principles.md)就是这套词汇。

## 用白话拿回复

```text
/bro
```

这就是整条提示词。[`/bro`](../../skills/bro/SKILL.md) 把上一条消息重说成一个人对另一个人说话，没有行话，更短。当一条回复在技术上很彻底、你却仍然不知道它说了什么时，用它。

## 补上一个你留着在跑的对话

```text
/ketchup
```

[`/ketchup`](../../skills/ketchup/SKILL.md) 用白话告诉你自你上一条消息以来变了什么，然后列出每一件正等你处理的事，并带上它的选择、证据和风险。它在报告时什么都不改。

想改为看着补课，运行 [`/ketchup-video`](../../skills/ketchup-video/SKILL.md)。它用一段无声的幻灯片短视频展示发生了什么，并把正等你处理的事项以文字列在下面。

## 陷阱

- **在提示词里枚举 skill。** “use /how then /architect then /arena” 会重排行动手册已经排好的步骤。陈述目标和约束。只有为了覆盖一个默认时才点名 skill。
- **含糊的完成条件。** “让它变得更好”没给 `/loop` 任何可核对的东西。给一条能够通过或失败的命令或产物。
- **先抛出你对原因的推测。** agent 会搜你指的那个地方。先让它复述问题，再分享你的预感。
- **采纳第一份设计。** 一次尝试会把模型想到的第一种形状锁死。要原型或 `/architect`，并从证据里挑。
- **打磨一份抽象计划。** 对一份背后没有代码的计划做对抗式评审，会发明出永远不会发生的风险。用原型把开放问题定下来，再评审做出来的东西。
- **在一个工作树里放并行 agent。** 它们互相覆盖，没有人能说出哪个 agent 改了什么。把它们作为云端 agent 来跑，或者说 “own worktree per attempt”。
- **在你信任循环之前就上循环。** 一个不能验证自己工作的循环，只是让未经核对的工作来得更快。先让验证 skill 能工作。
- **信任一个未核验的数字。** 热缓存或一条被跳过的代码路径可以伪造一次加速。在数字去任何地方之前运行 `/benchmark-checklist`。
- **手工纠正同一个错误。** 对话里的一次纠正只帮一次运行。`/correct` 修好仓库，让以后的运行不再重复它。
- **用 `/arena` 做覆盖。** `/arena` 重复一份设计或代码简报，然后选定底稿并嫁接最好的部分。`/swarm` 划分切片或预先声明的赛跑臂，并汇总成一份报告。
- **接受每一条评审评论。** 机器人和人都会把真正抓到的问题和噪音放在同一个列表里。`/interrogate` 把发现分进采取行动和驳回的桶，并附理由，两种你都可以推翻。
- **把 `auto` 当成模型 slug。** `auto` 和 `inherit-parent` 的意思是“省略模型字段，让子 agent 继承父对话的模型”。[安装](./01-setup.md)讲这些角色。
- **凭一次全绿的构建报告成功。** 构建证明它能编译。去要真实的命令、流程、存下来的值或性能分析，并期望回复里有证据。
- **凭空手写一份 `SKILL.md`。** 让它走[编写或修改 skill 行动手册](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，这样校验和评审才会发生。

这就是本指南。如果你跳着读了，回到[安装](./01-setup.md)，跑一个真实任务。习惯是用出来的，不是读出来的。

回到[指南目录](./README.md)。

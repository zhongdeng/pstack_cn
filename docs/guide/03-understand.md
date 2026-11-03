# 先读懂代码，再动手改

改自己没读懂的代码，就是细微回归被带上线的根源，这对智能体和对你自己一样成立。智能体通常有两种失败方式。要么误解了你的意图，要么缺少把活干对的上下文。[提示词里该放什么](./02-poteto-mode.md#what-goes-in-a-prompt)解决第一种。这一页解决第二种。

pstack 给了你四种入口。`/how` 讲清代码现在在做什么。`/why` 挖出它为什么长成这样。`/teach` 把两者揉成一份解释。`/recall` 重建你自己在某个话题上的近期上下文。每一种都会让智能体用你能核对的文字把结论讲清楚。你就是这样监督一个可能比你更懂这段代码的智能体。

![一名侦探拿着放大镜研究机器蓝图，机器人在旁边取来案卷；她身后的证据板上，线索在 /how 和 /why 之下彼此关联。](./images/understanding.jpg)

## 从只读调查开始

原因不清楚时，要的是发现，不是修复：

```text
/poteto-mode investigate why background jobs time out every few hours. give me what we know, what data you used, and your best hypotheses. don't change any code yet.
```

"don't change any code yet" 会把这件事路由到[调查作战手册](../../skills/poteto-mode/playbooks/investigation.md)。它会跑 `/how`，遇到动机类问题再补上 `/why`，返回一份带引用的解释。如果是在几个选项之间做选择，它返回一份带权衡表的建议。要求它说明"what data you used"，会逼智能体把证据和猜测分开。当发现指向某个修复时，把修复当成新任务另起。

## 用 `/how` 追行为

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

问出你真正想问的问题。[`/how`](../../skills/how/SKILL.md) 会读代码，然后按资深工程师带你熟悉这个子系统的水准来回答，讲清运行时流程、关键类型，以及那些不显眼的地方。子系统大的时候，它先派出两到四个只读探查者并行去查。问题窄的时候，它就直接读、直接讲。

## 用 `/why` 挖历史

```text
/why was the retry limit set to five? does the reason still hold?
```

[`/why`](../../skills/why/SKILL.md) 从源码管理入手，然后并行查询你的 MCP 暴露出的各类证据，比如 issue 跟踪、长文档、团队聊天、可观测性、错误跟踪和分析。报告给所有内容都标上引用，把直接证据和推断分开，记录稀薄时会说"appears to"。查不到结果也会如实报告，因为"没人写下原因"本身就是一种答案。

两者天然能组合。当你怀疑历史能解释这团乱麻时，`do why first then how` 是个好提示词。

## 用 `/teach` 真正弄懂

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

[`/teach`](../../skills/teach/SKILL.md) 用在摘要不够的时候。它会跑 `/how` 和 `/why`，改动小的话也许只跑其中一个，然后把发现编织成一份朴素的解释，一张图一张图地搭起来。"convince me"这个说法值得反复用。它把解释变成一场你能检验的论证，而不是一次走马观花。

它对智能体自己的选择同样管用：

```text
/teach me why you implemented it this way and not with a queue. what did you trade off, and why?
```

教学对智能体的帮助和对你的帮助一样大。一个必须解释自己工作的智能体，得去读代码、给每个论断配上证据，而不是自信地说一句就往下走。

## 用 `/recall` 重建你自己的上下文

```text
/recall catch me up on the export work from last week
```

[`/recall`](../../skills/recall/SKILL.md) 会翻你自己近期的聊天，再加上共享记录（issue、之前的修复、还在报的错误），给你一份简报，讲清现在到哪一步、接下来做什么。你的旧聊天里有新智能体没有的上下文，所以在老话题上开新活时，先把这些加载进来，再交出新输入：

```text
/recall my work on the virtualized list from yesterday, then read this bug report.
```

如果你想接着某一个具体的聊天继续，那是下面的会话接续作战手册，不是 `/recall`。

## 用会话接续接手之前的工作

当另一个智能体（或者上周的你自己）把一个分支留在了半路：

```text
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.
```

[会话接续作战手册](../../skills/poteto-mode/playbooks/session-pickup.md)把之前的痕迹当作权威。它重建分支状态和决策，指出续接点，并拿最初的目标去核对继承来的说法，而不是从头把一切重新推导一遍。

**坑：**别因为"反正智能体会读代码"就跳过这一页的技能。一个没有追出模型就开始改代码的智能体，往往会在第一个看起来说得通的地方修症状。先跑 `/how`，比第二个 bug 便宜。

下一页：[设计改动](./04-design.md)。

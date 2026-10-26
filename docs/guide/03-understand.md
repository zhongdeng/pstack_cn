# 改代码之前先理解它

编辑你不理解的代码，就是微妙回归被交付出去的方式，对 agent 和对你都一样。agent 的失败通常是两种之一。它们误读了你想要的，或者它们没有把工作做对所需的上下文。[提示词里放什么](./02-poteto-mode.md#what-goes-in-a-prompt)处理第一种。这一页处理第二种。

pstack 给你四条进去的路。`/how` 解释代码现在做什么。`/why` 挖出它为什么长成这样。`/teach` 把两者织成一份解释。`/recall` 重建你自己在某个话题上的近期上下文。每一个还会让 agent 用你能够核对的话解释它自己。你就是这样监督一个可能比你更懂这段代码的 agent。

![侦探用放大镜研究机器蓝图，机器人去取案卷；她身后的证据板上，线索标在 /how 和 /why 之下。](./images/understanding.jpg)

## 从一次只读调查开始

原因还不清楚时，要发现，不要修复：

```text
/poteto-mode investigate why background jobs time out every few hours. give me what we know, what data you used, and your best hypotheses. don't change any code yet.
```

“don't change any code yet” 会把这一次路由到[调查行动手册](../../skills/poteto-mode/playbooks/investigation.md)。它运行 `/how`，对关于动机的问题再加上 `/why`，并返回一份带引用的解释。对于在几个选项之间做选择，它返回一份带权衡表的建议。问 “what data you used” 会让 agent 把证据和猜测分开。当发现指向一处修复时，把修复当作一个新任务开始。

## 用 `/how` 追踪行为

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

问你真正有的那个问题。[`/how`](../../skills/how/SKILL.md) 读代码，并以一位带你上手这个子系统的资深工程师的水平来回答，带上运行时流程、关键类型，以及不那么显然的部分。对于一个大子系统，它会先扇出两到四个只读探索者。对于一个窄问题，它就直接读并解释。

## 用 `/why` 挖出历史

```text
/why was the retry limit set to five? does the reason still hold?
```

[`/why`](../../skills/why/SKILL.md) 从源码管理开始，然后查询你的 MCP 所暴露的各类证据，例如议题跟踪、长篇文档、团队聊天、可观测性、错误跟踪和分析，全部并行。报告引用一切，把直接证据和推断分开，记录稀薄时会说 “appears to”。空结果也会被报告，因为“没人把为什么写下来”本身就是一个答案。

两者自然地组合。当你怀疑是历史解释了这摊乱，`do why first then how` 是一条好提示词。

## 用 `/teach` 真正理解它

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

[`/teach`](../../skills/teach/SKILL.md) 用于一份摘要不够的时候。它运行 `/how` 和 `/why`，对一处小改动也许只运行其中一个，并把发现织成一份白话解释，一张图一张图地搭起来。“convince me” 这种说法值得复用。它把解释变成一个你可以检验的论证，而不是一次参观。

它也能用在 agent 自己的选择上：

```text
/teach me why you implemented it this way and not with a queue. what did you trade off, and why?
```

讲解对 agent 的帮助不亚于对你。一个必须解释自己工作的 agent，得去读代码，并用证据支撑每一条声称，而不是自信地说完就继续。

## 用 `/recall` 重建你自己的上下文

```text
/recall catch me up on the export work from last week
```

[`/recall`](../../skills/recall/SKILL.md) 挖掘你自己最近的聊天，加上共享记录（议题、先前的修复、仍在触发的错误），并交回一份简报，说明事情现在到了哪里、下一步是什么。你的旧聊天里有新 agent 所没有的上下文，所以在一个旧话题上开始新工作之前，先把它载入，再交上新的输入：

```text
/recall my work on the virtualized list from yesterday, then read this bug report.
```

如果你想恢复某一个具体的聊天，那是下面的会话接手行动手册，不是 `/recall`。

## 用会话接手接管先前的工作

当另一个 agent（或者上周的你）把一个分支留在半途：

```text
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.
```

[会话接手行动手册](../../skills/poteto-mode/playbooks/session-pickup.md)把先前的轨迹当作权威。它重建分支状态和各项决定，点出恢复点，并对照最初的目标核验继承下来的声称，而不是从头把一切重新推导一遍。

**陷阱：** 不要因为“agent 反正会读代码”就跳过这一页的 skill。一个还没有追踪出模型就开始编辑的 agent，往往会在第一个说得通的地方修复症状。先 `/how`，比第二个 bug 便宜。

下一篇：[设计改动](./04-design.md)。

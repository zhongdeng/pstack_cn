# pstack 指南

pstack 在你不再对 agent 事无巨细地管控时效果最好。你描述你想要什么，以及你将如何知道它做完了。`/poteto-mode` 挑选行动手册，在步骤需要时运行其他 skill，并把证据给你看。本指南用贴近真实的提示词教你养成这个习惯。

你将学到这些：

1. [安装 pstack](./01-setup.md)。安装插件并挑选你的模型。
2. [让工作走 `/poteto-mode`](./02-poteto-mode.md)。给它一个目标，看它挑选一份行动手册。
3. [理解代码](./03-understand.md)。一次只读调查，然后在你改任何东西之前用 `/how`、`/why`、`/teach` 和 `/recall`。
4. [设计改动](./04-design.md)。在代码锁死一种形状之前，用 `/architect`、`/arena`、`/swarm`、`/interrogate`、原型和计划。
5. [构建并清理改动](./05-build-and-clean.md)。构建类行动手册、`/tdd`、`/unslop` 和 `/no-comments`。
6. [验证并交付](./06-verify-and-ship.md)。在真实应用上证明行为，对测试很少够到的东西做形式化验证，用 `/benchmark-checklist` 核验数字，然后开一个聚焦的 PR 并把它推到已合并。
7. [在你睡觉时跑工作](./07-overnight.md)。先有信任再上循环，一份通宵约定，一份你可以审计的决策日志，以及能扩到单个 agent 之外的 Project 和自动化。
8. [用原则名字掌舵](./08-principles.md)。那 24 个能在任务中途把 agent 拧回来的名字。
9. [把它变成你的](./09-make-it-yours.md)。你自己的 mode、用 `/correct` 对付反复出现的错误，以及如何测试一次 skill 改动。
10. [配方与陷阱](./10-recipes-and-pitfalls.md)。可以照抄的提示词，以及要避开的错误。

第一次按顺序读这些页面。之后，每一页都独立成立。

卡住的时候，或者分不清哪个 skill 合适时，带上你的问题输入 [`/poteto-help`](../../skills/poteto-help/SKILL.md)：

```text
/poteto-help which skill should i use to review this branch?
```

它会回答，交给你一条待发送的提示词，并链到答案所来自的 skill 或指南页。它不开始工作，因为一次 pstack 运行会花掉真实的 token，所以你准备好了再发送那条提示词。只有你输入它时它才运行。

## 如果只记住一件事

用你自己的话，给 agent 一个目标，以及一种核对它的办法：

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. repro first, then fix and verify.
```

你不需要点名行动手册或列出 skill。“repro first” 和一个可以核对的结果，就是 `/poteto-mode` 需要的全部路由信号。它匹配缺陷修复行动手册，把步骤复制进待办列表，并在每一步触发时调用对的 skill。

下一篇：[安装 pstack](./01-setup.md)。

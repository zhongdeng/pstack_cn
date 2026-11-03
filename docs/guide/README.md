# pstack 指南

pstack 最好用的方式，是你别再事无巨细地管着智能体。你说清楚想要什么，以及怎么算做完了。`/poteto-mode` 会挑作战手册，按步骤需要调用其他技能，并把证据摆给你看。这份指南用贴近真实的提示词教你这个习惯。

你会学到这些：

1. [安装 pstack](./01-setup.md)。装好插件，选好模型。
2. [把活儿交给 `/poteto-mode`](./02-poteto-mode.md)。给它一个目标，看它挑作战手册。
3. [读懂代码](./03-understand.md)。先做一次只读调查，然后在动手改之前用 `/how`、`/why`、`/teach` 和 `/recall`。
4. [设计改动](./04-design.md)。在代码定型之前，用 `/architect`、`/arena`、`/swarm`、`/interrogate`、原型和方案。
5. [构建并清理改动](./05-build-and-clean.md)。构建类作战手册、`/tdd`、`/unslop` 和 `/no-comments`。
6. [验证并交付](./06-verify-and-ship.md)。在真实应用上证明行为，对测试很少覆盖到的地方做形式化验证，用 `/benchmark-checklist` 审一遍数字，然后开一个聚焦的 PR 并推进到合并。
7. [你睡觉时也在干活](./07-overnight.md)。循环之前先建立信任、一份过夜契约、一份你能审计的决策日志，以及能扩展到不止一个智能体的 Projects 和自动化。
8. [用原则名来引导](./08-principles.md)。24 个能在任务中途改变智能体方向的名字。
9. [改成你自己的](./09-make-it-yours.md)。你自己的模式、针对反复犯错的 `/correct`，以及怎么测试一次技能改动。
10. [配方与坑](./10-recipes-and-pitfalls.md)。可以照抄的提示词，和该避开的错误。

第一次按顺序读。之后每一页都能单独看。

卡住了，或者分不清该用哪个技能，就带上你的问题输入 [`/poteto-help`](../../skills/poteto-help/SKILL.md)：

```text
/poteto-help which skill should i use to review this branch?
```

它会回答，递给你一段可以直接发的提示词，并附上答案出自哪个技能或指南页。它不会直接开工，因为一次 pstack 运行要花真金白银的 token，所以等你准备好了再发那段提示词。只有你输入它时它才运行。

## 如果你只记住一件事

用你自己的话，给智能体一个目标和一个检查它的办法：

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. repro first, then fix and verify.
```

你不需要点名作战手册，也不需要列出技能。"repro first" 加上一个可检查的结果，就是 `/poteto-mode` 需要的全部路由信号。它会匹配到 Bug fix 作战手册，把步骤抄进待办列表，并在每一步触发时调用对应的技能。

下一站：[安装 pstack](./01-setup.md)。

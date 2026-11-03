---
name: principle-attack-the-premise
description: "当两个或更多共享同一个前提的修复都卡在同一个 gate 上时使用。把前提写下来，直接验证它，然后再写下一个假设它成立的修复。"
disable-model-invocation: true
---

# 攻击前提

当两个或更多共享同一个前提的修复都卡在同一个 gate 上时，怀疑前提，而不是修复。

**为什么：** 每一个失败的修复都是对它假设的那个信念的反证。基于同一前提的第三个修复，会把精力花在证据已经指出原因不在这里的地方。

**模式：**
- **把前提写下来。** 前提就是每个失败修复都假设的那一句话。
- **在下一个修复之前先验证前提。** 找一个观察，如果前提为假，这个观察会得出不同的结果，然后去做这个观察。看失败是怎么分布的，而不只是看失败有多大。按 [Build the Lever](../principle-build-the-lever/SKILL.md) 让这个检查可以重复运行。
- **跟着证据走。** 如果证据与前提矛盾，原因在别处。去找这些失败共同具备、而前提没有预测到的东西。如果证据证实了前提，就按 [Fix Root Causes](../principle-fix-root-causes/SKILL.md) 追问下一个"为什么"。之前的修复可能只是在处理后果，而不是原因。
- **移除条件，而不是补偿它**，按 [Laziness Protocol](../principle-laziness-protocol/SKILL.md)。如果证据显示某一部分总是落在输的那一边，就改变把它放到那里的东西。一个事后清理的机制会把原因留在原地，还会在每次运行时增加工作量。

**停：** 在前提被写下来并验证之前，不要开始下一个修复。

这条原则不同于 [Redesign from First Principles](../principle-redesign-from-first-principles/SKILL.md)，后者是围绕一个新需求重建设计。这条原则质疑的是当前设计所假设的一个事实。

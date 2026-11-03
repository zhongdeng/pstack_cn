---
name: no-comments
description: "启动 Comment Sicko，修复被接受的发现，并为声称的约束提供编码方案。"
disable-model-invocation: true
---

# 不留注释

启动 Comment Sicko。对被接受的发现采取行动。

以 Comment Sicko 的新鲜视角为准。

## 范围

使用调用方给出的文件或 diff。否则使用当前 diff 对比基线分支，默认 `main`，包含工作区。

## 步骤

1. 用 `Task` 启动 `subagent_type: "comment-sicko"`。把范围传过去。按 **poteto-mode** 技能里 Subagents 一节，为这项任务挑选每个子智能体的推理档位和 fast 或 standard 速度。不要复述它的规则。
2. 检查它的报告和 diff。拒绝应用代码改动、范围越界、受异常保护的删除、理由陈述错误的 `MUST KILL`，以及把保留下来的有意代码当成有罪的标记。针对我们代码的意外情况重塑标记，仍然可执行。不要恢复那些注释。保留只有在能证明它针对的是我们无法改变的东西时才成立。审计漏掉的范围内 lint 和 TypeScript 抑制。正确性或安全性抑制仍然可执行的 `MUST KILL`。只有给出确切异常和范围内证明时才恢复删除。在接受单薄的 `IMPORTANT` 或 `do not remove` 击杀或保留之前，对其符号运行 `/how` 或 `/why`。如果击杀有歧义，不要恢复。如果保留被驳倒或仍有歧义，删掉它。回滚并重跑一份被拒绝的报告，并点名失败原因。拒绝第二份，把它作为未决项报告，并让 `/no-comments` 失败。
3. 直接修复琐碎的被接受标记：删掉死路径、去掉参数，或用真实 API。如果任何修复需要形状，对已接受集合和周边代码运行一次 `/architect`。停在草图。Architect 定形状。步骤 4 实现。
4. 在范围内实现最小的根因修复。移除每一个点名的绕过方案。如果根因在范围外，落地最小的范围内修复，其余作为未决项报告。**principle-fix-root-causes** 和 **principle-redesign-from-first-principles** 技能只指导意图。两者都不授权扩大围栏，也不授权修复围栏外的实例。绝不硬加症状守卫。
5. 约束注释会说 `do not remove`、`do not change wording` 或 `talk to X before changing`。关于我们无法改变的东西的保留，留着。提供最便宜的范围内类型、运行时、测试或 CI lint。等待交互式批准。无人值守和 eval 需要调用方预先批准。如果批准，先编码再删除。否则删除，把约束作为未决项报告，并草拟范围外的工作。
6. 报告删除数量、恢复的注释、重跑、architect 草图、修复、编码提议、编码、未强制执行的约束，以及其他未决工作。

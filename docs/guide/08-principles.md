# 用原则名来引导

pstack 把 24 条原则作为独立的技能发布。`/poteto-mode` 在每个多步任务开始时读取它们的索引，应用任务触发的那几条，并在回复里点名每条被应用的原则，以及它改变了哪个决策。

你不调用原则。你用它们的名字来引导。每个名字都指向一条智能体已经读过的完整规则，所以一个短语比一段指令更精准地改变工作方向。

## 实际引导

假设智能体正准备在三个现有适配器上再硬接一个新适配器：

```text
use subtract before you add. delete the obsolete adapters first, then design what's left.
```

假设它因为构建通过就宣称成功：

```text
apply prove it works. run the real import flow and show me the written records.
```

假设两个并行尝试即将写入同一个分支：

```text
separate before serializing shared state. give each attempt its own worktree, no locks.
```

每个短语都管用，因为它背后的规则很具体。智能体仍然必须在回复里说明这条规则改变了哪个决策。只引用原则却没有对应的决策，说明智能体只是点了规则的名字，并没有应用它。

## 24 条，简述

核心原则决定要建多少东西，以及什么时候重新考虑设计：

- [Laziness Protocol](../../skills/principle-laziness-protocol/SKILL.md) 偏好删除，以及能解决问题的最小改动。
- [Foundational Thinking](../../skills/principle-foundational-thinking/SKILL.md) 在写逻辑之前先选定核心数据结构。
- [Redesign from First Principles](../../skills/principle-redesign-from-first-principles/SKILL.md) 把新需求整合进来，就像它从第一天就存在一样。
- [Attack the Premise](../../skills/principle-attack-the-premise/SKILL.md) 写下两个或更多失败修复共同的前提，在下一次修复前直接检验它。
- [Subtract Before You Add](../../skills/principle-subtract-before-you-add/SKILL.md) 在往上建之前先去掉累赘。
- [Minimize Reader Load](../../skills/principle-minimize-reader-load/SKILL.md) 合并读者必须在脑子里记住的层次和隐藏状态。
- [Outcome-Oriented Execution](../../skills/principle-outcome-oriented-execution/SKILL.md) 让重写收敛到目标设计，而不是保留一次性的兼容状态。
- [Experience First](../../skills/principle-experience-first/SKILL.md) 选择用户的结果，而不是实现上的方便。
- [Exhaust the Design Space](../../skills/principle-exhaust-the-design-space/SKILL.md) 在没有先例时构建两三个互相竞争的原型。
- [Build the Lever](../../skills/principle-build-the-lever/SKILL.md) 构建那个完成或证明工作的脚本，让评审者能重跑它。当智能体一直手工重复同一件事时，让它写出它希望自己拥有的工具或技能。如果某个步骤脚本每次都能以同样的方式完成，就用脚本，把智能体留给需要判断的地方。

架构原则决定状态、校验和兼容性放在哪里：

- [Model the Domain](../../skills/principle-model-the-domain/SKILL.md) 把重复的规则编码进一个结构，而不是散落各处的条件分支。
- [Boundary Discipline](../../skills/principle-boundary-discipline/SKILL.md) 在边界处校验，信任内部类型。
- [Type System Discipline](../../skills/principle-type-system-discipline/SKILL.md) 让非法状态无法表示。
- [Make Operations Idempotent](../../skills/principle-make-operations-idempotent/SKILL.md) 让重试收敛到同一个最终状态。
- [Migrate Callers Then Delete Legacy APIs](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) 在一波里完成迁移和删除。
- [Separate Before Serializing Shared State](../../skills/principle-separate-before-serializing-shared-state/SKILL.md) 在加协调之前先去掉共享。

验证原则定义什么才算证明：

- [Prove It Works](../../skills/principle-prove-it-works/SKILL.md) 验证真实产物，而不是代理指标。
- [Fix Root Causes](../../skills/principle-fix-root-causes/SKILL.md) 先复现并追踪到根因，再改代码。
- [Sequence Work into Verifiable Units](../../skills/principle-sequence-verifiable-units/SKILL.md) 让每个小单元都以一次检查收尾，再开始下一个。
- [Test Behavior, Not Implementation](../../skills/principle-test-behavior-not-implementation/SKILL.md) 断言代码使用者能观察到的行为，这样该行为被破坏时测试会失败，而内部实现改动时测试仍然通过。
- [Explain the Number](../../skills/principle-explain-the-number/SKILL.md) 在任何人信任或上报一个测量数字之前，说清是什么限制了它，并排除它测的是别的东西。 [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 把它变成七个问题，你用真实运行来回答。

委派原则让并行工作保持清醒：

- [Guard the Context Window](../../skills/principle-guard-the-context-window/SKILL.md) 把大量阅读交给子智能体，把发现留在主对话里。
- [Never Block on the Human](../../skills/principle-never-block-on-the-human/SKILL.md) 在可逆的工作上继续推进，并呈现结果。

还有一条元原则：

- [Encode Lessons in Structure](../../skills/principle-encode-lessons-in-structure/SKILL.md) 把你重复过两次的建议变成 lint、检查或脚本。 [`/correct`](../../skills/correct/SKILL.md) 把它应用到整个仓库，如 [Make it yours](./09-make-it-yours.md#fix-the-environment-with-correct) 所示。

别去背这个列表。现在扫一遍，然后当你抓到智能体做了某个这里的名字本可以阻止的事时，再回来。词汇就是这样记牢的。

下一步：[Make it yours](./09-make-it-yours.md)。

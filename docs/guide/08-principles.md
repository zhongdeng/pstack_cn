# 用原则名字掌舵

pstack 把 24 条原则作为单独的 skill 提供。`/poteto-mode` 在每个多步任务开始时读它们的索引，应用任务所触发的那些，并在回复里点名每一条用到的原则，以及它改变了的那个决定。

你不调用原则。你用它们的名字来掌舵。每个名字指向一条 agent 已经读过的完整规则，所以一句话比一段指示更精确地扭转工作。

## 实际中的掌舵

假如 agent 正要把一个新适配器补钉到三个已有的上面：

```text
use subtract before you add. delete the obsolete adapters first, then design what's left.
```

假如它因为构建通过就声称成功：

```text
apply prove it works. run the real import flow and show me the written records.
```

假如两次并行尝试正要写到同一个分支：

```text
separate before serializing shared state. give each attempt its own worktree, no locks.
```

每句话之所以落地，是因为它背后的规则是具体的。agent 仍然必须在回复里说出，这条规则改变了哪个决定。一条背后没有决定的原则引用，意味着 agent 点了规则的名，却没有应用它。

## 这 24 条，简要地说

核心原则决定建多少，以及何时重新想设计：

- [Laziness Protocol](../../skills/principle-laziness-protocol/SKILL.md) 偏向删除，以及能解决问题的最小改动。
- [Foundational Thinking](../../skills/principle-foundational-thinking/SKILL.md) 在写逻辑之前选定核心数据结构。
- [Redesign from First Principles](../../skills/principle-redesign-from-first-principles/SKILL.md) 把一条新需求整合进来，就好像它从第一天起就在那里。
- [Attack the Premise](../../skills/principle-attack-the-premise/SKILL.md) 写下两个或更多失败修复所共享的前提，并在下一次修复之前直接检验它。
- [Subtract Before You Add](../../skills/principle-subtract-before-you-add/SKILL.md) 在其上构建之前，先去掉死重。
- [Minimize Reader Load](../../skills/principle-minimize-reader-load/SKILL.md) 折叠层数，以及读者必须在脑子里持有的隐藏状态。
- [Outcome-Oriented Execution](../../skills/principle-outcome-oriented-execution/SKILL.md) 让重写向目标设计收敛，而不是保住用完即弃的兼容状态。
- [Experience First](../../skills/principle-experience-first/SKILL.md) 选择用户的结果，而不是实现上的方便。
- [Exhaust the Design Space](../../skills/principle-exhaust-the-design-space/SKILL.md) 在没有先例时，构建两个或三个相互竞争的原型。
- [Build the Lever](../../skills/principle-build-the-lever/SKILL.md) 打造那个去做或证明这份工作的脚本，这样评审者可以重跑它。当一个 agent 不断手工做同一件事时，让它写下它希望自己拥有的工具或 skill。如果一个脚本能每次以同样的方式做某一步，就用脚本，把 agent 留给判断。

架构原则决定状态、校验和兼容住在哪里：

- [Model the Domain](../../skills/principle-model-the-domain/SKILL.md) 把重复的规则编码进一种结构，而不是散落的条件判断。
- [Boundary Discipline](../../skills/principle-boundary-discipline/SKILL.md) 在边界校验，并信任内部类型。
- [Type System Discipline](../../skills/principle-type-system-discipline/SKILL.md) 让非法状态无法表示。
- [Make Operations Idempotent](../../skills/principle-make-operations-idempotent/SKILL.md) 让重试收敛到同一个终态。
- [Migrate Callers Then Delete Legacy APIs](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) 在一波里迁移并删除。
- [Separate Before Serializing Shared State](../../skills/principle-separate-before-serializing-shared-state/SKILL.md) 在增加协调之前先去掉共享。

验证原则定义什么算证明：

- [Prove It Works](../../skills/principle-prove-it-works/SKILL.md) 验证真实产物，而不是替代物。
- [Fix Root Causes](../../skills/principle-fix-root-causes/SKILL.md) 在改代码之前先复现并追溯到原因。
- [Sequence Work into Verifiable Units](../../skills/principle-sequence-verifiable-units/SKILL.md) 让每个小单元在开始下一个之前以一次核对结束。
- [Test Behavior, Not Implementation](../../skills/principle-test-behavior-not-implementation/SKILL.md) 断言代码的使用者能够观察到的东西，这样当该行为损坏时测试失败，并在内部实现变化时仍然通过。
- [Explain the Number](../../skills/principle-explain-the-number/SKILL.md) 点出是什么限制了一个测到的数字，并排除它测到的是别的东西，然后才有人信任或报告它。[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 把它变成七个你从真实运行里回答的问题。

委派原则让并行工作保持清醒：

- [Guard the Context Window](../../skills/principle-guard-the-context-window/SKILL.md) 把批量阅读路由给子 agent，并把发现留在主对话里。
- [Never Block on the Human](../../skills/principle-never-block-on-the-human/SKILL.md) 在可逆的工作上继续推进，并呈现结果。

还有一条元原则：

- [Encode Lessons in Structure](../../skills/principle-encode-lessons-in-structure/SKILL.md) 把你重复过两次的建议变成 lint、检查或脚本。[`/correct`](../../skills/correct/SKILL.md) 把它用到整个仓库，如 [把它变成你的](./09-make-it-yours.md#fix-the-environment-with-correct) 所示。

不要背这份清单。现在扫一眼，然后当你抓住 agent 在做某件这里的某个名字本可以阻止的事时，再回来。词汇就是这样留下来的。

下一篇：[把它变成你的](./09-make-it-yours.md)。

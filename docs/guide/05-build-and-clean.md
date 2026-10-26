# 构建改动并清理 diff

构建类行动手册共享一条纪律。说出你观察到的，让行动手册去要求证据。这一页说明每种常见构建任务的提示词里该放什么，然后是那个让 diff 可以评审的清理习惯。

## 用你知道的东西来提示每份构建行动手册

一条 bug 提示词陈述症状，并要求先复现：

```text
/poteto-mode this command emits two records after a retry. repro first, then fix and verify.
```

一条功能提示词陈述行为，以及什么不许变：

```text
/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.
```

一条重构提示词在结构移动之前钉住行为：

```text
/poteto-mode move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.
```

一条性能提示词陈述测量，而不是印象：

```text
/poteto-mode startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.
```

每一条都会路由到自己的行动手册（[缺陷修复](../../skills/poteto-mode/playbooks/bug-fix.md)、[功能](../../skills/poteto-mode/playbooks/feature.md)、[重构](../../skills/poteto-mode/playbooks/refactoring.md)、[性能问题](../../skills/poteto-mode/playbooks/perf-issue.md)），行动手册补上你没打出来的步骤：修复之前先复现，实现之前先命名数据形状，重组之前先钉住行为，优化之前先做性能分析。

对于一个数字的持续改进，有[爬山优化行动手册](../../skills/poteto-mode/playbooks/hillclimb.md)。给它指标、目标和尝试次数的下限，它就一次一个假设地循环，测量 harness 是冻结的。它留下胜出，其余一切都回退。

两份性能行动手册都会对它们的数字运行 [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)。性能问题核验它的基线以及之后的每一个数字，爬山优化在冻结 harness 之前核验它。[验证并交付](./06-verify-and-ship.md#vet-a-measured-number-with-benchmark-checklist)说明什么时候你自己来输入它。

有时你想在任何修复之前先要原因。对于一个现场症状，例如泄漏、空闲时 CPU 空转或视觉毛刺，[运行时取证行动手册](../../skills/poteto-mode/playbooks/runtime-forensics.md)给正在运行的进程做插桩。对于一份你已经采集的性能分析，[追踪取证行动手册](../../skills/poteto-mode/playbooks/trace-forensics.md)读取这份产物，并把热点帧映射到源码。两者都返回诊断，不返回修复：

```text
/poteto-mode here's a cpuprofile from the slow startup. tell me where the time goes and which source lines own it. no fix yet.
```

## 用 `/tdd` 先写失败的测试

当一个 bug 有一条便宜的本地测试路径时，整条提示词可以是两个词：

```text
/tdd implement
```

在上下文里，这就够了。[`/tdd`](../../skills/tdd/SKILL.md) 写下那个因预期原因而失败的最小测试，然后是修复，然后重新跑测试。如果一个测试需要大范围的 harness 搭建或脆弱的 mock，这个 skill 会说出来，并改用最接近的可执行核对。不要在一条真实命令才是更强证据的地方硬塞测试。

## 按名字载入 TypeScript 规则

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md) 把类型系统原则变成具体规则：可辨识联合、边界上的 `unknown`、穷尽的变体、从 schema 派生的类型。它不会自己载入，所以当任务触及 `.ts` 或 `.tsx` 文件时，输入 `/typescript-best-practices`。

## 提交之前先清理

[开 PR 行动手册](../../skills/poteto-mode/playbooks/opening-a-pr.md)在每次提交之前对 diff 运行 `/deslop`，并把 [`/unslop`](../../skills/unslop/SKILL.md) 用到 PR 描述和提交正文上。`/deslop` 在 `cursor-team-kit` 插件里，不在 pstack 里。如果你没有它，用白话要求同样的结果：去掉叙述性注释、没有依据的守卫、死去的兼容路径，以及无关的编辑。

对于文字，`/unslop` 接受一个目标，以及你有的任何额外规则：

```text
/unslop the readme changes, no emdashes
```

你会发展出自己的简写。这个 skill 从 `unslop that, tighten it` 这样简短的提示词里就能读懂意图。

## 用 `/no-comments` 剥掉注释

注释需要单独过一遍，而且不能由写下它们的那个 agent 来过。作者捍卫自己的注释，就像你会捍卫你的一样。所以在评审之前，把它们交给一双新的眼睛：

```text
/no-comments the diff
```

[`/no-comments`](../../skills/no-comments/SKILL.md) 拉起 [Comment Sicko](../../agents/comment-sicko.md)，一个只读评审者，保留清单很短：许可证头、公共 API 上的文档注释、解释代码本身无法说明之事的链接、由一个你无法重塑的外部依赖所迫使的行为。其余一切都去掉。你自己代码里的一处意外得不到这样的保留。这条注释会作为重构标记回来，`/no-comments` 在根因上修复它接受的那些标记。当一条注释声称一条约束，“do not remove”，这个 skill 会提议把这条声称编码成类型、测试或 lint。无论哪种，注释都会出来。

分工值得保持清楚。`/deslop` 把注水从代码里清掉，`/unslop` 把它从文字里清掉，`/no-comments` 把注释交给一个没写过它们的评审者。

**陷阱：** 清理不是可选的抛光。一份带着叙述性注释和防御性死重的 diff，在评审者看来是没做完，而多出来的代码就是下一个 bug 躲藏的地方。如果 diff 感觉被垫厚了，在提交之前说 `deslop it`，而不是等评审指出来。

下一篇：[验证并交付](./06-verify-and-ship.md)。

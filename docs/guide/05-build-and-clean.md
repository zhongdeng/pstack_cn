# 构建改动并清理 diff

几个构建作战手册遵循同一条纪律。你说出你观察到了什么，作战手册负责索要证据。这一页讲每个常见构建任务该往提示词里写什么，然后讲那个让 diff 保持可审的清理习惯。

## 用你知道的东西给每个构建作战手册写提示词

Bug 的提示词陈述症状，并要求先复现：

```text
/poteto-mode this command emits two records after a retry. repro first, then fix and verify.
```

Feature 的提示词陈述行为，以及什么不能变：

```text
/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.
```

重构的提示词在结构变动之前先钉住行为：

```text
/poteto-mode move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.
```

性能的提示词陈述测量值，不是印象：

```text
/poteto-mode startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.
```

每一条都会路由到对应的作战手册（[Bug fix](../../skills/poteto-mode/playbooks/bug-fix.md)、[Feature](../../skills/poteto-mode/playbooks/feature.md)、[Refactoring](../../skills/poteto-mode/playbooks/refactoring.md)、[Perf issue](../../skills/poteto-mode/playbooks/perf-issue.md)），作战手册补上你没打的那些步骤：修之前先复现，实现之前先说清数据形状，重构之前先钉住行为，优化之前先做 profile。

要持续改进某一个数字，有 [Hillclimb 作战手册](../../skills/poteto-mode/playbooks/hillclimb.md)。给它指标、目标，以及尝试次数的下限，它一次只循环一个假设，测量工具保持冻结。它保留赢的那些，其余全部回滚。

两个性能作战手册都会对自己的数字跑 [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)。Perf issue 审查它的基线以及之后的每一个数字，Hillclimb 在冻结测量工具之前先审查它。[验证与交付](./06-verify-and-ship.md#vet-a-measured-number-with-benchmark-checklist)讲了什么时候该你自己敲它。

有时候你想在任何修复之前先拿到原因。对于活着的症状，比如泄漏、空闲 CPU 空转、视觉故障，[Runtime forensics 作战手册](../../skills/poteto-mode/playbooks/runtime-forensics.md)给运行中的进程加探针。对于你已经抓下来的 profile，[Trace forensics 作战手册](../../skills/poteto-mode/playbooks/trace-forensics.md)读这份产物，把热点帧映射回源码。两者都返回诊断，不是修复：

```text
/poteto-mode here's a cpuprofile from the slow startup. tell me where the time goes and which source lines own it. no fix yet.
```

## 先用 `/tdd` 写出失败的测试

当一个 bug 有便宜的本地测试路径时，整个提示词可以只有两个词：

```text
/tdd implement
```

放在上下文里，这就够了。[`/tdd`](../../skills/tdd/SKILL.md) 写出因为预期原因而失败的最小测试，然后写修复，然后重跑测试。如果测试需要大范围的测试框架搭建或者脆弱的 mock，这个技能会说出来，改用最接近的可执行检查。别在一条真实命令是更强证据的地方硬塞一个测试。

## 按名字加载 TypeScript 规则

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md) 把类型系统的原则变成具体规则：可辨识联合、边界上用 `unknown`、穷尽变体、从 schema 推导类型。它不会自己加载，所以当任务碰到 `.ts` 或 `.tsx` 文件时，敲 `/typescript-best-practices`。

## 提交前先清理

[Opening a PR 作战手册](../../skills/poteto-mode/playbooks/opening-a-pr.md)在每次提交前对 diff 跑 `/deslop`，并对 PR 描述和提交正文应用 [`/unslop`](../../skills/unslop/SKILL.md)。`/deslop` 随 `cursor-team-kit` 插件发布，不在 pstack 里。如果你没有它，就用大白话要同样的结果：删掉叙述性注释、没有依据的防御性检查、死掉的兼容路径，以及无关的改动。

对于文字，`/unslop` 接受一个目标和你有的任何额外规则：

```text
/unslop the readme changes, no emdashes
```

你会发展出自己的简写。这个技能能从 `unslop that, tighten it` 这种极简提示里读出意图。

## 用 `/no-comments` 剥掉注释

注释需要单独一遍，而且不能由写它的那个智能体来做。作者会为自己的注释辩护，就像你会为自己的辩护一样。所以在评审之前，把它们交给一双新眼睛：

```text
/no-comments the diff
```

[`/no-comments`](../../skills/no-comments/SKILL.md) 会启动 [Comment Sicko](../../agents/comment-sicko.md)，一个只读的评审者，带一份很短的保留清单：license 头、公共 API 上的文档注释、解释代码无法表达之事的链接、由你无法改变的外部依赖强加的行为。其余全部删掉。你自己代码里的意外不享受这种豁免。注释会作为重构标记返回，`/no-comments` 对它接受的标记在根因处修复。当一条注释声称某个约束，比如 "do not remove"，这个技能会提议把该主张编码成类型、测试或 lint。不管哪种方式，注释都会被拿掉。

这个分工值得记清楚。`/deslop` 清理代码里的 AI 腔，`/unslop` 清理文字里的 AI 腔，`/no-comments` 把注释交给一个没写过它们的评审者。

**坑：** 清理不是可选的润色。一个带着叙述性注释和防御性死重量的 diff，在评审者眼里就是没做完，而多出来的代码正是下一个 bug 藏身的地方。如果 diff 感觉被注水了，在提交前就说 `deslop it`，别等评审指出来再说。

下一步：[验证与交付](./06-verify-and-ship.md)。

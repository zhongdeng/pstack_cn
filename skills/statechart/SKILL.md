---
name: statechart
description: "检查一个系统在状态之间迁移的 TLA+ 模型，比如产品流程、协议或服务，并把它画成 Mermaid 状态图。报告给出到达每个违反规则的 state 的最短路径。用于 /statechart，或者把 bug 展示成一条穿过各个 state 的路径。"
disable-model-invocation: true
---

# Statechart

这张图用读它的人的话，展示系统如何在状态之间迁移。行为对不对，由这个人，也就是读者，来决定。

## 运行

在仓库外面的一个临时目录里干活。写一份 TLA+ spec 和它的 config。然后运行：

```sh
<skill dir>/scripts/statechart SPEC.tla [--config FILE] [--view FILE] [--out DIR]
```

`scripts/statechart.ts` 是 TypeScript，所以要用能执行 TypeScript 的运行时来跑它。

第一次运行会用 mise 安装 TLC 和 Java，需要联网。

## 写 spec

- 读者认可的每条规则都写成 INVARIANT。规则可以关于一个屏幕、一个结果、一个存储的值或一条消息。如果模型里没有对应某条规则的变量，就加上这个变量。绝不要为了让规则成立而削弱它。
- 把 `Next` 写成各个 action 的析取，比如 `YouPressPlay \/ YouPressStop`。不这么做的话，TLC 会把每一步都叫 `Next`。
- 没有出边的 state 会违反 `NoDeadlock`，即使它是一个正确的结束状态。当 INVARIANT 或 PROPERTY 已经用了这个名字时，规则叫 `CHECK_DEADLOCK`。往 `Next` 里加一个只在结束状态为真、什么都不改的 action，比如 `Done == phase \in {"paid", "failed"} /\ UNCHANGED vars`，并在 `step()` 里给它一个标签。

## 选图

需要判断的活由你来做：每个 state 和箭头上写什么字、阶段和它们的颜色、标题，以及给读者的报告。把你的工作放进一个 view 模块，用 `--view` 传进去。

为了显示读者的话，view 导出 `state(vars)`。`state()` 返回的值决定图的形态：

- 返回字符串得到一张平铺的图：`export const state = (v) => (v.paid ? "Paid" : "Paying");`
- 返回数组得到父状态：`export const state = (v) => v.main.split(".");`
- 返回对象时，每个 key 得到一个并行区域：`export const state = (v) => ({ Playback: v.playback, Volume: v.volume });`

给每个 state 起一个读者看得见或在意的标签，比如 "Paying" 或 "Lease held, write pending"。标签里不要出现变量名。在 `vars` 里，TLA+ 的序列是一个从 1 开始编号的对象，所以 `v.pc[1]` 就是 `pc[1]`。集合是数组。

view 还可以导出 `step(action, from, to)`。它拿到 TLC 的 action 名和这一步前后的值，返回箭头的标签。每一步的标签都按用户看到的样子来写，比如 "you press play" 或 "the connect fails"。不要写代码名或 TLA+ 的 action 名。在图上终点相同的两个 action 用同一个标签，这样它们共用一条箭头。

当某一步只在某些条件下才能发生时，在标签末尾用方括号写上条件，用读者的话，比如 `you press play [while the file loads]`。在 regions 图里，命令会把条件按其他区域标签的措辞写在箭头上，比如 `[when Offline]`。你的方括号会替换掉它，于是从同一个 state 出发的两条箭头可能看起来一样。所以在 regions 图里，不要为另一个区域上的条件写方括号。当某个标签没显示的取值决定了这一步走向哪里时，在标签里写出结果，比如 "the roster read fails"。

view 还可以导出这些：

- `group(vars)` 返回一个阶段的名称。图上的每个 state 拿到它所属 group 的颜色。当一个图上 state 背后的模型状态分属不同的 group 时，这个 state 没有颜色。
- `colors` 给每个 group 名称一个颜色类。
- `title` 是一个字符串，图会把它显示在顶部。

命令对每个模型状态最多调用一次 `state()` 和 `group()`，对每一步最多调用一次 `step()`。图和报告都用这些结果。所以让每个函数只依赖它的参数。

图不会画停留在同一个标签里的步骤。当读者必须看到这样的步骤时，就把标签拆开。

目标是大约 20 条箭头以内，因为图越密越难读。先让 `state()` 返回更粗的标签。行为相同的取值给同一个标签，读者不需要的细节就省掉，比如一个在途的调用，它的返回什么都不改变。bug 路径上的每个 state 都要保留，每个标记也都要保留。合并会把一个 `breaks` 的 state 变成 `mayBreak`，这就藏住了规则在哪里被违反。不要合并违反不同规则的两个 state，因为那样读者就看不出哪条规则在哪里被违反。如果图还是太密，就对读者不需要的步骤从 `step()` 返回 `null`，比如每个 state 都有的 reset，或者箭头重复了其他箭头已经展示的内容的步骤。隐藏步骤时遵守这些规则：

- 每个图上 state 都要能从某个起始 state 沿箭头到达。
- 模型里有出边的每个图上 state，至少保留一条出边。
- 一条箭头的步骤要么全藏，要么全不藏。只藏一部分，它的条件就变窄了。
- 在交接里说明图藏了哪些步骤。

## 读报告

- 在图上，违反规则的 state 带 `breaks` 类。当它背后的模型状态只有一部分违反规则时，它带 `mayBreak` 类。Legend 列出每个标记对应的规则。两条规则同时被违反时，它在一个标记上列出两条，所以在交接里要说明哪个 state 违反了哪条规则。在 regions 图里，当一个 state 参与的每种区域状态组合都可能违反规则时，它就带标记。当某个组合可能违反规则、而组合里没有任何 state 带标记时，组合里每个 state 都带标记。
- TLC 会越过违反规则的 state 继续走，所以图显示的是 bug 之后的状态。
- 因为 TLC 会越过 bug，状态数没有上限的模型可能跑不完。把常量取小，或者加一个 CONSTRAINT。
- 有 VIEW 或 SYMMETRY 时，TLC 把它视为相同的状态算作一个状态，图也只画这一个状态。箭头可能指向它，而不是这一步实际到达的状态，报告会说明这一点。
- TLC 会检查越过 CONSTRAINT 或 ACTION_CONSTRAINT 之后每个 state 里的规则，但不会探索那个 state，也不会对它做死锁检查。当 TLC 为某条规则找到的最短路径终止在这样的 state 里时，图画的就是这个 state，报告给出的也是这条路径。图不画越过边界的其他状态。这种 state 里的死锁不会显示出来。TLC 也会在 ACTION_CONSTRAINT 排除的每一步之后检查规则，即使它通过另一条路到达了下一个 state。当 TLC 为某条规则找到的最短路径以这样一步结束时，图会画出这一步。
- 命令按原样的 config 用 TLC 检查规则，单 worker。某条规则被违反时，命令去掉这条规则再跑一遍 TLC，直到没有规则被违反。第一次违反之后，每次运行在 100,000 个不同状态处停下，免得大模型跑不完。当某次运行到达这个上限或因错误停下时，报告在 "Rules not checked" 下列出没检查的规则，图也不给它们打标记。没检查的规则可能成立也可能被违反。要检查它，就把违反规则的规则从 config 里去掉，或者把模型改小。这个上限会加一个模块，改变 TLC 处理变量的顺序，所以对 property 来说，TLC 可能找到和没有上限时不同的反例。
- `tlc.out` 是按原样 config 运行时 TLC 打印的内容。当图没有显示某条被违反规则的 bug 路径时，`tlc-RULE.out` 是找到它的那次运行 TLC 打印的内容。当 TLC 重复它的第一条警告时，原版 TLC 会打印两次，但 `tlc.out` 只显示一次，因为 TLC 把第二份排除在命令读取的输出之外。这只在 Java 以 `-XX:+UseParallelGC` 运行时发生，否则 TLC 的第一条警告是它建议传这个 flag 的提示，那条只打印一次。

## 展示图

把 `chart.mmd` 以 `mermaid` 代码块展示给用户。图有 500 个 state 的预算，按原样 config 由 TLC 计数。超过之后，图只画通往被违反规则的路径，没有规则被违反时，命令不写 `chart.mmd`。它仍然检查每条规则，报告给出 state 数和每条 bug 路径。想看完整的图，就把模型改小。

用 Pele 渲染图。用户要图片，或者图太大没法当文本读时，按 `references/render.md` 做。除非用户要求，不要换别的渲染器。

## 交接

把每张图和它的 Mermaid 文本交给必须做决定的人。每个 bug 加一行：规则、读者对这条规则的那句话，以及报告编号的那条路径。说明模型省略了什么。给出重新生成文件的命令，用一个新的 `--out` 目录。

当模型描述的是代码时，把每条 bug 路径对着真实代码重放一遍，写成测试或现场复现，每个 action 一步。如果 bug 没有出现，就先认为模型是错的，直到你证明它不是。

# 验证结果并开 PR

“能编译”不算证据。[Prove It Works 原则](../../skills/principle-prove-it-works/SKILL.md)要求智能体在报告成功之前检查真实产物，而你的任务是让“真实产物”可以被检查。这一页讲的是：把完成条件说清楚、审查一个测出来的数字、为你的应用生成验证技能、对测试很少覆盖的性质做形式化验证、开 PR，然后一路推到合并。

验证是大多数智能体工作里最慢的一步，因为它通常是等人类的那一步。让智能体能自己做，你就不再是瓶颈。跳过它，多跑几个智能体只会给你带来更多没检查过的工作要审。

![一架原型飞机在真实的测试航道上飞行，她拿着秒表计时，机器人在拍摄并核对清单；终端上显示 verify: pass, evidence: captured。](./images/verification.jpg)

## 一开始就说清完成条件

把“完成”是什么意思写进第一个 prompt，用什么措辞都行：

```text
/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.
```

现在智能体有三个能跑的检查，而不是一种要去满足的心情。回复回来时，应该带着确切的命令和输出。如果某个检查跑不了，好的回复会说“inconclusive”。自信满满却没有证据的回复是个危险信号。

检查方式要跟改动匹配：

- CLI 改动就跑真实命令。
- UI 改动就在运行中的应用里走一遍改动的流程。当它必须和参考图逐像素一致时，[Visual parity 作战手册](../../skills/poteto-mode/playbooks/visual-parity.md)会把截图和冻结的基线做 diff，而不是靠眼睛判断。
- 解析器或迁移就重放一份保存下来的输入。
- 性能改动就对比改动前后的 profile。
- 存储改动就把写进去的值读回来。

要证据时，要一个你自己能检查的产物：先失败的测试再通过的测试、前后对比视频、trace、截图。如果修复已经合并了，就让它在 main 上再跑一遍同样的检查。产物胜过一套听起来合理的解释，因为你可以质疑产物，而不用把整次运行重放一遍。

对于你不太信任的小 diff，[`/blast-radius`](../../skills/blast-radius/SKILL.md)会找出它可能在别处弄坏什么。它会找出让这个改动安全的那一个事实，并通过跑代码来证明这个事实，而不是靠论证。

## 用 `/benchmark-checklist` 审查测出来的数字

改动前后的数字是最容易不小心搞错的证据。一边是热缓存、一边是 debug 构建，或者计时区间里根本没跑那段工作，每一种都能造出一个很有说服力的加速。在你报告或依据一个数字行动之前，输入：

```text
/benchmark-checklist vet the export speedup before it goes in the pr
```

[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)会问七个问题，每个都要求有来自一次运行的证据：

1. 什么限制了这个数字，为什么它不是两倍？
2. 每一侧是不是都按生产环境的方式调优后跑的？
3. 结果有没有突破物理极限，比如磁盘带宽或核数？
4. 有没有东西报错或返回了错误的输出？
5. 交替多次运行能复现吗，有没有中位数和范围？
6. 在端到端上、在用户真正等待的那条路径上，它有意义吗？
7. 那段工作真的发生在计时区间里吗？

结论会是 faster、slower、no measurable difference 或 inconclusive，附带运行次数、范围和限制因素。当它说不出限制因素，或者有一侧没调优就跑时，它会说 inconclusive。`/poteto-mode` 已经在 Perf issue 和 Hillclimb 作战手册里跑这个清单，所以你自己输入它，是在这些之外测了东西，或者别人的数字看着太好时。它是 [Explain the Number 原则](../../skills/principle-explain-the-number/SKILL.md)的可操作形式。

## 创建一个项目验证技能

上面 UI 那一条藏着一个真实需求。智能体需要一种脚本化的方式来驱动你的应用。如果你的项目有，那很好。如果没有，运行：

```text
/create-verification-skill
```

[`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md)访谈的是仓库，不是你。它搞清楚用户会碰到什么、应用在本地怎么启动、什么能驱动它（优先用已有的 harness，否则用浏览器和 CDP、PTY 或纯 HTTP）、什么证据能证明行为，以及两个实例能不能并排跑。它只问你代码回答不了的问题。

它会写出 `.cursor/skills/verify-<app>/`，面向智能体的说明，包含确切的 Launch、Doctor、Drive、Evidence 和 Cleanup 几节，一个 Helpers 节用来放它附带的任何脚本，再加一个 `features/` 下的功能地图，索引应用做什么、什么结果能证明每个功能可用。这个技能附带一个[功能地图完整示例](../../skills/create-verification-skill/references/feature-map-example/)，有一个 README 索引，每个功能一个文件，用四个必需的 H2。交付之前，生成器会把技能端到端证明一次：启动、doctor 检查、驱动一个功能、抓取证据、清理，然后确认证据在清理之后还在。如果这个证明失败，就别用它的输出。

从那以后，“在应用里验证一下”就是任何智能体都能执行的一步，在这个仓库里，不需要先聊一轮怎么设置。想要特定形式的证据时，就在 prompt 里点名它：

```text
/poteto-mode build the bulk-archive action. use /verify-<app> to verify your changes and show me a video and screenshots as proof.
```

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

验证技能一旦能用，一个 [`/swarm`](../../skills/swarm/SKILL.md)就能按功能地图的条目拆分一整轮验证并汇总结果。一群验证者也能在足够大的样本上确认一次性能提升，或者在 PR 发布前对应用做 fuzz 找回归。

把验证技能当基础设施，而不是一次性的东西。提交它，让团队里每个人、每个智能体都用同样的方式驱动应用。然后[造杠杆](../../skills/principle-build-the-lever/SKILL.md)。当智能体老是写一次性脚本来点应用时，就要一个小控制 CLI，让技能去调它。智能体花的 token 更少，每次运行也变得可重复。智能体用得好的 CLI 有这些特点：

- 少量可组合的命令，每个都干实事，而不是很多薄命令。
- 任何破坏性操作都有 `--dry-run` 选项。
- 子命令逐步揭示功能，而不是一次全给。
- 错误信息说明该怎么做。
- 丰富的 `--help` 文本。
- 机器可读的输出，比如 JSON。

顺手把开发环境也做成可重复的：种子数据、测试用户，以及一条每次都以同样方式把环境拉起来的命令。

## 让验证技能保持诚实

应用会变，功能地图会过时。至少每天跑一次，最好放在定时自动化里，这样没人需要记着：

```text
/maintain-verification-skill
```

[`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md)审计生成的技能：每个功能一个只读的源码读取器并行跑，然后一轮实时运行，驱动每一个映射到的功能。它最后只会落在三种结果之一。`clean` 表示覆盖完整、没有要提交的。`changed` 表示一个 PR 的已证实修正，只限于验证技能自己的目录。`blocked` 会点名阻塞项。它从不改产品代码。如果实时运行抓到产品回归，它会报告这个回归，而不是用改文档把它藏起来。

## 用形式化验证技能证明一个性质

验证技能证明的是你驱动的那些路径。有些 bug 活没人驱动的路径上：两次重试重叠、一个锁在写入中途过期、一个状态变更乱序到达。测试很少碰到这些情况。对于这种 bug 代价很高的代码，运行：

```text
/create-formal-verification-skill
```

[`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md)从代码里挑目标：代码做出的一个承诺，破坏它会伤害用户，而测试很少碰到破坏它的那种情况。它挑最强的目标，不是最好验证的。也可以点名一个区域或一个 bug 从那里开始：

```text
/create-formal-verification-skill the job lease and retry logic. a job must never run twice at once.
```

问题决定工具。事件会不会以坏顺序发生，适合对设计的小模型跑模型检查器，TLA+ 是任何语言里这类的默认选择。代码对每个输入是否都表现正确，适合一个跑在代码上的验证器。如果你的语言没有验证器能跑，智能体会说明，并用生成的输入测试真实代码，而不是手写一个函数的模型。一个必须在任何规模下都成立的性质可能需要一个证明。智能体会告诉你它选了哪个工具、为什么。

它验证一个性质，并展示这个性质在代码的一个坏变体上失败，因为你从没见过失败的检查什么都证明不了。当当前代码已经破坏了这个性质时，你会拿到反例，用你代码里的术语表示成一串简短的步骤。性质保持原样陈述，所以发现仍然是发现。除非你要求，产品代码不变。

它会写一个项目本地的技能，告诉下一个智能体：一个改动是否碰到被验证的代码、怎么用一条命令跑检查、怎么区分真 bug 和建模错误。交付之前，生成器会拿一个破坏该性质的临时改动把这个技能走一遍，检查必须抓到它。交接说明会讲验证了什么、用什么工具和边界、检查发现了什么、以及它不覆盖什么。一次通过覆盖的是模型或边界，不是整个系统。

这个技能还会记录每个检查覆盖哪些代码，以及检查最后一次和代码对上的 commit。跳过这个技能的合并和重构，可能让检查在一个已经不存在的代码的描述上继续通过。做完这些之后，运行 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)。它会根据代码更新验证、重跑、展示每个更新后的检查仍然能失败，并告诉你每个失败是验证的漂移还是代码里的 bug。
## 把行为画成状态图

用模型语言给出的反例能说服你。但拥有这个行为的 PM 或设计师，需要从他们的视角看到它。运行：

```text
/statechart what the user sees when they edit a note offline
```

[`/statechart`](../../skills/statechart/SKILL.md) 会画出一张 Mermaid 状态图，展示用户看到的东西，图由 TLA+ 模型生成，所以图和被检查的模型不会各走各的。读者定下的规则（“离线时你永远看不到 Synced”）会变成不变量。图会标出每一个违反规则的状​​态，报告则用读者的话给出到达该状态的最短路径。交付之前，智能体会在真实代码里复现每条 bug 路径，这样建模错误就不会被当成 bug 送到读者面前。

## 打开 PR

```text
/poteto-mode open the pr. small ordered commits, evidence in the description.
```

[Opening a PR 作战手册](../../skills/poteto-mode/playbooks/opening-a-pr.md) 在 worktree 里干活，把改动 rebase 成一组小而有序的提交，清理 diff，去掉文字里的 AI 腔，最后返回 PR 链接。五个窄 PR 胜过一个胖 PR，堆叠的后续 PR 胜过一条不断变长的分支。

## 用 Babysit 把 PR 推进到可合并

PR 一开就会开始攒阻塞项。检查失败、评审者评论、trunk 往前走了。把这些杂活交给 [Babysit 作战手册](../../skills/poteto-mode/playbooks/babysit.md)：

```text
/poteto-mode babysit this pr. get it green.
```

Babysit 会盯着这个 PR，在可用时用内置的 GitHub 或 Origin CLI watcher，并按顺序处理阻塞项：先冲突，再评审线程，最后 CI。所有已知修复会攒成一次 push，这样检查只重启一次，而不是每修一个就重启一次。评论分诊是带怀疑的，因为人和 bot 会在同一张列表里提交真问题和噪音。真问题给修复，噪音则驳回，并把反驳证据发在对应线程上。如果你只想要状态，就问得小一点，Babysit 会直接回答，不启动循环：

```text
/poteto-mode check on pr 123. anything outstanding?
```

Babysit 停在可合并这一步。它从不合并，哪怕全绿，因为合并是另一个决定。

## 用 Shipping 落地整个栈

绿了不等于安全。准备好落地时，说出来：

```text
/poteto-mode land the stack.
```

[Shipping 作战手册](../../skills/poteto-mode/playbooks/shipping.md) 会在动手之前独立验证每个 PR。每个 PR 配一个全新的智能体来实地证明行为，而评判一个改动的智能体永远不是写它的那个。然后 Shipping 只从底部开始落地连续通过验证的那一段，默认一次一个 PR 走 GitHub，Origin CLI 可用时走 Origin，并报告第一个断链的 PR。一个已验证的 PR 如果压在一个未验证的 PR 上面，就得等着，因为合并它会把下面的缺口一起拉进来。

下一步：[睡觉时也在干活](./07-overnight.md)。

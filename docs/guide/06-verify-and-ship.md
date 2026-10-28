# 验证结果并开一个 PR

“它能编译”不是证据。[证明它能工作原则](../../skills/principle-prove-it-works/SKILL.md)让 agent 在报告成功之前检查真实产物，而你的工作是让“真实产物”能够被核对。这一页涵盖：事先陈述完成条件，核验一个测到的数字，为你的应用生成一个验证 skill，对测试很少够到的性质做形式化验证，开 PR，以及把它推到已合并。

验证是大多数 agent 工作里最慢的一步，因为它通常是那步在等人的。让 agent 自己能做，你就不再是瓶颈。跳过它，多跑 agent 只会给你更多未经核对、等着评审的工作。

![一架原型飞机飞过真实的测试航线，她用秒表计时，机器人拍摄并为这次运行打勾；终端上显示 verify: pass, evidence: captured。](./images/verification.jpg)

## 事先陈述完成条件

在第一条提示词里写明做完意味着什么，用合适的话说：

```text
/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.
```

现在 agent 有三项它能跑的核对，而不是一种要去满足的心情。回复回来时，它应该带上确切的命令和输出。如果某项核对跑不了，一份好的回复会说 “inconclusive”。一份没有证据却很有把握的回复是危险信号。

让核对匹配改动：

- CLI 的改动跑真实命令。
- UI 的改动在正在运行的应用里走一遍改过的流程。当它必须和一个参照像素对像素地一致时，[视觉一致行动手册](../../skills/poteto-mode/playbooks/visual-parity.md)对照一份冻结的基线对截图做 diff，而不是凭眼睛判断。
- 解析器或迁移重放一份保存下来的输入。
- 性能改动比较改前和改后的性能分析。
- 存储改动把写进去的值读回来。

把证明要成一份你自己能检查的产物：先是失败的测试，然后是通过的那个，一段改前改后的视频，那份 trace，那张截图。如果修复已经合并，在 main 上再要一次同样的核对。一份产物胜过一套说得通的解释，因为你可以质疑它，而不必把整个运行重放一遍。

对于一份你并不完全信任的小 diff，[`/blast-radius`](../../skills/blast-radius/SKILL.md)找出它还可能在别处弄坏什么。它找出那个让改动变得安全的唯一事实，并靠运行代码证明那个事实，而不是靠为它辩护。

## 用 `/benchmark-checklist` 核验一个测到的数字

一个改前改后的数字，是最容易在无意中弄错的证据。热缓存、一侧是调试构建，或者计时区间里根本没跑到的工作，都可能各自制造出一次令人信服的加速。在你报告或依据一个数字行动之前，输入：

```text
/benchmark-checklist vet the export speedup before it goes in the pr
```

[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 问七个问题，并要每一次运行的证据：

1. 是什么限制了这个数字，为什么它不是两倍？
2. 每一侧是不是都按生产运行的方式调优后跑的？
3. 结果有没有打破物理上限，比如磁盘带宽或核数？
4. 有没有什么报错，或返回了错误的输出？
5. 它在交替运行上能否复现，带中位数和范围？
6. 它在端到端上要紧吗，在用户等待的那条路径上？
7. 这项工作是不是真的发生在计时区间里面？

结论回来时是更快、更慢、没有可测差异，或无结论，并带上运行次数、范围和限制因素。当它说不出限制因素，或某一侧未经调优就跑了，它会说无结论。`/poteto-mode` 已经在性能问题和爬山优化行动手册里运行这份清单，所以当你在它们之外测了什么，或者别人的数字好得不像真的时，你自己来输入它。它是[解释数字原则](../../skills/principle-explain-the-number/SKILL.md)的可操作形式。

## 创建一个项目验证 skill

上面那条 UI 要点藏着一个真正的要求。agent 需要一种脚本化的办法来驱动你的应用。如果你的项目有，很好。如果没有，运行：

```text
/create-verification-skill
```

[`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 访谈的是仓库，不是你。它弄清用户会碰什么，应用在本地如何启动，什么能驱动它（优先用现成的 harness，否则是浏览器和 CDP、一个 PTY，或纯 HTTP），什么证据能证明行为，以及两个实例能否并排运行。它只问你代码回答不了的事。

它写下 `.cursor/skills/verify-<app>/`，面向 agent 的说明，带有确切的 Launch、Doctor、Drive、Evidence 和 Cleanup 各节，一个 Helpers 节放它附带的任何脚本，外加 `features/` 下的一份功能地图，索引应用做什么，以及什么结果证明每个功能能工作。这个 skill 附带一份[做好的功能地图示例](../../skills/create-verification-skill/references/feature-map-example/)，有一份 README 索引，以及每个功能一个文件，使用四个必需的 H2。在交出来之前，生成器会把这个 skill 端到端证明一次：启动，doctor 检查，驱动一个功能，采集证据，清理，然后确认证据在清理之后还在。如果那次证明失败，就不要使用这份输出。

从此以后，“在应用里验证”是任何 agent 都能执行的一步，在这个仓库里，不需要安装对话。当你想要特定形式的证明时，在提示词里点名它：

```text
/poteto-mode build the bulk-archive action. use /verify-<app> to verify your changes and show me a video and screenshots as proof.
```

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

一旦 verify skill 能工作，一次 [`/swarm`](../../skills/swarm/SKILL.md) 可以按功能地图条目拆开一整轮，并汇总结果。一群验证者也可以在足够大的样本上确认一次性能胜出，或在 PR 交付之前对应用做模糊测试以寻找回归。

把验证 skill 当作基础设施，而不是一次性的东西。把它提交，这样团队里的每个人、每个 agent 都以同样的方式驱动应用。然后 [build the lever](../../skills/principle-build-the-lever/SKILL.md)。当 agent 不断写一次性脚本来点穿应用时，要求一个由这个 skill 调用的小型控制 CLI。agent 少花 token，每次运行都变得可重复。一个 agent 用得好的 CLI 有这些特质：

- 少数可组合的命令，每条都做真实的工作，而不是很多很薄的命令。
- 任何破坏性的东西上都有 `--dry-run` 选项。
- 子命令逐步揭示功能，而不是一次全部摊开。
- 错误信息说出该做什么。
- 丰富的 `--help` 文本。
- 机器可读的输出，例如 JSON。

既然在这里，也让开发环境的搭建可重复：种好的数据、测试用户，以及一条每次都以同样方式把环境拉起来的命令。

## 让验证 skill 保持诚实

应用会变，功能地图会过时。这个至少每天跑一次，最好来自一次定时自动化，这样就没有人必须记得：

```text
/maintain-verification-skill
```

[`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md) 审计生成出来的 skill：每个功能一个只读的源码阅读者，并行进行，然后一次实机走查，驱动每一个已映射的功能。它结束时恰好是三种结果之一。`clean` 表示覆盖完整，没有要交付的东西。`changed` 表示一个 PR 的已证实修正，限制在验证 skill 自己的目录里。`blocked` 点出阻塞者。它从不编辑产品代码。如果实机走查抓住一处产品回归，它报告这处回归，而不是用一次文档编辑把它藏起来。

## 用形式化验证 skill 证明一条性质

验证 skill 证明你驱动的那些路径。有些 bug 活在没有人驱动的路径上：两次重叠的重试，一把在写入中途过期的锁，一个乱序到达的状态变化。测试很少够到那些情形。对于这种 bug 代价很高的代码，运行：

```text
/create-formal-verification-skill
```

[`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 从代码里挑选目标：代码作出的一个承诺，打破它会伤害用户，而测试又很少够到那个会打破它的情形。它挑最强的目标，不是最好验证的那个。点名一个区域或一个 bug，就可以从那里开始：

```text
/create-formal-verification-skill the job lease and retry logic. a job must never run twice at once.
```

问题挑选工具。事件能否以一种坏的顺序发生，适合用模型检验器在设计的一个小模型上做，而 TLA+ 是任何语言里做这件事的默认。代码是否对每一个输入都表现如此，适合一个跑在代码上的验证器。如果没有验证器能跑在你的语言上，agent 会说出来，并用生成的输入测试真实代码，而不是这个函数的一份手写模型。一条必须在每一种规模上都成立的性质，可能需要一份证明。agent 会告诉你它选了哪个工具，以及为什么。

它验证一条性质，并展示这条性质在代码的一个损坏变体上失败，因为一个你从没见过它失败的检查什么也证明不了。当当前代码已经打破这条性质，你得到的反例是用你代码自己的术语写成的一短串步骤。性质保持原样陈述，所以发现仍然是发现。除非你要求，产品代码不会改变。

它写下一个项目本地的 skill，告诉下一个 agent 一处改动是否触及已验证的代码，如何用一条命令运行检查，以及如何区分真正的 bug 和建模错误。在交出来之前，生成器按那个 skill 在一处会打破这条性质的临时改动上走一遍，检查必须抓住它。交接说明验证了什么，用的哪个工具和哪些界限，检查发现了什么，以及它不覆盖什么。一次通过覆盖的是模型或界限，不是整个系统。

这个 skill 还记录每次检查覆盖哪些代码，以及检查上次与之匹配的那个 commit。跳过这个 skill 的合并和重构，可能让检查在一份已经不存在的代码描述上仍然通过。在它们之后，运行 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)。它根据代码更新验证，重新运行，展示每一个更新后的检查仍然能够失败，并告诉你每一次失败是验证侧的漂移，还是代码里的 bug。

## 把行为显示成状态图

一个用模型术语写成的反例能说服你。拥有这个行为的产品经理或设计师，需要用他们的术语看见它。运行：

```text
/statechart what the user sees when they edit a note offline
```

[`/statechart`](../../skills/statechart/SKILL.md) 画出一张用户所见的 Mermaid 状态图，从 TLA+ 模型生成，这样图和被检查的模型不会漂开。读者的规则（“你离线时绝不会看到 Synced”）变成不变量。图标出每一个打破规则的状态，报告用读者的话给出到达它的最短路径。在交接之前，agent 在真实代码里复现每一条 bug 路径，这样建模错误不会作为 bug 到达读者那里。

## 开 PR

```text
/poteto-mode open the pr. small ordered commits, evidence in the description.
```

[开 PR 行动手册](../../skills/poteto-mode/playbooks/opening-a-pr.md)从工作树开始做，把工作变基成小而有序的提交，清理 diff，去掉文字里的 AI 腔，并返回 PR 链接。五个窄 PR 胜过一个胖的，堆叠的后续胜过一条不断长大的分支。

## 用看护把 PR 推到可合并

一个打开的 PR 立刻开始积压阻塞项。检查失败，评审者评论，主干在移动。把这些折腾交给[看护行动手册](../../skills/poteto-mode/playbooks/babysit.md)：

```text
/poteto-mode babysit this pr. get it green.
```

看护盯着这个 PR，在 GitHub 上用附带的监视器，或者在 Origin CLI 可用时用它，并按顺序处理阻塞项：先是冲突，然后是评审线程，然后是 CI。每一个已知的修复都攒成一次 push，这样检查只重启一次，而不是每次修复之后都重启。评论分诊是持怀疑态度的，因为人和机器人会把真正抓到的问题和噪音放在同一个列表里。真正的发现会得到修复，噪音会被驳回，并把反证贴到线程上。当你只想要状态时，把问题问小一点，看护会回答，而不启动这个循环：

```text
/poteto-mode check on pr 123. anything outstanding?
```

看护停在可合并。它从不合并，哪怕一切全绿，因为合并是另一个决定。

## 用合入把栈落地

全绿和安全不是一回事。当你准备合入时，说出来：

```text
/poteto-mode land the stack.
```

[合入行动手册](../../skills/poteto-mode/playbooks/shipping.md)在准备合入任何东西之前，先独立验证每个 PR。每个 PR 由一个全新的 agent 现场证明行为，而且评判一处改动的 agent 绝不会是写下它的那个。然后合入行动手册只从底部合入连续的已验证部分，一次一个 PR，默认经 GitHub，Origin 的 CLI 可用时经 Origin，并报告打断这条链的第一个 PR。一个已验证的 PR 如果坐在一个未验证的 PR 上面，就等待，因为合并它会把下面的缺口一起拉进来。

下一篇：[在你睡觉时跑工作](./07-overnight.md)。

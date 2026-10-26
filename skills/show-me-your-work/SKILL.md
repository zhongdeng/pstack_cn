---
name: show-me-your-work
description: "为长时间运行或无人值守的工作保持一条可审查的决策轨迹：一份 TSV 日志，每个决定一行（是什么、为什么、证据、结果）。默认留在本地；当审查者需要这条轨迹才能信任结果时再提交。用于 /show-me-your-work、自主或多阶段运行，或人离开之后再来审查的工作。"
disable-model-invocation: true
---

# 把你的工作展示出来

保持一份唯一的规范日志。

## 格式

一个 TSV 文件，每个决定一行。单元格保持单行。证据是一个指针，不是散文。

复制 `references/decision-log-template.tsv`（表头行）来开始一份干净的日志。列：

- **ts.** ISO8601 时间戳。
- **phase.** 阶段或工作流。
- **decision.** 选择了什么或做了什么，一行。
- **why.** 用白话写的理由。如果是一条原则推动的，就平实地说出来，不要写成行话标签。
- **evidence.** 证明它的链接或路径：提交 SHA、PR 号、`file:line`，或一个产物、追踪或截图路径。绝不要写成一段话。
- **result.** 结果或谓词状态：`tests green`、`reverted`、`pixel-diff 0`、`INCONCLUSIVE`、`open`。

一个例子，说得明白，好让审查者一眼读完。

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first, about 100 components and roughly 75 hours	wanted to know the size before starting a long run	commit 3a9f1c2	found 5 things to sort out before starting
2026-05-24T09:40:00Z	harness	took screenshots of the old version before changing anything	so we can compare old against new and catch any visual change	scripts/snapshot.sh, baseline/	saved 120 reference screenshots
2026-05-24T11:15:00Z	widget	moved the widget styles over without changing how it looks	keep the change small and the result identical	commit 7c21e0a, pixel-diff 0	looks identical, tests pass
2026-05-24T12:30:00Z	widget	threw out a helper's work because its screenshots were blank	checked the real files instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

## 记一行

每一条都写成你会告诉队友你做了什么的样子。白话，具体的行动，不要 AI 腔或抽象行话（**unslop** 技能也适用于日志文字）。

使用辅助脚本 `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>`。它盖上 `ts`，第一次使用时写表头，剥掉 stray 的制表符/换行，并给任何以 `=`、`+`、`-` 或 `@` 开头的单元格加上一个单引号前缀。一个光秃的 `printf` 追加一行也可以，但如果单元格来自生成的或用户提供的文本，就要留意同样的这些字节。

记录决定点和检查点，而不是每一个行动：选定的一个分叉、完成并带有验证结果的一个单元、一次转向或回退及其触发原因、浮现的一个阻塞、修好的一道门禁。对循环运行，每次迭代一行。跳过琐碎的和自明的。

一次运行是一段代理对话，包括它后来的回合以及对它的任何总结。一次接手、一个替补代理，或一段新对话，都会开始一次新运行。当一次运行往一份已有行的日志里追加时，它的第一行阶段为 `start`，并且在另一次运行的 `start` 行之后的第一行也是如此。因此，一次运行在后面的回合回到一份日志时，先读日志的最后几行，看其间是否有另一次运行写过。一行 `start` 点明它之前、并非这次运行所写的那些行的 `ts` 范围，并且它的证据点明这次运行，例如它的代理 id。阶段 `start` 不作他用。

## 它放在哪里

默认情况下，日志是工作产物，不提交。把它放在工作目录的 `decisions.tsv`，或者当几项工作同时进行时放在 `.audit/<task-slug>.tsv`，并把它留在 git 之外。

只有当这项工作大到审查者需要这条轨迹才能信任结果时，才提交它。

## 规则

- 只追加。一个错误的决定用新的一行来取代它。绝不编辑或删除历史。
- 优先用已提交脚本产出的证据，而不是手写的一次性脚本（**encode-lessons-in-structure** 原则技能）。

## 对照对话记录审计日志

在运行结束时、交回之前，检查日志说的是不是真话。阅读活动工作区的 `agent-transcripts/` 目录下这次运行的对话记录（系统提示词点明了路径）。不要在 `~/.cursor/projects/*/` 上做 glob。那会读到无关的私人对话。把这次运行的各行与实际发生的事对照着走一遍。每一段都从这次运行的某一行 `start` 开始，或者如果这次运行创建了日志就从第一行开始，并结束于另一次运行的下一行 `start`：

- 检查每一行都对应一个真实的决定或行动。
- 检查每一行的证据都能解析，并显示该行所声称的内容。
- 一个塑造了这项工作、但没有记下来的分叉、转向或放弃的做法，就是一处缺口。把它补上。

纠正的是日志，不是故事。审计绝不编辑或删除一行，即使是编造的一行。当一行既没有记录真实决定也没有记录真实行动，或者它的声称或证据是错的，就追加一行来取代它，写上实际发生的事和一个能够解析的指针。这次审计不检查这次运行的各段之外的行。如果这次运行自己的工作表明其中某一行是错的，就像任何错误决定一样取代它。

## 对轨迹做跨模型审查

在交回之前，在一个与做这项工作的模型不同家族的模型上启动一个子代理。自我审查不能代替。子代理阅读审计轨迹和这次运行的对话记录，然后标出用户应该注意的地方。不是把工作重做一遍，而是扫一遍什么是次优的或有风险的。按 **poteto-mode** 技能的 Subagents 一节，为这项工作选择每个子代理的推理级别以及快速或标准速度。

- 证据薄弱或缺失的已记录决定。
- 被跳过的验证步骤，或在对话记录里没有证明就声称做过的。
- 事后看来有风险的选择（过早、范围蔓延、用表面办法盖住症状）。
- 用户随便扫一眼就会错过的缺口。

凡是产出了轨迹的运行，每一条回复都以 "Attention" 一节结束。先把审查者的模型单独放一行（`reviewed by <model>`），然后列出每一条标记，指向具体的行或时刻。「无标记」是一个有效取值。模型名称不是。

## 审查轨迹

从上往下读，顺着证据指针，抽查。GitHub 会把已提交的 TSV 渲染成表格。`column -s$'\t' -t decisions.tsv` 在终端里把它渲染出来。

## 组合本技能

其他技能把它们的审计轨迹路由到这里，而不是另起一份。用名字引用它，并让它拥有这个格式。不要把列再陈述一遍。

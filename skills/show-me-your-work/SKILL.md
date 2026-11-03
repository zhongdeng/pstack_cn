---
name: show-me-your-work
description: "为长时间运行或无人值守的工作保留一条可供审查的决策记录：一个 TSV 日志，每个决策一行（做了什么、为什么、证据、结果）。默认只在本地；当审查者需要这条记录才能信任结果时再提交。用于 /show-me-your-work、自主运行或多阶段运行，或者人离开一段时间后回来审查的工作。"
disable-model-invocation: true
---

# 把你的工作亮出来

只维护一份标准日志。

## 格式

一个 TSV 文件，每个决策一行。单元格保持单行。证据是一个指针，不是一段话。

复制 `references/decision-log-template.tsv`（表头那一行）来开始一份干净的日志。列：

- **ts.** ISO8601 时间戳。
- **phase.** 阶段或工作流。
- **decision.** 选了什么或做了什么，一行。
- **why.** 用大白话说原因。如果是某条原则驱动的，就直说，别写成术语标签。
- **evidence.** 能证明它的链接或路径：commit SHA、PR 编号、`file:line`，或者某个产物、trace、截图的路径。绝不要写一段话。
- **result.** 结果或谓词状态：`tests green`、`reverted`、`pixel-diff 0`、`INCONCLUSIVE`、`open`。

一个例子，说得直白，让审查者一眼就能读明白。

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first, about 100 components and roughly 75 hours	wanted to know the size before starting a long run	commit 3a9f1c2	found 5 things to sort out before starting
2026-05-24T09:40:00Z	harness	took screenshots of the old version before changing anything	so we can compare old against new and catch any visual change	scripts/snapshot.sh, baseline/	saved 120 reference screenshots
2026-05-24T11:15:00Z	widget	moved the widget styles over without changing how it looks	keep the change small and the result identical	commit 7c21e0a, pixel-diff 0	looks identical, tests pass
2026-05-24T12:30:00Z	widget	threw out a helper's work because its screenshots were blank	checked the real files instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

## 记录一行

每条记录都像你跟同事讲你做了什么那样写。大白话，具体动作，不要 AI 腔，也不要抽象术语（**unslop** 技能同样适用于日志文本）。

用辅助脚本 `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>`。它会打上 `ts`，第一次使用时写入表头，去掉多余的制表符和换行，并给任何以 `=`, `+`, `-` 或 `@` 开头的单元格前面加一个单引号。直接用 `printf` 追加一行也行，但如果单元格内容来自生成文本或用户提供的文本，同样要注意这几个字节。

记录决策点和检查点，不是每个动作：选定的一个分叉、完成的一个单元及其验证结果、一次转向或回滚及其触发原因、暴露出来的一个阻塞、修好的一个门禁。循环运行时，每次迭代一行。琐碎和显而易见的事跳过。

一次运行是一次智能体对话，包括它后面的轮次和它的任何总结。一次接手、一个替换的智能体，或者一个新开的聊天，都算一次新的运行。当一次运行往一个已经有行的日志里追加时，它的第一行 phase 是 `start`，它在另一次运行的 `start` 行之后的第一行也是。所以一次运行如果在后面的轮次回到某个日志，要先读日志最后几行，看看这期间有没有别的运行写过。`start` 行要写明它之前那些不是这次运行写的行的 `ts` 范围，它的证据要指明这次运行，比如它的 agent id。phase `start` 不用于其他任何情况。

## 放在哪里

默认情况下日志是工作产物，不提交。放在工作目录下的 `decisions.tsv`，或者同时有多个任务在跑时放在 `.audit/<task-slug>.tsv`，并且不要纳入 git。

只有当工作足够大，审查者需要这条记录才能信任结果时，才提交它。

## 规则

- 只追加。一个错误的判断用新的一行取代它。绝不编辑或删除历史。
- 优先使用由已提交脚本产生的证据，而不是手工做的一次性东西（**encode-lessons-in-structure** 原则技能）。

## 对照对话记录审计日志

运行结束时，在交回之前，检查日志说的是不是实话。读当前工作区 `agent-transcripts/` 目录下这次运行的对话记录（系统提示里会给出路径）。不要用 glob 扫 `~/.cursor/projects/*/`。那会读到无关的私人聊天。把这次运行的每一行和实际发生的事对一遍。这些行每一段都从这次运行的某个 `start` 行开始，或者如果日志是这次运行创建的，就从第一行开始，到另一次运行的下一个 `start` 行为止：

- 检查每一行是否对应一个真实的决策或动作。
- 检查每一行的证据是否能解析，并且确实显示了这一行声称的内容。
- 一个塑造了工作但没被记录的分叉、转向或放弃的方案，就是一个缺口。补上它。

改日志，不改故事。审计绝不编辑或删除任何一行，哪怕是编造出来的行。当一行既没记录真实决策也没记录真实动作，或者它的说法或证据是错的，就加一行取代它，写上实际发生的事和一个能解析的指针。这次审计不检查这次运行各段之外的行。如果这次运行自己的工作表明其中某一行是错的，就像对待任何错误判断一样取代它。

## 对记录做跨模型审查

在交回之前，在一个与做这项工作的模型不同的模型家族上派一个子智能体。自我审查不能替代它。子智能体读审计记录和这次运行的对话记录，然后标出用户应该注意的地方。不是重做工作，而是扫一遍哪里不够好或有风险。按 **poteto-mode** 技能的 Subagents 一节，为每个子智能体挑选适合这项工作的推理级别和 fast 或 standard 速度。

- 证据薄弱或缺失的决策记录。
- 跳过的验证步骤，或者对话记录里没有证据支撑的声称。
- 事后看有风险的选择（过早、范围蔓延、掩盖症状）。
- 用户随手扫一眼就会漏掉的缺口。

一次运行如果产出了记录，它的每条回复都以一个 "Attention" 部分结尾。先单独一行写审查者的模型（`reviewed by <model>`），然后列出每个标记，指向具体的行或时刻。"No flags" 是合法的值。模型名不是。

## 审查记录

从上往下读，顺着证据指针走，抽查。GitHub 会把提交的 TSV 渲染成表格。`column -s$'\t' -t decisions.tsv` 可以在终端里渲染它。

## 组合这个技能

其他技能把它们的审计记录交给这里，而不是自己另造一套。按名字引用它，让格式由它来管。不要重复列的定义。

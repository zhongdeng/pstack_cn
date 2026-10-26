---
name: reflect
description: 在活动的对话记录上启动三个并行的审查子代理，浮出学习，并把每一条路由成对现有技能的一处具体编辑。当用户说 reflect 时使用。
disable-model-invocation: true
---

# 反思

从当前对话里挖掘持久的学习，然后把它们路由成技能编辑。

当用户说「reflect」或「/reflect」时调用。当对话琐碎、离题，或已经被父代理正确遵循的一项现有技能覆盖时，就跳过。一次性的事不是学习。

## 1. 定位活动的对话记录

在扇出之前，在系统提示词所点名的 `agent-transcripts/` 目录里找到这次对话的记录。不要在 `~/.cursor/projects/*/` 上做 glob。那会越过工作区边界，并读到无关项目的私人对话。

```bash
ls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10
```

这覆盖了旧的扁平布局（`<id>.jsonl`）、当前的嵌套布局（`<id>/<id>.jsonl`）和子代理布局（`<parent>/subagents/<child>.jsonl`）。对每个候选，读第一行 JSONL。取那个 `message.content[0].text` 包含这次对话开场用户提示词的文件。如果没有匹配的，就改为传一份紧凑的会话摘要。

## 2. 并行启动三个审查者

一条消息，三次 `Task` 调用，`subagent_type: generalPurpose`，代理模式（`readonly: false`）。审查者需要 MCP 访问，以便查找对话记录所引用的工单、聊天线程和可观测性追踪，而只读会剥掉 MCP。

每个审查者和综合者都在 `pstack-models.mdc` 规则里点名一行角色，以及一个默认值。把 `model` 设为那一行的值；如果规则或那一行缺失，就设为默认值。当值为 `auto` 或 `inherit-parent` 时，不要设置 `model`。如果 Task 工具拒绝一个 slug，就用默认值并说明。如果它拒绝默认值，就用它的错误信息里同一家族中最接近的有效 slug。按 **poteto-mode** 技能的 Subagents 一节，为这项工作选择每个子代理的推理级别以及快速或标准速度。

| 视角 | 角色行 | 默认 `model` | 提示词模板 |
|---|---|---|---|
| 判断 | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/judgment-reviewer.md` |
| 工具 | `reflect tooling` | `grok-4.7-xhigh-fast` | `references/tooling-reviewer.md` |
| 发散 | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/divergent-reviewer.md` |

逐字传入每个模板，在标出的地方替换对话记录路径或摘要。审查者在 `Task` 响应正文里返回发现。

## 3. 综合

一次 `Task` 调用，`subagent_type: generalPurpose`，`model` 来自 `reflect judgment, divergent, synthesizer` 那一行（默认 `claude-opus-5-5-xhigh`），代理模式（`readonly: false`）。它通过 MCP 抽查引用，而只读会剥掉 MCP。逐字传入 `references/synthesizer.md`，在标出的地方内联每个审查者的完整输出。它返回一份已接受 / 已拒绝 / 待办列表。

## 4. 结构强制检查

把任何由 lint 规则、脚本、元数据标志或运行时检查能够更可靠地强制执行的已接受项，移到待办。见 **encode-lessons-in-structure** 原则技能。

## 5. 应用

展示综合者的完整已接受 / 已拒绝 / 待办输出，并在应用任何已接受编辑之前等待明确批准。用户挑选子集，也可以改路由。技能变更会影响组织里以后的每一个代理。不要自动应用。

不等待，就把每个待办项归档到你的团队的 devex 或待办跟踪器。只有已接受列表等待批准。

绝不编辑 `plugins/cache/` 下的技能。在批准之前，展示它的目的地，`.cursor/skills/<skill>/` 或 `~/.cursor/skills/<skill>/`。批准之后，把技能文件夹复制到那里，并编辑副本。绝不要开 PR 或推送。

严格遵循每一个已批准行的路由：

- 琐碎的现有技能编辑（一条一行的要点、收紧的一句话、纠正的一个过时事实）：由父代理直接做。
- 实质性的现有技能编辑（新的一节、新的模式表、超过大约 10 行）：交给 Cursor 内置的 `create-skill` 技能，并运行它的起草 / 测试 / 迭代循环。
- `tune description: <skill path>`（技能存在，但在本该触发时没有触发）：交给 `create-skill`，并运行它的描述优化循环。
- `new skill via create-skill: <kebab-name>`：把创建交给 `create-skill`。不要即兴发明形状。

如果你的环境带有 SKILL.md 校验器，就在宣布完成之前对每一个碰过的技能运行它。

## 6. 向用户总结

短列表，不要开场白：

- 已应用的编辑：`<skill path>`。改了什么，每项一行。
- 新建的技能：`<skill path>`。每项一行（少见）。
- 已归档到 devex 跟踪器的待办：`<issue title>`（`<tags>`）。每项一行。
- 丢弃的：每条被拒绝的发现一行 + 来自综合者的原因。

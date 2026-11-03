---
name: reflect
description: 针对当前对话记录并行启动三个评审子智能体，把可复用的经验挖出来，并把每一条落到某个已有技能上的具体修改。用户说 reflect 时使用。
disable-model-invocation: true
---

# Reflect

从当前对话里挖出能长期复用的经验，再把它们落到技能修改上。

用户说 "reflect" 或 "/reflect" 时调用。对话很琐碎、跑题，或者已经被某个父智能体正确遵循的现有技能覆盖时，跳过。一次性的东西不算经验。

## 1. 定位当前对话记录

在展开之前，先在系统提示指定的 `agent-transcripts/` 目录里找到本次对话的记录。不要对 `~/.cursor/projects/*/` 做 glob。那会跨工作区边界，读到无关项目的私密聊天。

```bash
ls -t <agent-transcripts>/*.jsonl <agent-transcripts>/*/*.jsonl <agent-transcripts>/*/subagents/*.jsonl 2>/dev/null | head -10
```

这一条覆盖了旧的扁平布局（`<id>.jsonl`）、当前的嵌套布局（`<id>/<id>.jsonl`）和子智能体布局（`<parent>/subagents/<child>.jsonl`）。对每个候选文件，读第一行 JSONL。取那个 `message.content[0].text` 里包含本次对话开头用户提示的文件。如果一个都对不上，就改为传一份精简的会话摘要。

## 2. 并行启动三个评审者

一条消息，三个 `Task` 调用，`subagent_type: generalPurpose`，智能体模式（`readonly: false`）。评审者需要 MCP 访问权限，去查对话记录里提到的工单、聊天线程和可观测性 trace，而 readonly 会把 MCP 剥掉。

每个评审者和综合者都要在 `pstack-models.mdc` 规则里找到自己那一行角色，以及一个默认值。把 `model` 设成那一行的值；规则或那一行缺失时，设成默认值。值为 `auto` 或 `inherit-parent` 时，不要设 `model`。如果 Task 工具拒绝某个 slug，就用默认值，并说明这一点。如果它连默认值也拒绝，就从它的报错信息里取同系列最接近的合法 slug。按 **poteto-mode** 技能的 Subagents 一节，为每个子智能体挑选推理档位和 fast 或 standard 速度。

| 视角 | 角色行 | 默认 `model` | 提示词模板 |
|---|---|---|---|
| 判断 | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/judgment-reviewer.md` |
| 工具 | `reflect tooling` | `grok-4.7-xhigh-fast` | `references/tooling-reviewer.md` |
| 发散 | `reflect judgment, divergent, synthesizer` | `claude-opus-5-5-xhigh` | `references/divergent-reviewer.md` |

每个模板原样传入，在标记处替换成对话记录路径或摘要。评审者把发现写在 `Task` 响应的正文里返回。

## 3. 综合

一次 `Task` 调用，`subagent_type: generalPurpose`，`model` 取自 `reflect judgment, divergent, synthesizer` 那一行（默认 `claude-opus-5-5-xhigh`），智能体模式（`readonly: false`）。它要通过 MCP 抽查引用，而 readonly 会把 MCP 剥掉。把 `references/synthesizer.md` 原样传入，在标记处内联每个评审者的完整输出。它返回一份 Accepted / Rejected / Backlog 列表。

## 4. 结构性约束检查

任何 Accepted 项，如果 lint 规则、脚本、元数据标记或运行时检查能更可靠地约束住，就移到 Backlog。见 **encode-lessons-in-structure** 原则技能。

## 5. 应用

把综合者完整的 Accepted / Rejected / Backlog 输出呈现出来，等用户明确批准后再应用任何 Accepted 修改。用户挑选子集，也可能改变路由。技能改动会影响组织里每一个未来的智能体。不要自动应用。

每个 Backlog 项直接提交到你团队的 devex 或 backlog 跟踪器，不用等。只有 Accepted 列表需要等批准。

绝不要编辑 `plugins/cache/` 下的技能。批准之前，先展示它的目标位置：`.cursor/skills/<skill>/` 或 `~/.cursor/skills/<skill>/`。批准之后，把技能文件夹复制到那里，再编辑副本。绝不要开 PR 或 push。

严格按每个已批准行的 Routing 执行：

- 已有技能的琐碎修改（一行 bullet、一句收紧的话、纠正一个过时事实）：父智能体直接做。
- 已有技能的实质性修改（新的一节、新的模式表、超过约 10 行）：交给 Cursor 内置的 `create-skill` 技能，跑它的 draft / test / iterate 循环。
- `tune description: <skill path>`（技能存在，但该触发时没触发）：交给 `create-skill`，跑它的 description 优化循环。
- `new skill via create-skill: <kebab-name>`：把创建交给 `create-skill`。不要临时自己发明形态。

如果你的环境自带 SKILL.md 校验器，在宣布完成之前对每个动过的技能都跑一遍。

## 6. 向用户总结

简短列表，不要开场白：

- 已应用的修改：`<skill path>`。改了什么，每条一行。
- 新建的技能：`<skill path>`。每条一行（少见）。
- 已提交到 devex 跟踪器的 Backlog：`<issue title>`（`<tags>`）。每条一行。
- 丢弃：每条被拒的发现一行，加上综合者给出的原因。

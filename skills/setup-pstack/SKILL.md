---
name: setup-pstack
description: 配置 pstack 每个角色用哪个模型、用多少推理预算。检测你可用的模型，写一条始终生效的规则，覆盖技能默认值。用于 /setup-pstack、"配置 pstack 模型"、"pstack 预算"，或修改 pstack 的模型选择。
---

# 配置 pstack

写 `~/.cursor/rules/pstack-models.mdc`，一条始终生效的规则，按角色设定 pstack 的模型。

## 步骤

### 1. 检测可用模型

列出你在这个会话里能传给 `Task` 子智能体的模型 slug。这是最可靠的来源。如果 Cursor 还提供 models API 或 CLI 能列出用户有权限的模型，优先用它，以便更完整。如果一个都检测不到，请用户粘贴他有权限的 slug。绝不要写一个你没确认可用的真实 slug。别名 `inherit-parent` 和 `auto` 始终有效，即使它们不是检测出来的 slug。

### 2. 读取当前状态

默认的角色到模型映射就是下面第 5 步展示的规则形状。如果 `~/.cursor/rules/pstack-models.mdc` 已存在，读它，把它的 `# budget` 行和各角色值当作当前选择。否则从这些默认值开始。角色不在第 5 步里的行，比如 `how critics`，来自已退役的角色。删掉它。

### 3. 预算、映射、确认

**(a) 询问预算。** 优先用 AskQuestion，而不是自由文本。给出这四个选项，标签用下面这些原文，如果规则里记录了当前预算就一并说明。没有规则时，说明 `large` 与技能默认值一致。

- `unlimited — max reasoning`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) 应用它。** 从技能默认值构建工作表，重跑时保留你按家族、列表或别名（`inherit-parent`、`auto`）改过的角色。`unlimited`、`large`、`medium`、`small` 把每个真实 slug（包括面板条目）的 effort token 设为 `max`、`xhigh`、`high` 或 `medium`。effort token 是阶梯 `max` > `xhigh` > `high` > `medium` > `low` 上的最后一个 token，或者末尾带 `fast` 时它前面的那个。如果结果不是检测到的 slug，就用同家族里检测到的、effort 不高于目标且最高的 slug，否则把该角色标记为需要选择。`inherit-parent` 和 `auto` 不变。所以 `unlimited` 会把 `claude-opus-5-5-xhigh` 变成 `claude-opus-5-5-max`。Grok 的 slug 最高到 `xhigh`，所以在 `unlimited` 下回退会把 Grok 放在 `xhigh`，`grok-4.7-xhigh-fast` 保持原样。`large` 保留这两个默认值。`small` 把它们变成 `claude-opus-5-5-medium` 和 `grok-4.7-medium-fast`。

**(c) 展示角色并确认。** 展示每个角色及其模型，把不在检测集合里的真实 slug 标记为需要选择。同时列出第 2 步删掉的每一行。询问是原样接受还是修改特定角色，选项给出检测到的模型加上 `inherit-parent` 和 `auto`（两者都表示：这个角色跑在父对话模型上，Auto 用户就是这样留在 Auto 上的）。优先用 AskQuestion，而不是自由文本。面板角色（arena runners、architect runners、interrogate reviewers）的值是列表，每个条目跑一个子智能体，别名条目也算，所以列表长度决定数量。`arena cross-judge pool` 也是列表，但 Arena 只跑一个裁判。它只尝试与父模型不同家族的取值，按列表顺序，所以按偏好排序。`inherit-parent` 或 `auto` 值永远不会当裁判。`swarm workers` 是每个 worker 的默认模型，除非某次 race 或 comparison 给每个 arm 另指定了模型。

### 4. 校验

写下的每个真实 slug 都必须在检测集合里。`inherit-parent` 和 `auto` 始终通过。如果选中的真实 slug 不可用，停下来重新询问。

### 5. 写规则

写 `~/.cursor/rules/pstack-models.mdc`，带 `alwaysApply: true`、一行 `# budget` 写明所选标签及其目标 effort，每个角色一行，标签与 poteto-mode 用的一致。整份文件覆盖写，这样重跑保持幂等。形状：

```
---
description: pstack per-role model choices (overrides skill defaults)
alwaysApply: true
---
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit Task `model`). Alias entries in a panel list still count toward its fan-out.
# budget: large (xhigh)
feature, refactoring: grok-4.7-xhigh-fast
bug-fix: grok-4.7-xhigh-fast
perf-issue: grok-4.7-xhigh-fast
hillclimb: grok-4.7-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh
hardest tasks: claude-opus-5-5-xhigh
how explorer: grok-4.7-xhigh-fast
how explainer: claude-opus-5-5-xhigh
why investigators: grok-4.7-xhigh-fast
why synthesizer: claude-opus-5-5-xhigh
reflect tooling: grok-4.7-xhigh-fast
reflect judgment, divergent, synthesizer: claude-opus-5-5-xhigh
arena runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
arena cross-judge pool: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
swarm workers: grok-4.7-xhigh-fast
architect runners: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
interrogate reviewers: claude-opus-5-5-xhigh, grok-4.7-xhigh-fast
```

### 6. 确认

告诉用户规则已写好，对新会话生效。重跑这个技能会更新它。

### 7. 提供验证技能（可选）

检查项目有没有办法驱动真实应用来取证（一个 `verify-*` 技能，或已有的 harness）。如果没有，只提议一次："想要一个项目本地的验证技能，让智能体能像用户那样驱动应用、证明改动有效吗？我可以用 /create-verification-skill 生成一个。" 同意就调用 `/create-verification-skill`（在 pstack 安装的位置都能解析：workspace、user 或 plugin）。不同意就继续，不要反复推。

### 8. 提供形式化验证技能（可选）

检查项目是否已有形式化验证技能（一个项目技能，对代码跑模型检查器、证明或其他验证器）。如果没有，只提议一次："想要一个形式化验证技能，让智能体能证明你代码的某个关键性质在范围内所有情况下都成立，而不只是测试覆盖到的情况吗？我可以用 /create-formal-verification-skill 生成一个。" 同意就调用 `/create-formal-verification-skill`（在 pstack 安装的位置都能解析：workspace、user 或 plugin）。不同意就继续，不要反复推。

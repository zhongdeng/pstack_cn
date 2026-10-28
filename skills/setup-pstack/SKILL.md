---
name: setup-pstack
description: 配置 pstack 按角色使用哪些模型，以及用多大的推理预算。检测你可用的模型，并写入一条始终应用的规则，覆盖技能默认值。用于 /setup-pstack、「配置 pstack 模型」、「pstack 预算」，或更改 pstack 的模型选择。
---

# 配置 pstack

写 `~/.cursor/rules/pstack-models.mdc`，一条始终应用的规则，按角色设置 pstack 的模型。

## 步骤

### 1. 检测可用模型

枚举你在这次会话里可以传给 `Task` 子代理的模型 slug。那是可靠的来源。如果 Cursor 还暴露了一个列出用户有权使用的模型的模型 API 或 CLI，为了完整起见优先用它。如果一个都检测不到，就请用户粘贴他们有权使用的 slug。绝不要写入一个你还没确认可用的真实 slug。别名 `inherit-parent` 和 `auto` 始终有效，即使它们不是检测出来的 slug。

### 2. 加载当前状态

默认的角色到模型映射就是下面第 5 步所示的规则形状。如果 `~/.cursor/rules/pstack-models.mdc` 已经存在，就读它，并把它的 `# budget` 行和它的角色值当作当前选择。否则从那些默认值开始。一行的角色不在第 5 步里，例如 `how critics`，就是来自已退役的角色。丢掉它。

### 3. 预算、映射和确认

**(a) 询问预算。** 优先用 AskQuestion，而不是自由文本。提供这四个选项，标签必须一字不差，并且当规则记录了当前预算时点明它。没有规则时，说明 `large` 与技能默认值一致。

- `unlimited — max reasoning`
- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) 应用它。** 从技能默认值建立工作表，并且在重新运行时保留任何你按家族、列表或别名（`inherit-parent`、`auto`）改过的角色。`unlimited`、`large`、`medium` 和 `small` 把每一个真实 slug 的力度 token，包括评审组条目，设为 `max`、`xhigh`、`high` 或 `medium`。力度 token 是最后一个 token，或尾部 `fast` 之前的那一个，位于阶梯 `max` > `xhigh` > `high` > `medium` > `low` 上。如果结果不是一个检测出来的 slug，就用同一家族里力度不高于目标、且力度最高的那个检测出来的 slug，否则把该角色标为需要选择。`inherit-parent` 和 `auto` 不变。因此 `unlimited` 把 `claude-opus-5-5-xhigh` 变成 `claude-opus-5-5-max`。Grok 的 slug 最高到 `xhigh`，所以在 `unlimited` 下，回退把 Grok 放在 `xhigh`，并保持 `grok-4.7-xhigh-fast` 原样。`large` 保持两者的默认值。`small` 把它们变成 `claude-opus-5-5-medium` 和 `grok-4.7-medium-fast`。

**(c) 展示角色并确认。** 展示每一个角色及其模型，把任何不在检测集合里的真实 slug 标为需要选择。也列出第 2 步丢掉的每一行。询问是按原样接受，还是更改特定角色，选项为检测出来的模型加上 `inherit-parent` 和 `auto`（两者的意思都是：这个角色跑在父对话的模型上，这就是 Auto 用户保持在 Auto 上的方式）。优先用 AskQuestion，而不是自由文本。对于评审组角色（arena runners、architect runners、interrogate reviewers），值是一个列表，每个条目跑一个子代理，别名条目也算，所以列表长度决定数量。`arena cross-judge pool` 也是一个列表，但 Arena 只跑一个评判者。它按列表顺序只试与父模型不同家族的值，所以按偏好排好顺序。`inherit-parent` 或 `auto` 的值从不评判。`swarm workers` 是每个工作单元的默认模型，除非一场竞赛或比较为每一臂指定了另一个模型。

### 4. 校验

写入的每一个真实 slug 都必须在检测集合里。`inherit-parent` 和 `auto` 始终通过。如果选中的真实 slug 不可用，就停下并再问一次。

### 5. 写规则

写 `~/.cursor/rules/pstack-models.mdc`，带上 `alwaysApply: true`、一行 `# budget`（含所选标签及其目标力度），以及每个角色一行，使用与 poteto-mode 相同的标签。覆盖整个文件，这样重复运行保持幂等。形状：

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

告诉用户规则已经写好，并且它应用于新会话。重新运行本技能会更新它。

### 7. 提供验证技能（可选）

检查项目是否有办法驱动真实应用来取证（一项 `verify-*` 技能，或一份已有的测试夹具）。如果没有，就提供一次：「想要一项项目本地的验证技能，这样代理可以像用户那样驱动应用，并证明变更有效吗？我可以用 /create-verification-skill 生成一个。」若是，调用 `/create-verification-skill`（解析到 pstack 的安装位置：工作区、用户或插件）。若否，继续往下，不要再推。

### 8. 提供形式化验证技能（可选）

检查项目是否已经有一项形式化验证技能（一项项目技能，针对代码运行模型检查器、一份证明或其他验证器）。如果没有，就提供一次：「想要一项形式化验证技能，这样代理可以证明你代码的一条关键性质在范围内的每一种情况下都成立，而不只是测试达到的那些情况吗？我可以用 /create-formal-verification-skill 生成一个。」若是，调用 `/create-formal-verification-skill`（解析到 pstack 的安装位置：工作区、用户或插件）。若否，继续往下，不要再推。

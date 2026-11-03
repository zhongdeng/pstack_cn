# 配置 pstack

本页中你会安装插件、选择 pstack 使用哪些模型，并跑通第一个任务。配置只需一条命令，外加一段简短的对话。

## 安装插件

在 Cursor 聊天里运行：

```text
/add-plugin pstack
```

Cursor 会确认插件已安装。

在 Claude Code 里，先运行 `/plugin marketplace add cursor/plugins`，再运行 `/plugin install pstack@cursor-plugins`。Claude Code 会给插件命令加前缀，所以本指南里的每条命令在那里都要加 `pstack:` 前缀，例如 `/pstack:setup-pstack`，它会把模型规则写到 `~/.claude/rules/pstack-models.md`。[Claude Code 适配器](../harness/claude-code.md)介绍了其他差异。

## 选择模型

运行：

```text
/setup-pstack
```

[`/setup-pstack`](../../skills/setup-pstack/SKILL.md) 会检测你能访问哪些模型，询问推理预算，逐个展示每个角色（代码委派、判断、评审面板），然后问你想怎么配。回答这些问题即可。它会写出 `~/.cursor/rules/pstack-models.mdc`，这是一条很小的规则，每个 pstack 技能都会读它。

默认使用 `xhigh` 推理，和 `large` 预算一样。`unlimited` 会把每个模型提到它的最高档，最高到 `max`。Opus 会到 `max`。Grok 最高只到 `xhigh`，所以它就停在那里。`medium` 和 `small` 会降低推理强度，消耗更少的 token。

你只需要覆盖你在意的部分。规则里没有写某一行的角色，会保留技能的默认值。想恢复默认值，就删掉那个角色的行。重跑 `/setup-pstack` 时，凡是模型与默认值不同的角色都会保留。当默认值发生变化时，在变化之前写下的规则仍然固定着旧的默认值，所以要删掉那些角色的行，或者删掉整个文件，再重新运行 `/setup-pstack`。

你可能会想，如果用 Auto 会怎样。把某个角色设成 `inherit-parent` 或 `auto`，pstack 就会省略子智能体的 `model` 字段，于是子智能体继承你父聊天的模型。这两个值意思一样，也都不是模型 slug。对于面板角色，这个值是一个列表，每个条目跑一个子智能体，所以列表长度决定了面板大小。配置还会设置 `swarm workers`，也就是每个 `/swarm` worker 的默认模型，除非某场竞赛为每条臂指定了模型。

## 接受验证提议，或者不接受

配置结束时，`/setup-pstack` 会寻找在你的项目里证明应用行为的方法，要么是一个 `verify-*` 技能，要么是已有的 harness。如果两者都没找到，它会提议用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 生成一个，只问一次。

你说好，它就会写出 `.cursor/skills/verify-<app>/`，这是一个项目本地的技能，教智能体像用户那样操作你的应用。它在交给你之前会先证明这个技能能用一次。你说不好，配置就继续往下走。你随时可以自己运行 `/create-verification-skill`。[验证与交付](./06-verify-and-ship.md#create-a-project-verification-skill)有更深入的介绍。

如果你是 pstack 新手，就说好。一个能检查自己工作的智能体，会一直做到检查通过。一个做不到的智能体，会把每个结果都交回给你手动检查。这本指南里所有内容中，验证技能的回报最大。

然后配置会提议用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 生成一个形式化验证技能，只问一次，除非项目里已经有了。测试只检查有人想到要写的那些情况。形式化验证技能会在给定范围内检查你代码的某一个关键性质，比如"一个任务绝不会同时运行两次"，覆盖该范围内的所有情况。当你的代码涉及并发、重试、状态机或解析器时，就说好，这些地方出 bug 代价高，而测试很少能碰到会出问题的那个情况。否则就说不好，以后情况变了再运行它。[验证与交付](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill)有相关介绍。

配置完成后，开一个新聊天。模型规则对新会话生效。

## 控制成本

pstack 会在子智能体和评审面板上多花 token。这是严谨的代价。想少花一些：

- 重跑 `/setup-pstack`，选一个更小的推理预算或更便宜的模型。主聊天用强模型，代码角色用更便宜、更快的模型，是个不错的搭配。
- 把某个角色设成 `auto` 或 `inherit-parent`，让它跑在聊天自己的模型上。
- 缩短面板列表。每个条目跑一个子智能体。
- 把 `/poteto-mode` 留给需要严谨的工作。小而明显的改动不需要。

## 跑通第一个任务

挑一件真实但很小的事，像跟同事描述那样描述它：

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

盯着 todo 列表看。它最前面的条目是匹配到的作战手册的步骤，对这个提示来说就是 Feature 作战手册。如果 `/poteto-mode` 跳过了某一步，那一步会留在列表里，标着 `skip: <reason>`，这样你能看到它选择不做什么。

从这里开始，你可以正常输入后续消息。想让 `/poteto-mode` 在整个聊天里一直开着，就在 `/` 菜单里用 Option+Enter（Mac）或 Alt+Enter（Windows）选中它，而不是按 Enter。这样它会变成一个 [Custom Mode](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，在你退出之前，每一轮都留在上下文里。Custom Mode 在 Agents Window 和 CLI 里都可用。直接按 Enter 只会把技能附加到一条消息上，随着聊天推进它就淡出了。

下一步：[通过 `/poteto-mode` 路由工作](./02-poteto-mode.md)。

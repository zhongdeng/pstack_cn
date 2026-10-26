# 安装 pstack

在这一页，你安装插件，挑选 pstack 使用哪些模型，并跑你的第一个任务。安装是一条命令，加上一段短对话。

## 安装插件

在 Cursor 对话里运行：

```text
/add-plugin pstack
```

Cursor 会确认插件已安装。

在 Claude Code 里，运行 `/plugin marketplace add cursor/plugins`，然后运行 `/plugin install pstack@cursor-plugins`。Claude Code 会给插件命令加前缀，所以本指南里的每条命令在那里都要加 `pstack:` 前缀，例如 `/pstack:setup-pstack`，它会把模型规则写到 `~/.claude/rules/pstack-models.md`。其他差异见 [Claude Code 适配器](../harness/claude-code.md)。

## 挑选你的模型

运行：

```text
/setup-pstack
```

[`/setup-pstack`](../../skills/setup-pstack/SKILL.md) 检测你有权访问的模型，询问推理预算，向你展示每个角色（代码委派、判断、各个评审面板），并问你想要什么。回答这些问题。它会写下 `~/.cursor/rules/pstack-models.mdc`，一条每个 pstack skill 都会读的小规则。

默认跑在 `xhigh` 推理上，和 `large` 预算相同。`unlimited` 把每个模型提升到它的最高档，上限是 `max`。Opus 会到 `max`。Grok 的上限是 `xhigh`，所以它停在那里。`medium` 和 `small` 会降低推理档，并少花 token。

你只覆盖你在意的部分。规则里没有对应行的角色，保持该 skill 的默认值。要恢复某个默认值，删掉该角色的那一行。重跑 `/setup-pstack` 会保留任何一个模型与默认值不同的角色。当某个默认值变化时，变化之前写好的规则仍会钉住旧默认值，所以删掉那些角色行，或者删掉文件，然后再运行 `/setup-pstack`。

你也许想知道用 Auto 会怎样。把一个角色设为 `inherit-parent` 或 `auto`，pstack 就会省略子 agent 的 `model` 字段，于是子 agent 继承你父对话的模型。两个值意思相同，而且都不是模型 slug。对于面板角色，这个值是一个列表，每个条目跑一个子 agent，所以列表长度决定面板大小。安装还会配置 `swarm workers`，也就是每个 `/swarm` 工作者的默认模型，除非某次赛跑为每一臂指定了模型。

## 接受验证提议，或者不接受

安装结束时，`/setup-pstack` 会在你的项目里寻找一种证明应用行为的办法，要么是一个 `verify-*` skill，要么是现成的 harness。如果两个都没有，它会提议一次，用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 生成一个。

答应的话，它会写下 `.cursor/skills/verify-<app>/`，一个项目本地的 skill，教 agent 像用户那样驱动你的应用。它会先证明这个 skill 能工作一次，再交出来。拒绝的话，安装就继续往下。你随时可以自己运行 `/create-verification-skill`。[验证并交付](./06-verify-and-ship.md#create-a-project-verification-skill) 会深入讲它。

如果你刚接触 pstack，就答应。一个能检查自己工作的 agent 会一直做到检查通过。一个不能的，会把每个结果交回给你手工检查。这份指南里的一切当中，验证 skill 的回报最大。

接着，安装会提议一次，用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 生成一个形式化验证 skill，除非项目里已经有一个。测试检查的是有人想到要写的那些情形。形式化验证 skill 检查你代码的一条关键性质，例如“一个任务绝不会同时跑两次”，并且是在声明范围内的每一种情形里检查。当你的代码有并发、重试、状态机或解析器，bug 的代价很高，而测试又很少够到那个会坏掉的情形时，就答应。否则就拒绝，等情况变了再运行。[验证并交付](./06-verify-and-ship.md#prove-a-property-with-a-formal-verification-skill) 会讲它。

安装之后，新开一个对话。模型规则作用于新会话。

## 把花费控住

pstack 会在子 agent 和评审面板上多花 token。这是严格性的代价。想少花一些：

- 重跑 `/setup-pstack`，选一个更小的推理预算或更便宜的模型。主对话用强模型，代码角色用更便宜、更快的模型，是一种好的拆法。
- 把某个角色设为 `auto` 或 `inherit-parent`，让它跑在对话自己的模型上。
- 缩短面板列表。每个条目跑一个子 agent。
- 把 `/poteto-mode` 留给需要严格性的工作。小而明显的编辑用不着。

## 跑你的第一个任务

挑一件真实但小的事，用你跟同事描述它的方式来描述：

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

看待办列表。最前面的条目是匹配到的行动手册的步骤，复制了进来；对这条提示词来说是功能行动手册。如果 `/poteto-mode` 跳过某一步，这一步会留在列表里，并带上 `skip: <reason>`，这样你能看见它选择不做的是什么。

从这里开始你可以输入平常的后续消息。要让 `/poteto-mode` 在整个对话里保持生效，从 `/` 菜单里选中它，用 Option+Enter（Mac）或 Alt+Enter（Windows），而不是 Enter。这会把它变成一种[自定义模式](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，在你退出之前，每一轮都留在上下文里。自定义模式在 Agents 窗口和 CLI 里都可用。直接按 Enter 只会把这个 skill 附到一条消息上，随着对话往前走，它会淡出。

下一篇：[让工作走 `/poteto-mode`](./02-poteto-mode.md)。

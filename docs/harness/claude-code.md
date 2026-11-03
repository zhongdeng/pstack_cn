# Claude Code 中的 pstack

pstack 技能用的是 Cursor 的名字。在 Claude Code 里，每个会话读一次这个文件，然后用下面的表把技能里每个 Cursor 名字映射过去。`<pstack>` 指放着 `skills/` 和 `docs/` 的那个文件夹。如果某个 Cursor 字段在表里没有对应行，就丢掉它，并说明丢掉了。绝不要传工具 schema 会拒绝的字段或值。

## 工具

| Cursor | Claude Code |
| --- | --- |
| `Task` | `Agent` |
| `AskQuestion` | `AskUserQuestion`。在 `-p` 模式下它不存在，所以用纯文本提问。 |
| 打开一个待办列表 | 如果会话提供了 `TodoWrite`，就用它。否则把列表放在回复里，并在每个阶段更新它。 |
| 运行另一个 pstack 技能（`/name` 或“**name** 技能”） | `Read` `<pstack>/skills/<name>/SKILL.md` 并照着做。`Skill` 工具会拒绝大多数 pstack 技能。当你让用户输入它时，写成 `/pstack:<name>`。 |
| `Grep`、`Glob` | 会话没有 `Grep` 或 `Glob` 时，用 `Bash` 跑 `rg`。 |

## 子智能体字段

| Cursor | Claude Code |
| --- | --- |
| `subagent_type: generalPurpose` | `subagent_type: "general-purpose"` |
| `poteto-agent`、`comment-sicko` | `pstack:poteto-agent`、`pstack:comment-sicko` |
| `readonly: true` | `subagent_type: "Explore"`。它保留 `Bash`，所以任务说明里还要写“不要编辑文件”，事后你再检查 `git status`。 |
| `readonly: false` | `general-purpose`。它保留会话的 MCP 服务器。 |
| `environment: "cloud"` | `isolation: "worktree"`。写明 worker 要检出的分支或提交。 |
| `environment: "local"` | 省略。 |
| `cloud_base_branch: <b>` | 告诉 worker 先检出 `<b>`。 |
| `run_in_background: true` | 省略。子智能体默认在后台运行，完成时会通知你。 |
| `resume` | 新起一个智能体，把之前的结果粘进它的任务说明。 |
| `file_attachments` | 在任务说明里列出这些路径。 |

## 模型

| Cursor | Claude Code |
| --- | --- |
| `claude-<family>-<version>-<effort>[-fast]`，比如 `claude-opus-5-5-xhigh` | `model: "opus"` 和 `effort: "xhigh"`。`model` 只接受 `opus`、`sonnet`、`haiku`、`fable`。丢掉 `-fast`。 |
| `grok-*`、`gpt-*` 或其他非 Claude 的 slug | 省略 `model`，让智能体跑在会话模型上，并说明这一点。 |
| `auto` 或 `inherit-parent` | 省略 `model`。 |
| `pstack-models.mdc` 规则，`~/.cursor/rules/pstack-models.mdc` | `~/.claude/rules/pstack-models.md`。Claude Code 会把它加载进每个新会话，所以它的角色行已经在上下文里了。如果不在，就读这个文件。如果文件或该角色的行缺失，就用技能的默认 slug。 |
| 角色值 `<model> <effort>`，比如 `opus high` | `model: "opus"` 和 `effort: "high"`。 |

## setup-pstack

Claude Code 会把 `~/.claude/rules/` 里的每个 `.md` 文件加载进每个新会话，所以 `setup-pstack` 把它的规则写在那里。按它的步骤做，但有以下改动：

- 检测。检测到的模型就是 `Agent` 工具 schema 列出的那些 `model` 值，每个配一个来自它 `effort` 值的 effort。把真实模型写成 `<model> <effort>`，比如 `opus xhigh`。effort 是最后一个 token，所以预算那一步按原样就能用。
- 默认值。用上面的行映射每个默认 slug：`claude-opus-5-5-xhigh` 是 `opus xhigh`，`grok-4.7-xhigh-fast` 是 `inherit-parent`。
- 写入。写 `~/.claude/rules/pstack-models.md`，不要 frontmatter，然后是注释行、`# budget` 行，以及第 5 步里每个角色一行。整个文件覆盖写。绝不要把角色行放进 `CLAUDE.md` 或 `AGENTS.md`。

## 路径

| Cursor | Claude Code |
| --- | --- |
| `.cursor/skills/`、`~/.cursor/skills/` | `.claude/skills/`、`~/.claude/skills/` |
| `~/.cursor/plugins/`、`.cursor-plugin/plugin.json` | `~/.claude/plugins/`、`.claude-plugin/plugin.json` |
| `.cursor/rules/*.mdc`，始终生效的规则 | `CLAUDE.md`，没有 `CLAUDE.md` 时用 `AGENTS.md`。Claude Code 从不读 `.mdc` 文件。模型规则是例外。见模型。 |
| `https://github.com/cursor/plugins/blob/main/pstack/<path>` | 该文件存在时用 `<pstack>/<path>`。插件会带上技能、`docs/guide/` 和 `README.md`。读本地副本，绝不要去拉取。用户需要链接时把 URL 给他们。 |
| `~/.cursor/projects/<slug>/agent-transcripts/` 里的转录 | `~/.claude/projects/<slug>/<session>.jsonl`。slug 是工作区路径，每个 `/` 和 `.` 都换成 `-`，所以 `/Users/you/proj` 是 `-Users-you-proj`。那个文件夹里直接放着的最新 `.jsonl` 就是当前会话。它的 `<session>/subagents/` 文件夹放着子智能体转录。只读这个工作区的文件夹。 |

## 仅 Cursor 有的功能

Claude Code 没有 Cursor Automations、Bugbot、Cursor 云智能体，也没有内置的 PR 工具。当某一步需要其中一个时，在回复里写一行 `Skipped in Claude Code: <step>. <reason>.`，然后继续下一步。不要停下、不要提问、不要重试。当后面的步骤需要被跳过那一步产出的东西时，比如一个 URL 或一个 key，留一个占位符，并在那一行里点名它。

| Cursor | Claude Code |
| --- | --- |
| Cursor Automations：routine、`update_state` routine 调用、`api2.cursor.sh/automations` webhook、routine 唤醒，以及 `SendToUser` 密钥请求 | 用那一行跳过。 |
| Bugbot | GitHub PR 上的 Bugbot 评论就是普通的评审线程，所以用该步骤给出的 forge 命令去分诊它们。当 PR 没有 Bugbot 检查或评论时，跳过启动、等待或配置 Bugbot 的那一步。 |
| Cursor 云智能体 | `environment: "cloud"` 映射到 worktree，见子智能体字段。跳过需要云智能体本身的那一步，比如它的 dashboard 状态或它自己的机器。 |
| 内置的 PR 工具 | 用该步骤给出的 forge 命令，比如 `gh pr create`。这不算跳过，所以不写那一行。 |

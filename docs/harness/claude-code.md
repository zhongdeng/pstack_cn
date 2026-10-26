# pstack 在 Claude Code 中

pstack 的 skill 使用 Cursor 的名称。在 Claude Code 里，每个会话读一次这个文件，然后用下面的表把 skill 里的每个 Cursor 名称映射过去。`<pstack>` 指持有 `skills/` 和 `docs/` 的那个文件夹。如果某个 Cursor 字段没有对应行，就丢掉它，并说明一声。绝不要传入工具 schema 会拒绝的字段或值。

## 工具

| Cursor | Claude Code |
| --- | --- |
| `Task` | `Agent` |
| `AskQuestion` | `AskUserQuestion`。在 `-p` 模式下它不存在，所以用纯文本提问。 |
| 打开一份待办列表 | 如果会话提供了 `TodoWrite` 就用它。否则把列表留在你的回复里，并在每个阶段更新。 |
| 运行另一个 pstack skill（`/name`，或 “the **name** skill”） | `Read` `<pstack>/skills/<name>/SKILL.md` 并遵循它。`Skill` 工具会拒绝大多数 pstack skill。当你告诉用户去输入它时，写成 `/pstack:<name>`。 |
| `Grep`、`Glob` | 当会话没有 `Grep` 或 `Glob` 时，用带 `rg` 的 `Bash`。 |

## 子 agent 字段

| Cursor | Claude Code |
| --- | --- |
| `subagent_type: generalPurpose` | `subagent_type: "general-purpose"` |
| `poteto-agent`、`comment-sicko` | `pstack:poteto-agent`、`pstack:comment-sicko` |
| `readonly: true` | `subagent_type: "Explore"`。它保留 `Bash`，所以简报里还要写上 “do not edit files”，并且你事后检查 `git status`。 |
| `readonly: false` | `general-purpose`。它保留会话的 MCP 服务器。 |
| `environment: "cloud"` | `isolation: "worktree"`。写明工作者要检出的分支或 commit。 |
| `environment: "local"` | 省略。 |
| `cloud_base_branch: <b>` | 告诉工作者先检出 `<b>`。 |
| `run_in_background: true` | 省略。子 agent 默认在后台运行，完成时通知你。 |
| `resume` | 拉起一个新 agent，并把先前的结果粘贴进它的简报。 |
| `file_attachments` | 在简报里列出这些路径。 |

## 模型

| Cursor | Claude Code |
| --- | --- |
| `claude-<family>-<version>-<effort>[-fast]`，例如 `claude-opus-5-5-xhigh` | `model: "opus"` 和 `effort: "xhigh"`。`model` 只接受 `opus`、`sonnet`、`haiku`、`fable`。丢掉 `-fast`。 |
| 一个 `grok-*`、`gpt-*` 或其他非 Claude 的 slug | 省略 `model`，让 agent 跑在会话模型上，并说明一声。 |
| `auto` 或 `inherit-parent` | 省略 `model`。 |
| `pstack-models.mdc` 这条规则，`~/.cursor/rules/pstack-models.mdc` | `~/.claude/rules/pstack-models.md`。Claude Code 会把它载入每一个新会话，所以它的角色行已经在上下文里。如果没有，就读这个文件。如果文件或该角色的行缺失，就用 skill 的默认 slug。 |
| 一个角色值 `<model> <effort>`，例如 `opus high` | `model: "opus"` 和 `effort: "high"`。 |

## setup-pstack

Claude Code 会把 `~/.claude/rules/` 里的每一个 `.md` 文件载入每个新会话，所以 `setup-pstack` 把规则写在那里。按它的步骤做，并做这些改动：

- 检测。检测出的模型是 `Agent` 工具 schema 列出的那些 `model` 值，每个都带一个来自其 `effort` 值的 effort。把真实模型写成 `<model> <effort>`，例如 `opus xhigh`。effort 是最后一个 token，所以预算那一步按原文照做即可。
- 默认值。用上面的行映射每个默认 slug：`claude-opus-5-5-xhigh` 是 `opus xhigh`，`grok-4.7-xhigh-fast` 是 `inherit-parent`。
- 写入。把 `~/.claude/rules/pstack-models.md` 写成没有 frontmatter，然后是注释行、`# budget` 行，以及第 5 步里每个角色一行。覆盖整个文件。绝不要把角色行放进 `CLAUDE.md` 或 `AGENTS.md`。

## 路径

| Cursor | Claude Code |
| --- | --- |
| `.cursor/skills/`、`~/.cursor/skills/` | `.claude/skills/`、`~/.claude/skills/` |
| `~/.cursor/plugins/`、`.cursor-plugin/plugin.json` | `~/.claude/plugins/`、`.claude-plugin/plugin.json` |
| `.cursor/rules/*.mdc`，始终应用的规则 | `CLAUDE.md`，或者当不存在 `CLAUDE.md` 时用 `AGENTS.md`。Claude Code 从不读取 `.mdc` 文件。模型规则是例外。见“模型”。 |
| `https://github.com/cursor/plugins/blob/main/pstack/<path>` | 当该文件存在时用 `<pstack>/<path>`。插件附带了 skill、`docs/guide/` 和 `README.md`。读本地副本，绝不要去拉取它。当用户需要一个链接时，把这个 URL 给用户。 |
| `~/.cursor/projects/<slug>/agent-transcripts/` 里的对话记录 | `~/.claude/projects/<slug>/<session>.jsonl`。slug 是工作区路径，其中每个 `/` 和 `.` 都换成 `-`，所以 `/Users/you/proj` 是 `-Users-you-proj`。该文件夹里直接放置的最新 `.jsonl` 就是当前会话。它的 `<session>/subagents/` 文件夹存放子 agent 的对话记录。只读这个工作区的文件夹。 |

## 仅 Cursor 拥有的功能

Claude Code 没有 Cursor Automations、Bugbot、Cursor 云端 agent，也没有内置的 PR 工具。当某一步需要其中之一时，在回复里放一行，`Skipped in Claude Code: <step>. <reason>.`，然后继续下一步。不要停下，不要询问，不要重试。当后面的步骤需要被跳过的步骤产出的东西，例如一个 URL 或一个密钥，就留一个占位符，并在那一行里点名它。

| Cursor | Claude Code |
| --- | --- |
| Cursor Automations：routine、`update_state` 的 routine 调用、`api2.cursor.sh/automations` webhook、routine 唤醒，以及 `SendToUser` 的密钥请求 | 用那一行跳过。 |
| Bugbot | GitHub PR 上的 Bugbot 评论就是普通的评审线程，所以用该步骤给出的 forge 命令来分诊。当 PR 没有 Bugbot 检查或评论时，跳过那个会启动、等待或配置 Bugbot 的步骤。 |
| Cursor 云端 agent | `environment: "cloud"` 映射到工作树，如“子 agent 字段”所述。跳过需要云端 agent 本身的步骤，例如它的仪表盘状态或它自己的机器。 |
| 内置的 PR 工具 | 用该步骤给出的 forge 命令，例如 `gh pr create`。这不算跳过，所以不要写那一行。 |

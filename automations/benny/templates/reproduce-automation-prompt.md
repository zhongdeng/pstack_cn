# 复现自动化提示词

> 复制出来的配置流程的源材料。等 `automate` 确认复制过来的包已经提交到自动化将要运行的那个仓库之后，把这段意图改写成内置的 `automate` 草稿。

本次运行请阅读并遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。

配置来源。只有当这个仓库相对路径已经提交到同一个目标仓库时，才把它包含进来。否则就转述配置好的值。绝不要使用插件来源或缓存路径：

```text
{{BENNY_CONFIG_PATH}}
```

触发条件：

```json
{
	"source_channel_id": "{{SLACK_CHANNEL_ID}}",
	"message_ts": "{{SLACK_MESSAGE_TS}}",
	"thread_ts": "{{SLACK_THREAD_TS_OR_EMPTY}}"
}
```

创建意图应当把它描述为配置好的源 Slack 频道里的一条新的顶层报告。它应当包含配置好的仓库、默认分支、issue tracker、control adapter、feature map，以及草稿 PR 能力。

把源频道和根线程时间戳视为不可变。如果其中任何一个缺失，或者与配置不匹配，就停下来，不要发帖。

在这个确切的线程里，等待来自配置好的 triage 身份的配置好的 triage 标记。只有 `[benny:bug]` 或 `[benny:performance]` 才继续。

在尝试复现之前，先要求具备配置好的 control-adapter 技能。通过真实 UI 把那个确切的区分性症状复现两次。核对已有的 PR 或提交，不要在上面另写内容。只有在复现得到确认、并且满足操作文件里的 fix gate 之后，才尝试有边界的修复。

协调者是唯一在 Slack 发帖的角色。每个子提示词都必须禁止 `SendSlackMessage`、`PostToSlack`、`chat.postMessage`，以及所有其他 Slack 写入。子智能体只返回发现。

绝不要在源频道里发根消息。

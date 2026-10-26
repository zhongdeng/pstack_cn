# 复现 automation 提示词

> 复制安装流程的源材料。在 `automate` 确认复制包已经提交到 automation 将要运行的仓库之后，把这份意图改写成内置 `automate` 草稿。

本次运行阅读并遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。

配置来源。只有当这条仓库相对路径已经提交在同一个目标仓库里时，才把它写进来。否则改述已配置的值。绝不要使用插件源路径或缓存路径：

```text
{{BENNY_CONFIG_PATH}}
```

触发器：

```json
{
	"source_channel_id": "{{SLACK_CHANNEL_ID}}",
	"message_ts": "{{SLACK_MESSAGE_TS}}",
	"thread_ts": "{{SLACK_THREAD_TS_OR_EMPTY}}"
}
```

创建意图应当把这描述为：在已配置的来源 Slack 频道里，一条新的顶层报告。它应当包含已配置的仓库、默认分支、问题跟踪器、控制适配器、功能地图，以及草稿拉取请求能力。

把来源频道和根线程时间戳当作不可变的。二者缺一，或与配置不符，就停下来，不要发帖。

在这条确切的线程里，等待已配置的分诊身份发出已配置的分诊标记。只对 `[benny:bug]` 或 `[benny:performance]` 继续。

尝试复现之前，先要求已配置的控制适配器技能。通过真实 UI，把那个有区分度的症状确切地复现两遍。核对应有的拉取请求或提交，不要在它们上面另写一套。只有在复现被确认、并且操作文件的修复门通过之后，才尝试一个有边界的修复。

协调者是唯一的 Slack 发帖者。每一条子提示都必须禁止 `SendSlackMessage`、`PostToSlack`、`chat.postMessage`，以及其他所有 Slack 写入。子级只返回发现。

绝不要在来源频道发一条根消息。

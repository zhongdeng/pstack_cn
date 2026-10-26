# 分诊 automation 提示词

> 复制安装流程的源材料。在 `automate` 确认复制包已经提交到 automation 将要运行的仓库之后，把这份意图改写成内置 `automate` 草稿。

本次运行阅读并遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。

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

创建意图应当把这描述为：在已配置的来源 Slack 频道里，一条新的顶层报告。

把来源频道和根线程时间戳当作不可变的。二者缺一，或与配置不符，就停下来，不要发帖，也不要写问题跟踪器。

已提交的操作文件负责分类、附件审阅、原因追溯、路由、去重、跟踪器写入，以及最终裁决。不要发进度消息。绝不要在来源频道发一条根消息。

协调者是唯一的 Slack 发帖者。任何被委派的 worker 必须只读，只返回发现，并明确禁止每一次 Slack 写入动作。

唯一的裁决以恰好一个已配置的标记结束：

```text
[benny:bug]
[benny:performance]
[benny:other]
```

bug 或性能标记可以附加 `tracker=<URL>`。

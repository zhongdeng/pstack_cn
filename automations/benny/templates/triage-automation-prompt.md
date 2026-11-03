# 分诊自动化提示词

> 这是复制式配置流程的源材料。等 `automate` 确认复制过来的包已经提交到自动化将要运行的那个仓库之后，把这段意图改写成内置的 `automate` 草稿。

本次运行请阅读并遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。

配置来源。只有当这个仓库相对路径已经提交到同一个目标仓库时，才把它写进去。否则就把配置好的值转述出来。绝不要使用插件来源或缓存路径：

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

创建意图应当把它描述为配置好的来源 Slack 频道里的一条新的顶层报告。

把来源频道和根线程时间戳当作不可变。只要其中任何一个缺失，或者与配置不符，就停下来，不要发帖，也不要写 issue tracker。

已提交的操作文件负责分类、附件审查、原因追踪、路由、去重、tracker 写入和最终判定。不要发进度消息。绝不要在来源频道里发根消息。

协调者是唯一在 Slack 发帖的角色。任何被委派的 worker 都必须只读，只返回发现，并且明确禁止一切 Slack 写操作。

用恰好一个配置好的标记来结束这条唯一的判定：

```text
[benny:bug]
[benny:performance]
[benny:other]
```

bug 或 performance 标记可以附加 `tracker=<URL>`。

# 来源作战手册

why 技能会为每个可用的证据类别各启动一个调查者，每个调查者读下面一份针对具体来源的作战手册。这些作战手册是常见 MCP 的具体示例。换用同类别里的其他 MCP 时，照着改就行。

| 类别 | 作战手册 | 它记录的示例 MCP |
|---|---|---|
| 源码控制历史 | [`code-archaeology.md`](./sources/code-archaeology.md) | git、`gh` |
| Issue / 工单跟踪 | [`linear.md`](./sources/linear.md) | Linear（可改用于 Jira、GitHub Issues、Plane、Shortcut） |
| 长文档 | [`notion.md`](./sources/notion.md) | Notion（可改用于 Confluence、Google Docs、Coda） |
| 实时团队聊天 | [`slack.md`](./sources/slack.md) | Slack（可改用于 Discord、Microsoft Teams、Mattermost） |
| 基础设施可观测性 | [`datadog.md`](./sources/datadog.md) | Datadog（可改用于 New Relic、Honeycomb、Grafana、Splunk） |
| 错误 / 异常跟踪 | [`sentry.md`](./sources/sentry.md) | Sentry（可改用于 Rollbar、Bugsnag、Airbrake） |
| 产品分析数仓 | [`databricks.md`](./sources/databricks.md) | Databricks SQL（可改用于 Snowflake、BigQuery、ClickHouse、dbt） |

跨类别：

- [`incident-postmortem.md`](./sources/incident-postmortem.md)。如果目标代码看起来是防御性的（null 检查、重试、超时、限流、feature flag、出口防护、OOM 处理），就加上这份。

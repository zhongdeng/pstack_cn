# 来源手册

why 技能按每一个可用的证据类别各拉起一个调查者，每个调查者阅读下面一份针对单一来源的手册。这些手册是常见 MCP 的具体例子。同一类别里换一个 MCP 时，改写它们。

| 类别 | 手册 | 它所记录的示例 MCP |
|---|---|---|
| 源代码控制历史 | [`code-archaeology.md`](./sources/code-archaeology.md) | git、`gh` |
| 问题 / 工单跟踪器 | [`linear.md`](./sources/linear.md) | Linear（可改写用于 Jira、GitHub Issues、Plane、Shortcut） |
| 长文文档 | [`notion.md`](./sources/notion.md) | Notion（可改写用于 Confluence、Google Docs、Coda） |
| 实时团队聊天 | [`slack.md`](./sources/slack.md) | Slack（可改写用于 Discord、Microsoft Teams、Mattermost） |
| 基础设施可观测性 | [`datadog.md`](./sources/datadog.md) | Datadog（可改写用于 New Relic、Honeycomb、Grafana、Splunk） |
| 错误 / 异常跟踪 | [`sentry.md`](./sources/sentry.md) | Sentry（可改写用于 Rollbar、Bugsnag、Airbrake） |
| 产品分析仓库 | [`databricks.md`](./sources/databricks.md) | Databricks SQL（可改写用于 Snowflake、BigQuery、ClickHouse、dbt） |

横切：

- [`incident-postmortem.md`](./sources/incident-postmortem.md)。如果目标代码看起来是防御性的（空值检查、重试、超时、速率限制、功能开关、出口守卫、OOM 处理），就加上这一份。

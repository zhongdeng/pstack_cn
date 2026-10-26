# Databricks 分析与系统表

## 这个来源包含什么

Databricks 是产品分析、数据管道和仓库遥测层。它补充 Datadog。Datadog 是*基础设施/运行时*视角，Databricks 是*产品/数据*视角（用户做了什么、跑了哪些实验、功能使用如何演变、一个阈值常量从哪来）。

- **产品分析事件。** `your_warehouse.events.analytics_track_event`（原始）以及 `<your_analytics_db>.<schema>.<table>` 里按事件类型化、去重的 dbt 模型。用户行为：功能调用、点击、接受/拒绝、提交、客户端上报的错误。
- **用量与计费事件。** `your_warehouse.events.usage_event` / `<your_analytics_db>.<schema>.stg_usage_events`，`your_warehouse.events.raw_model_event` / `<your_analytics_db>.<schema>.stg_raw_model_events`。用于由成本或体量推动的决定。
- **实验 / 功能开关数据。** 曝光表和结果表。**schema 因公司而异。** 在假定表名之前，先用 `SHOW TABLES` 探一下。
- **系统表。** `system.query.history`、`system.compute.warehouses`、`system.billing.*`、`system.access.audit`。回答「这次查询贵吗？」「有人跑它的频率如何？」「仓库负载什么时候冲高了？」
- **dbt 血缘。** `<your_analytics_db>.<schema>` 里的模型揭示哪些管道依赖一张表或一个字段。上游改动常常推动消费方代码的改动。
- **Databricks notebook。** 工程师在改代码之前写的探索性分析。**不能通过 SQL MCP 查询。** 如果你怀疑理由活在一个 notebook 里，把它记成一个缺口。

## 如何搜索

使用 Databricks SQL MCP。主工具：`execute_sql_read_only`。如果它返回一个 `statement_id`，用 `poll_sql_result` 去轮询，而不是重跑。

**查询之前先定向。** schema 因公司而异。在信任一个表名之前先探：

```sql
SHOW TABLES IN <your_analytics_db>.<schema> LIKE '*<keyword>*';
DESCRIBE TABLE <your_analytics_db>.<schema>.stg_<event>;
```

**每一条查询都要限时间。** 这些表很大，不加约束的扫描会超时。在 `_timestamp`（事件）或 `start_time`（`system.query.history`）上过滤，窗口包住交付日期，通常前后各约 30 天，只有充分理由才放宽。

**优先用类型化的 dbt 模型，而不是原始表。** `<your_analytics_db>.<schema>.<table>` 已去重、已类型化，并且做了 liquid clustering。`your_warehouse.events.analytics_track_event` 有重复，并且 `properties_json` 未类型化。模型名模式：`stg_<source>_<event_name_with_underscores>`，其中 `<source>` 是 `app`、`backend`、`website` 或 `cli`。单靠模式对不上时，用 `SHOW TABLES` 确认确切模型名。只有还没有 dbt 模型，或你需要 dbt 刷新滞后窗口内的事件时，才退回原始表。

**类型化 dbt 模型上的列约定**（知道这些可以省一次 `DESCRIBE` 往返）：

- `_timestamp`、`_id`、`_auth_id`、`_request_id`、`event_name`。每个模型上都是标准列
- `properties_<name>`。类型化的、下划线命名的事件属性（`properties_entrypoint`、`properties_size_bytes`，……）
- `context_team_id`、`context_client_version`、`context_country`、`context_client_os`。预先抽出的客户端上下文

### 往往有回报的调查模式

挑选与目标匹配的表 + 列组合：

1. **事件用量轨迹。** 在 PR 合并前后 ±30 天的窗口里，对相关 `stg_*` 模型做每日计数。合并后一两天内从零跳到稳定体量的阶跃函数，是这条 PR 推出了该功能的强旁证。衰减到零则提示弃用或删除。
2. **护栏 / 防御性检查的来源。** PR *之前* 14 天里，相关 `properties_<name>` 列的分布（中位数 / p99 / 最大值）。一个与目标阈值常量吻合的 p99，提示这个数字是从数据里选出来的。
3. **实验 / 功能开关查找。** 用 `SHOW TABLES ... LIKE '*experiment*'` 找到曝光表，然后在 PR 日期附近按变体拉取相关开关键的曝光计数。
4. **迁移、回填或性能重写的查询历史证据。** `system.query.history` 用 `statement_text ILIKE '%<table_or_symbol>%'` 过滤，并收紧 `start_time` 窗口，能浮出很可能推动这次改动的昂贵查询（按 `total_duration_ms` 排序，或聚合 `SUM(read_bytes)`、`COUNT(*)`）。
5. **dbt 血缘。** 如果目标从 `<your_analytics_db>.<schema>` 模型读或往里写，该模型自己的 git 历史（在本仓库里）常常带着理由。把这条线索交回 git 调查者，而不是你自己去追。

## 这里的好证据长什么样

除了上面那些模式形状：

- 一次防御性代码 PR 之后的几天里，某个错误分类事件的计数掉到接近零。提示这条 PR 解决了那一类错误
- 曝光表的一行点名了目标的功能开关键，并在 PR 交付日期附近带有 “shipped” / “concluded” 决定

## 常见陷阱

- **埋了点 ≠ 由它引起。** 一个事件的存在意味着有人在乎到把它记下来，并不意味着目标代码*因为*它而存在。在声称因果之前，配上 git 调查者的一条 PR/提交引用。
- **静默的埋点改动。** 事件体量上的阶跃函数可能意味着一个新事件开始被记录，而不是用户行为变了。在把爬升读成功能上线信号之前，先检查同一窗口里的埋点 PR。
- **schema 漂移。** 事件属性会演变。类型化 dbt 模型上今天有的一列，在目标被写下时可能还不存在。更早的数据可能只在原始 `properties_json` 里带着这个属性。
- **dbt 刷新滞后。** `<your_analytics_db>.<schema>.*` 按计划重建（常常是每小时/每天）。最近几小时的事件，退回 `your_warehouse.events.*`，并按 `_id` 去重。
- **因公司而异的表。** 实验、功能开关、计费和用量表各不相同。报告一张你从未确认其存在的表的结果，是典型失败模式。先用 `SHOW TABLES` / `DESCRIBE TABLE` 探。
- **保留期悬崖。** 如果相关窗口早于表的保留期或 dbt 模型的创建日期，那是一个*缺口*，不是空结果。明确点名它，这样综合者不会把「没有结果」读成「没有活动」。
- **notebook 不可查询。** SQL MCP 看不见 Databricks notebook。如果你怀疑理由活在其中一个里，返回一个缺口。

## 要返回什么

对每一项相关发现：
- 类型（产品事件 / 实验曝光 / 用量或计费事件 / 系统表行 / dbt 模型）
- 全限定表名，以及你跑过的确切查询
- 查询的时间窗口
- 紧凑的数字摘要（计数、分位数、首次/末次出现的时间戳）。**不要倾倒原始行。**
- 与目标交付日期的时间相关（例如 “first row 2024-08-15, PR #49074 merged 2024-08-14”）
- 相关性 + 强度：直接 / 旁证 / 弱

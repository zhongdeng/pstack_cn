# Databricks 分析与系统表

## 这个来源里有什么

Databricks 是产品分析、数据管道和数仓遥测这一层。它和 Datadog 互补。Datadog 是*基础设施/运行时*视角，Databricks 是*产品/数据*视角（用户做了什么、跑过哪些实验、功能使用怎么演变、某个阈值常量是从哪来的）。

- **产品分析事件。** `your_warehouse.events.analytics_track_event`（原始表），以及 `<your_analytics_db>.<schema>.<table>` 里按事件分表、去重、带类型的 dbt 模型。用户行为：功能调用、点击、接受/拒绝、提交、客户端上报的错误。
- **用量与计费事件。** `your_warehouse.events.usage_event` / `<your_analytics_db>.<schema>.stg_usage_events`，`your_warehouse.events.raw_model_event` / `<your_analytics_db>.<schema>.stg_raw_model_events`。用于成本或用量驱动的决策。
- **实验 / 功能开关数据。** 曝光表和结果表。**schema 因公司而异。** 先 `SHOW TABLES` 探一下，别直接假设表名。
- **系统表。** `system.query.history`、`system.compute.warehouses`、`system.billing.*`、`system.access.audit`。回答"这个查询贵不贵？""有人多久跑一次？""warehouse 负载什么时候飙的？"
- **dbt 血缘。** `<your_analytics_db>.<schema>` 里的模型能看出哪些管道依赖某张表/某个字段。上游改动经常是下游消费方代码改动的动因。
- **Databricks notebook。** 工程师在改代码之前写的探索性分析。**SQL MCP 查不到。** 如果你怀疑理由就在某个 notebook 里，把它记成一个缺口。

## 怎么搜

用 Databricks SQL MCP。主工具：`execute_sql_read_only`。如果它返回了 `statement_id`，用 `poll_sql_result` 轮询，别重跑。

**先摸清结构再查。** schema 因公司而异。信任表名之前先探一下：

```sql
SHOW TABLES IN <your_analytics_db>.<schema> LIKE '*<keyword>*';
DESCRIBE TABLE <your_analytics_db>.<schema>.stg_<event>;
```

**每个查询都要限定时间。** 这些表很大，不加约束的扫描会超时。按 `_timestamp`（事件表）或 `start_time`（`system.query.history`）过滤，窗口卡在 ship 日期前后，一般前后各约 30 天，只有充分理由才放宽。

**优先用带类型的 dbt 模型，别用原始表。** `<your_analytics_db>.<schema>.<table>` 是去重、带类型、liquid-clustered 的。`your_warehouse.events.analytics_track_event` 有重复，`properties_json` 也没类型。模型命名模式：`stg_<source>_<event_name_with_underscores>`，其中 `<source>` 是 `app`、`backend`、`website` 或 `cli`。光靠模式定不下来时，用 `SHOW TABLES` 确认确切模型名。只有在还没有对应 dbt 模型，或者你要的事件落在 dbt 刷新延迟之内时，才退到原始表。

**带类型 dbt 模型的列约定**（知道这些能省掉一次 `DESCRIBE` 往返）：

- `_timestamp`、`_id`、`_auth_id`、`_request_id`、`event_name`。每个模型都有
- `properties_<name>`。带类型、下划线命名的事件属性（`properties_entrypoint`、`properties_size_bytes` 等）
- `context_team_id`、`context_client_version`、`context_country`、`context_client_os`。预先抽好的客户端上下文

### 通常有回报的调查套路

按目标挑对应的表 + 列组合：

1. **事件使用轨迹。** 在 PR 合并前后 ±30d 窗口内，统计相关 `stg_*` 模型的每日计数。合并后一两天内从零跳到稳定量级的阶跃函数，是 PR 上线了该功能的有力旁证。衰减到零则暗示废弃或删除。
2. **护栏 / 防御性检查的出处。** PR *之前* 14 天里相关 `properties_<name>` 列的分布（中位数 / p99 / 最大值）。p99 和目标里的阈值常量对得上，说明这个数字是从数据里选出来的。
3. **实验 / 功能开关查找。** `SHOW TABLES ... LIKE '*experiment*'` 找到曝光表，然后按变体拉 PR 日期附近相关 flag key 的曝光计数。
4. **迁移、回填或性能重写的查询历史证据。** 用 `system.query.history`，按 `statement_text ILIKE '%<table_or_symbol>%'` 过滤，`start_time` 窗口收紧，能翻出很可能促成这次改动的昂贵查询（按 `total_duration_ms` 排序，或聚合 `SUM(read_bytes)`、`COUNT(*)`）。
5. **dbt 血缘。** 如果目标读或写某个 `<your_analytics_db>.<schema>` 模型，这个模型自己的 git 历史（在本仓库里）经常带着理由。把这条线索交回给 git 调查员，别自己追。

## 这里什么样的证据算好证据

除了上面那些模式形状之外：

- 一个做错误分类的事件，在防御性代码 PR 之后几天计数掉到接近零。说明这个 PR 解决了那类错误
- 曝光表里有一行点名了目标的功能开关 key，决策是"shipped" / "concluded"，时间在 PR ship 日期附近

## 常见坑

- **有埋点 ≠ 有因果。** 一个事件存在，只说明有人在意到要记它，不说明目标代码是*因为它*才存在。下因果结论之前，先配上 git 调查员给的 PR/commit 引用。
- **埋点悄悄变了。** 事件量的阶跃可能只是某个新事件开始记录了，不是用户行为变了。把爬升读成功能上线信号之前，先查同一窗口里有没有埋点相关的 PR。
- **schema 漂移。** 事件属性会演变。今天带类型 dbt 模型上的某一列，目标写的时候可能还不存在。更早的数据可能只在原始 `properties_json` 里带着这个属性。
- **dbt 刷新延迟。** `<your_analytics_db>.<schema>.*` 按计划重建（常常是每小时/每天）。最近几小时的事件，退到 `your_warehouse.events.*` 并按 `_id` 去重。
- **公司特有的表。** 实验、功能开关、计费、用量这几类表各不相同。从一张你从没确认过存在的表里报结果，是经典的翻车方式。先用 `SHOW TABLES` / `DESCRIBE TABLE` 探。
- **保留期悬崖。** 如果相关窗口早于表的保留期或 dbt 模型的创建日期，那是*缺口*，不是空结果。明确写出来，免得综合环节把"没结果"读成"没活动"。
- **notebook 查不了。** SQL MCP 看不到 Databricks notebook。如果你怀疑理由就在某个 notebook 里，返回一个缺口。

## 返回什么

对每条相关发现：
- 类型（产品事件 / 实验曝光 / 用量或计费事件 / 系统表行 / dbt 模型）
- 全限定表名，以及你实际跑的那条查询
- 查询的时间窗口
- 紧凑的数字摘要（计数、百分位、首次/最后出现时间戳）。**别倒原始行。**
- 与目标 ship 日期的时间相关性（例如"首行 2024-08-15，PR #49074 于 2024-08-14 合并"）
- 相关性 + 强度：直接 / 旁证 / 弱

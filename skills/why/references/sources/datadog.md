# Datadog 遥测

## 这个来源包含什么

Datadog 保存的是运行时记录，也就是生产环境里实际发生了什么，而不是计划了什么、讨论过什么。

- **指标。** 团队埋点出来的计数器、仪表、直方图。一个指标*存在*本身就是证据，说明有人觉得这个数字值得盯着。
- **监控与告警。** 团队认为值得把人叫醒的那些条件。一个在 `rate_limit_hit > 10/min` 上触发的监控，直接说明团队担心过这个阈值。
- **仪表盘。** 团队认为某个子系统重要的那些视图，经过挑选整理。
- **APM trace 与 span。** 请求级别的运行时数据，用来回答"这里为什么慢""这里为什么超时"这类问题。
- **日志。** 高吞吐的事件记录，常常包含促使代码加上防御性处理的那些错误条件。
- **事故。** 正式的事故记录，带时间线和关联的复盘文档。
- **Notebook。** 团队的探索性调查，常常带着假设和分析。

## 怎么搜

用 Datadog MCP。先放宽，再收窄。

1. **确定归属的服务。**

   ```
   search_datadog_services (filter by name or team)
   search_datadog_service_dependencies (see upstream/downstream)
   ```

2. **先看仪表盘和监控。**

   ```
   search_datadog_dashboards (query: feature name, service name, symbol)
   search_datadog_monitors   (same queries)
   ```

   当某个仪表盘或监控覆盖了目标，记下它的查询和被盯的阈值。阈值往往就是"这里为什么卡在 N"的答案。

3. **目标周边的指标。**

   ```
   search_datadog_metrics (by name pattern, e.g., the feature or symbol)
   get_datadog_metric_context (metadata: description, units, tags)
   get_datadog_metric (timeseries; "was there a spike around the PR date?")
   ```

   把指标的走势和目标的添加/修改日期对上，是很有力的佐证："`payment_timeout` 指标在 2023-11-03 出现尖峰，重试逻辑在 2023-11-06 合入。"

4. **日志。要收窄，不要倾倒。**

   ```
   search_datadog_logs (raw log patterns near the target, set use_log_patterns=true)
   analyze_datadog_logs (SQL-style aggregations, only when you need counts)
   ```

   用符号、错误字符串或功能名去搜。**强烈建议限定时间范围**（比如改动前后 30 天）。

5. **APM span 与 trace。**

   ```
   aggregate_spans    (stats: "how often does this endpoint fail?")
   search_datadog_spans (inspect individual spans)
   get_datadog_trace  (a specific trace ID)
   ```

   对超时、重试、慢路径、跨服务行为很有用。

6. **事故。**

   ```
   search_datadog_incidents (by title, team, date range)
   get_datadog_incident     (full detail for a specific incident)
   ```

   如果目标看起来是防御性的，就搜它被加入前后的事故。一个事故的时间线里写着"为 X 加了防御性检查"，那几乎是直接证据。

## 这里什么样的证据算好证据

- 一个监控，它的查询和阈值与代码强制的约束对得上（代码卡在 100，监控在请求超过 100/min 时告警）
- 一个由目标作者创建的仪表盘，其中的组件对应代码测量或防范的东西
- 一个指标，在代码合入前紧接着出现生产尖峰，之后数值平稳
- 一条事故记录，引用了目标代码、同样的符号或同样的错误字符串
- 日志里出现防御性代码本会拦下的那种具体错误模式，时间戳落在改动之前的窗口内

## 常见坑

- **相关不等于因果。** PR 之前有尖峰、之后平稳，这只能算提示，不能算定论，因为同一个窗口里可能还合入了别的改动。查一下相邻的 PR。
- **对你找到的那张图过拟合。** 一张图反映的是画图人的视角。一张叫"重试成功率"的图说明团队在意重试成功率，不说明某一行代码就是因为这个才存在。
- **消失的遥测。** 指标可能被改名、被删除，或者保留期很短。如果你找不到相关窗口的数据，那是一个缺口，不是空结果。
- **规模带来的噪声。** 日志搜索要按服务、标签、时间窗口狠狠收窄。用 `analyze_datadog_logs` 做聚合，而不是把原始日志倒出来。
- **有埋点不等于有因果。** 一个指标说明有人在意到愿意去测量，不说明代码是*因为*它才加上的。要和 commit/PR 日期交叉核对。

## 返回什么

对每一条相关内容：
- 类型（dashboard / monitor / metric / log pattern / trace / incident / notebook）
- 标题或名称
- 链接或标识（dashboard ID、monitor ID、指标名、incident ID）
- 负责人/作者，以及创建/修改日期
- 与问题相关的具体条件、查询或原文引用（尽量逐字）
- 相关性：这对目标代码说明了什么，关联有多强

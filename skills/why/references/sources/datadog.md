# Datadog 遥测

## 这个来源包含什么

Datadog 保存运行时记录，也就是生产环境里实际发生的事，而不是计划过或讨论过的事。

- **指标。** 团队埋点的计数器、仪表、直方图。一个指标的*存在*本身就是证据：有人认为这个数字值得盯。
- **监视器与告警。** 团队决定值得把人叫醒的条件。一个在 `rate_limit_hit > 10/min` 上触发的监视器，是团队担心这个阈值的直接证据。
- **仪表板。** 团队认为对一个子系统重要的东西，被整理成的视图。
- **APM 追踪与 span。** 请求级的运行时数据，用于“为什么这么慢”/“为什么这里会超时”这类问题。
- **日志。** 大容量的事件记录，常常保存着促使防御性代码出现的错误条件。
- **事故。** 正式的事故记录，带有时间线和链接的复盘。
- **Notebook。** 团队的探索性调查，常常带有假设和分析。

## 如何搜索

使用 Datadog MCP。先宽后窄。

1. **找出负责的服务。**

   ```
   search_datadog_services (filter by name or team)
   search_datadog_service_dependencies (see upstream/downstream)
   ```

2. **先看仪表板和监视器。**

   ```
   search_datadog_dashboards (query: feature name, service name, symbol)
   search_datadog_monitors   (same queries)
   ```

   当一个仪表板或监视器覆盖目标时，记下它的查询和被盯住的阈值。这个阈值常常就是“为什么这里被夹在 N？”的答案。

3. **目标周围的指标。**

   ```
   search_datadog_metrics (by name pattern, e.g., the feature or symbol)
   get_datadog_metric_context (metadata: description, units, tags)
   get_datadog_metric (timeseries; "was there a spike around the PR date?")
   ```

   把一个指标的轨迹和目标的添加/变更日期关联起来，是有力的支持证据：“`payment_timeout` 指标在 2023-11-03 飙升，重试逻辑在 2023-11-06 合并。”

4. **日志。收窄，不要倾倒。**

   ```
   search_datadog_logs (raw log patterns near the target, set use_log_patterns=true)
   analyze_datadog_logs (SQL-style aggregations, only when you need counts)
   ```

   用符号、错误字符串或功能名来搜索。**强烈优先使用有时间边界的查询**（例如变更前后各 30 天）。

5. **APM span 和追踪。**

   ```
   aggregate_spans    (stats: "how often does this endpoint fail?")
   search_datadog_spans (inspect individual spans)
   get_datadog_trace  (a specific trace ID)
   ```

   对超时、重试、慢路径和跨服务行为有用。

6. **事故。**

   ```
   search_datadog_incidents (by title, team, date range)
   get_datadog_incident     (full detail for a specific incident)
   ```

   如果目标看起来是防御性的，搜索它被加入前后的事故。一份时间线里写着 “added defensive check for X” 的事故，几乎是直接证据。

## 这里的好证据长什么样

- 一个监视器，它的查询和阈值匹配代码所强制的约束（代码夹到 100，监视器在请求超过 100/min 时告警）
- 一份由目标作者创建的仪表板，其中的组件对应代码所测量或所守卫的东西
- 一个指标，在代码合并之前立即出现生产飙升，之后数值稳定
- 一份事故记录，引用了目标代码、相同的符号或相同的错误字符串
- 日志显示防御性代码会阻止的某种错误模式，时间戳落在变更之前的窗口里

## 常见陷阱

- **相关不是因果。** PR 之前飙升、之后稳定，只是提示，不是定论，因为同一窗口里可能落地了其他改动。检查邻近的 PR。
- **过度拟合你找到的那张图。** 一张图反映的是制作者的框定。一张名叫 “retry success rate” 的图，是团队在乎重试成功率的证据，不是某一行代码存在的原因。
- **消失的遥测。** 指标可能被重命名、删除，或保留期很短。如果相关窗口的数据找不到，那是缺口，不是空结果。
- **规模上的噪声。** 积极地按服务、标签和时间窗口收窄日志搜索。用 `analyze_datadog_logs` 做聚合，而不是倾倒原始日志。
- **埋了点不等于由它引起。** 一个指标表明有人在乎到去测量某件事，并不表明代码是*因为*它才加上的。与提交/PR 日期交叉对照。

## 要返回什么

对每一项相关内容：
- 类型（dashboard / monitor / metric / log pattern / trace / incident / notebook）
- 标题或名字
- 链接或标识（dashboard ID、monitor ID、指标名、incident ID）
- 所有者/作者，以及创建/修改日期
- 与问题相关的具体条件、查询或引文（尽可能逐字）
- 相关性：这暗示了目标代码的什么，以及这种联系有多强

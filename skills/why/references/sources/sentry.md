# Sentry 错误历史

## 怎么搜

用 Sentry MCP。

1. **先摸清环境。** 如果你不知道 project slug 和 organization：

   ```
   find_organizations
   find_projects
   ```

2. **搜和目标相关的问题。**

   ```
   search_issues (natural language, e.g., "errors in PaymentService timeout", "unhandled exceptions in uploadFile")
   ```

   用目标处理的异常类名、它的函数或类名、它检查的错误消息字符串、它的文件路径来拼查询。

3. **按 release 和时间窗口收窄。**

   ```
   search_issue_events (filter by release, time, environment, trace ID, tags)
   get_issue_tag_values (for an issue, see distribution across versions, users, environments)
   ```

   对怀疑的问题，看 **first seen** 和 **last seen**（停止时间是否和目标的上线日期对得上？）、**受影响的 release**（哪些见过它，哪个是修复？）、**频率走势**（是不是先飙升，然后被解决？）。

4. **拉完整事件拿上下文。**

   ```
   get_sentry_resource (pass a Sentry URL or type+ID)
   ```

   堆栈跟踪是否经过目标代码？tags 和 breadcrumbs 是否匹配目标防御的那些条件？

5. **查目标附近落地的 release。**

   ```
   find_releases (around the commit date of the target)
   ```

   把 release 版本和 PR 的合并日期交叉对照。

6. **Seer 少用。**

   ```
   analyze_issue_with_seer
   ```

   Seer 的 AI 根因分析是假设生成器。把它当推断，别当权威。实际事件和堆栈跟踪才是主要证据。

## 返回什么

对每个相关问题：
- Issue ID 和标题
- Project 和 organization
- First seen / last seen 时间戳
- 事件数（以及采样率，如果知道）
- 受影响的 release
- 一段能体现与目标相关性的代表性堆栈跟踪片段（逐字摘录，不要总结）
- first/last-seen 与目标上线日期的相关性
- 指向该 issue 的链接
- 作者的评论或解决备注

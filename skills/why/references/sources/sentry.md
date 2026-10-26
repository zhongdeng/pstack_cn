# Sentry 错误历史

## 如何搜索

使用 Sentry MCP。

1. **定向。** 如果你不知道项目 slug 和组织：

   ```
   find_organizations
   find_projects
   ```

2. **搜索与目标相关的 issue。**

   ```
   search_issues (natural language, e.g., "errors in PaymentService timeout", "unhandled exceptions in uploadFile")
   ```

   用目标所处理的异常类名、它的函数或类名、它检查的错误消息字符串，以及它的文件路径来构造查询。

3. **按发布和时间窗口收窄。**

   ```
   search_issue_events (filter by release, time, environment, trace ID, tags)
   get_issue_tag_values (for an issue, see distribution across versions, users, environments)
   ```

   对一个可疑的 issue，检查 **first seen** 和 **last seen**（停止的时间是否与目标的发布日期对齐？）、**affected releases**（哪些发布看见了它，哪一个是修复？），以及 **frequency trajectory**（它是先飙升然后被解决的吗？）。

4. **拉取完整事件以获得上下文。**

   ```
   get_sentry_resource (pass a Sentry URL or type+ID)
   ```

   堆栈是否经过目标代码？标签和面包屑是否匹配目标所防御的条件？

5. **检查落在目标附近的发布。**

   ```
   find_releases (around the commit date of the target)
   ```

   把发布版本和 PR 的合并日期交叉对照。

6. **节制地使用 Seer。**

   ```
   analyze_issue_with_seer
   ```

   Seer 的 AI 根因分析是假设生成器。把它们当作推断，而不是权威。真正的事件和堆栈才是首要证据。

## 要返回什么

对每一个相关 issue：
- Issue ID 和标题
- 项目和组织
- First seen / last seen 时间戳
- 事件数量（以及已知的采样率）
- 受影响的发布
- 一段有代表性的堆栈摘录，表明它与目标相关（逐字摘录，不要摘要）
- first/last seen 与目标发布日期的相关性
- 指向该 issue 的链接
- 任何作者评论或解决说明

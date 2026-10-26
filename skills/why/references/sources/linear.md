# Linear 工单

## 这个来源包含什么

- 描述功能、bug 及其动机的 issue
- 附在 issue 上的项目文档（常常是 PRD 或规格）
- 父/子 issue 关系（更广的计划 → 具体工单）
- issue 上的评论（澄清、范围变化、“我们为什么做这个”的理由）
- 标签（例如 `compliance`、`customer-request`、`perf`），它们标出动机的类型
- 解释范围变化的状态更新
- 附件和链接的 GitHub PR

Linear 常常是产品/业务上下文所在的地方：“我们做这个是因为客户 X 提出了要求”，或“这是为了 Q3 合规计划”那一层。

## 如何搜索

使用 Linear MCP。

1. **从已链接的工单开始。** 如果种子提交或 PR 引用了工单 ID（例如 `ENG-1234`、`[BUG-567]`），先用 `get_issue` 把它们取回来。读完整的 issue，包括评论。
2. **按关键词列出相关 issue。** 用 `list_issues` 对功能名、关键符号或业务术语做文本搜索。多试几种说法。
3. **沿着 issue 树走。** 如果落在一个子 issue 上，就取它的父级。子 issue 是战术性的。父级常常带着“为什么”。
4. **读项目文档。** 如果 issue 属于一个项目，用 `get_project` 并检查附件文档。项目级文档最常记下规格和理由。
5. **检查标签和里程碑。** 标签暗示动机的类别（customer-request、incident-followup、compliance）。里程碑把工作系到截止日期上，而截止日期常常揭示动机。

## 这里的好证据长什么样

- 一份陈述业务问题的 issue 描述：“Customer Acme needs X because of their SOC2 audit”
- 一条记下决定的评论：“We decided to go with approach B because approach A would require touching the billing service”
- 一个标题像计划的父 issue：“Q3 Enterprise Readiness” 或 “Reduce Payment Failures”
- 一份附上的 PRD 或规格
- 像 `customer:acme`、`incident-followup`、`compliance`、`perf-regression` 这样的标签

## 常见陷阱

- **范围漂移。** PR 引用的工单可能被关闭后又以不同范围重新打开。读完整段历史。
- **机械的模板。** 有些团队要求“Why”一节，但填的是套话。泛泛的文字（“improve user experience”）多半不是真正的答案。
- **过期的工单。** 旧工单常常反映一个已经变了的计划版本。核对日期，并与代码的发布日期交叉对照。
- **以重复关闭的链条。** 沿着 duplicate-of 关系追回那张权威工单。
- **私有工作区内容。** 如果一个 issue 你访问不了，把这记成缺口，不要猜。

## 要返回什么

对每一张相关工单：
- 工单 ID 和标题
- 从描述或评论里引用的问题/动机（不要改述。综合者需要原文来引用）
- 标签、父 issue、项目
- 作者、创建日期、关闭日期
- 如果有，指向工单的链接

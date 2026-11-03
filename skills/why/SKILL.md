---
name: why
description: "用于 '为什么 X 要这么做'、'为什么我们选了 Y'、设计理由、回归、复盘，或有数据支撑的阈值。先发现可用的 MCP，再并行查询每一类证据（源码管理、issue 跟踪、长文档、实时聊天、基础设施可观测性、错误跟踪、产品分析数仓），然后返回一份带引用的决策与权衡解读。运行时行为请用 how。"
disable-model-invocation: true
---

# Why

调查代码背后的动机和意图。配套的 `how` 技能回答代码做了什么、怎么运作。`why` 回答是什么力量把它塑造成了现在这样。

下面每一次 spawn 都对应 `pstack-models.mdc` 规则里的一行角色和一个默认值。把 `model` 设成那一行的值；如果规则或那一行缺失，就用默认值。当值是 `auto` 或 `inherit-parent` 时，不要设 `model`。如果 Task 工具拒绝某个 slug，就用默认值并说明这一点。如果它连默认值也拒绝，就从它的报错信息里挑同一家族里最接近的合法 slug。按 **poteto-mode** 技能的 Subagents 一节，为每个子智能体挑选推理级别和 fast 或 standard 速度。

每次 spawn 都是 `generalPurpose`，`readonly: false`（agent 模式）。**不要用 readonly/Ask 模式。** 它会剥掉 MCP 访问权限，从而让依赖 MCP 的调查员和综合者的引用抽查都失效。调查员仍然不应该写任何东西。

## 工作姿态

以**谨慎、小心、精确的调查员**身份工作。对你确知的和你在推断的，要诚实区分。完整的置信度框架和措辞指南见 `references/epistemics.md`。综合者必须遵守它。

## 第 1 步：理解目标和问题

**目标**通常是一段代码、一个模式、一个功能，或一个命名的设计决策。**问题**通常是设计理由、权衡、促成它的边界情况、外部约束、死代码，或一次大范围的历史梳理。

如果目标很模糊（"为什么我们要这么做？"却没有明确所指），就从对话上下文里做最好的猜测（打开的文件、最近的编辑、光标位置、刚讨论过的内容）。简短说明你的理解，让用户能纠正，然后继续。

## 第 2 步：建立代码锚点

在 spawn 调查员之前，先就地搭好种子上下文：文件路径和行范围、关键符号（函数、类、常量）、最近几次触及目标的提交、合并提交里的 PR 编号（主题行里的 `(#1234)` 模式），以及任何关联的工单 ID。运行 `git blame -L <start>,<end> <file>` 拿最后触及的提交，`git log --follow -p -- <file>` 拿穿越重命名的完整历史和补丁，`git log --oneline -20 -- <file>` 看带 PR 编号的近期提交，`git log -1 --format=%B <commit>` 提取 PR 编号。然后为任何有实质内容的提交拉取 PR 正文和讨论：`gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews`。这个锚点会发给每个调查员和综合者。

## 第 3 步：并行 spawn 调查员

**默认做完整的并行调查。** 目标是完整的覆盖图，不是最小覆盖。把空结果记录下来，不要跳过搜索。

### 发现

在 spawn 调查员之前，从 Cursor 环境里列出可用的 MCP。有可用工具映射就用它。否则检查 Cursor 暴露的 `mcps/` 目录，看哪些 MCP 服务器已启用。

把每个可用的 MCP 映射到一类证据：

1. 源码管理历史
2. Issue / 工单跟踪
3. 长文档
4. 实时团队聊天
5. 基础设施可观测性
6. 错误 / 异常跟踪
7. 产品分析数仓

源码管理总是可以通过 git 和 `gh` 拿到。其余六类，用 MCP 名称、服务器说明、工具名和资源描述来分类。如果一个 MCP 能对上不止一类，选匹配它主要证据的那一类。把有歧义的情况记进覆盖图。

每一类只要有匹配的 MCP，就 spawn 一个调查员，全部放在同一条消息里让它们并发运行，每个只负责一个工具或 MCP。不要让一个智能体覆盖多个 MCP。`model`：`why investigators` 那一行，默认 `grok-4.7-xhigh-fast`。

每个调查员的提示词是填好的 `references/investigator-prompt.md`，再加上：
- 所选 MCP 对应的类别作战手册 `references/sources/<source>.md`，从 `references/source-playbook.md` 里的示例改编
- `references/sources/incident-postmortem.md`，**如果目标代码看起来是防御性的**（空值检查、重试逻辑、超时处理、限流、功能开关、出口防护、OOM 处理）
- 代码锚点和用户的原始问题

### 调查员名单，每个可用的证据类别一个

下面每一类都独特地适合揭示某一种"为什么"，写在"最擅长"之后。用它来预判会拿回什么、在某类返回空时指出缺口，以及只在极少数可证明无关的情况下用来论证跳过。

1. **源码管理**（git 历史、用 `gh` 查 PR、代码注释、测试）。总是 spawn，唯一有保证的来源。最擅长*评审过程中记录下来的实现期理由*。
2. **Issue / 工单跟踪**（例如 Linear、Jira、GitHub Issues、Plane、Shortcut MCP）。最擅长*产品或业务的驱动因素*。当"为什么"在工程之外时最强。
3. **长文档**（例如 Notion、Confluence、Google Docs、Coda MCP）。最擅长*长篇设计理由*，在变成代码之前就写下来的那种。
4. **实时团队聊天**（例如 Slack、Discord、Microsoft Teams、Mattermost MCP）。最擅长*从未落到文档里的实时讨论*。当源码管理、工单和文档的纸面痕迹都很薄时尤其重要。
5. **基础设施可观测性**（例如 Datadog、New Relic、Honeycomb、Grafana、Splunk MCP）。最擅长*促成这段代码的基础设施和运行时现实*。当目标是在响应某个基础设施信号（超时、重试、限流、熔断）时最强。
6. **错误 / 异常跟踪**（例如 Sentry、Rollbar、Bugsnag、Airbrake MCP）。最擅长*促成防御性或纠正性代码的那些具体异常和错误轨迹*。对 catch 块、空值防护、类型检查、重试和其他防御措施最强。
7. **产品分析数仓**（例如 Databricks、Snowflake、BigQuery、ClickHouse、dbt、Redshift MCP）。最擅长*塑造了代码的产品和数据现实*。对开关控制的代码、实验驱动的发布、数据迁移和"这个数字从哪来"的问题最强。

### 什么时候跳过某个调查员

只有在有**明确、写下来的理由**、并且写进最终 Sources Consulted 时才可以。两个正当理由：

- **这个环境里该类别没有可用的 MCP**。把它标成缺口，不是选择："Real-time team chat skipped. No matching MCP available, so the conversational record was not searchable."
- **该来源可证明无关**，不是"大概无关"。门槛很高："Error / exception tracking skipped. Target is a build-time script with no runtime code path."

如果你的范围评估表明这是一个单次提交的琐碎目标、PR 描述里已经包含完整答案，你可以就地回答，**但前提是**先确认全部七个可用类别的搜索都会是多余的。要明确说出来。这种情况应该很少。

## 第 4 步：综合

Spawn 一个综合者。`model`：`why synthesizer` 那一行，默认 `claude-opus-5-5-xhigh`。它拿到：
1. 调查员的发现，包括任何空结果和任何带理由跳过的类别
2. 代码锚点
3. 用户的原始问题
4. `references/epistemics.md` 里的认识论框架
5. `references/synthesizer-prompt.md` 里的综合者提示词模板

## 第 5 步：呈现

把综合者的输出呈现给用户。你可以为了清晰做轻微编辑，或补充对话里的上下文，但**不要改写置信度措辞**。

## 输出格式

结构就是 `references/synthesizer-prompt.md` 里的那套：The Question、The Code in Question、What We Found、What We Can Reasonably Infer、Competing Hypotheses、What We Don't Know、Sources Consulted、Confidence Summary。按需调整，但保持置信度分层完整，Sources Consulted 保持每个调查员一行，包括那些什么都没返回或被跳过的，并附上原因。

在 Sources Consulted 之后，如果用户的 `why` 问题是要改这段代码的前奏，就把沿革发现转成 Preserve / Change / Avoid / Risk 约束集，用来规划这次改动。

## 要避免的常见失败模式

- **近因偏误**。假定最近的提交就是权威。当前的形态往往是许多更早决策层层累积的结果。往回追。

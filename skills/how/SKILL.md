---
name: how
description: "用于「X 是怎么工作的」、改动前的代码走读，以及放置 / 归属 / 分层问题（「这个应该放哪」「这个归哪个包」「这是不是正确的层」）。讲子系统架构、运行时流程、上手心智模型。动机问题用 why。"
disable-model-invocation: true
---

# How

探索代码库，回答「X 是怎么工作的」这类问题。产出的架构讲解要达到这样的水平：一个资深工程师刚接手某个子系统时能看懂，够他建立可用的心智模型，但不会多到读起来像带注释的源码。

每次 spawn 都是一个 Task 子智能体，`subagent_type: generalPurpose`，`readonly: true`。探索者用 `pstack-models.mdc` 规则里的 `how explorer` 那一行（默认 `grok-4.7-xhigh-fast`），每个讲解者用 `how explainer` 那一行（默认 `claude-opus-5-5-xhigh`）。把 `model` 设成那一行的值；如果规则或那一行缺失，就设成默认值。当值是 `auto` 或 `inherit-parent` 时，不要设 `model`。如果 Task 工具拒绝某个 slug，就用默认值，并说明这一点。如果它连默认值也拒绝，就从它的报错信息里挑同一家族里最接近的合法 slug。按 **poteto-mode** 技能的 Subagents 一节，为每个子智能体挑选推理档位和 fast 或 standard 速度。

## 1. 评估复杂度

如果范围不明确，先说出你的理解，再去探索。用户可以纠正你。

- **简单**（单个模块、一个小工具、一个很窄的问题，比如「函数 X 是怎么工作的」）：不要探索者。spawn 一个讲解者，一趟里既探索又讲解，基于 `references/explainer-prompt.md` 构建，去掉 explorer-findings 那一节。跳到第 4 步。
- **复杂**（跨多个文件或服务的子系统、横切特性、完整的架构概览）：进入第 2 步。

拿不准时，走简单那条路。

## 2. 探索（仅复杂情况）

把问题拆成 2 到 4 个角度，每个角度是子系统的一个独立切片。在一条消息里 spawn 所有探索者，每个都带上 `references/explorer-prompt.md`，并填好它负责的角度。

## 3. 综合（仅复杂情况）

所有探索者都返回后，spawn 一个讲解者，带上 `references/explainer-prompt.md`，并把每个探索者的发现都填进去。

## 4. 呈现

呈现讲解者的输出。为了清晰或补充对话里的上下文，做点轻度编辑没问题。不要大幅重写。

## 输出格式

讲解使用 `references/explainer-prompt.md` 里定义的各节，不适用的节直接去掉：Overview、Key Concepts、How It Works、Where Things Live、Gotchas。

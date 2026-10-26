---
name: how
description: "用于「X 是怎么工作的」、改东西之前的代码走读，以及放置 / 所有权 / 分层问题（「这个该住在哪」、「哪个包拥有它」、「这一层对不对」）。解释子系统架构、运行时流程和上手用的心智模型。问动机时用 why。"
disable-model-invocation: true
---

# 如何

探索代码库，回答「X 是怎么工作的？」这类问题。架构说明写到资深工程师接手一个子系统时的那个层次：够建立起能用的心智模型，不要多到读起来像带注释的源码。

每一次拉起都是一个 Task 子 agent，`subagent_type: generalPurpose`，`readonly: true`。Explorer 使用 `pstack-models.mdc` 规则里的 `how explorer` 那一行（默认 `grok-4.7-xhigh-fast`），每个 explainer 使用 `how explainer` 那一行（默认 `claude-opus-5-5-xhigh`）。把 `model` 设成那一行的值；规则或那一行缺失时，设成默认值。值是 `auto` 或 `inherit-parent` 时，不要设置 `model`。如果 Task 工具拒绝了某个 slug，就用默认值并说明。如果它拒绝了默认值，就用报错信息里同一家族最接近的合法 slug。按 **poteto-mode** skill 的 Subagents 一节，为这项工作给每个子 agent 选定推理档位，以及 fast 或 standard 速度。

## 1. 评估复杂度

范围含糊就说出你的理解，然后探索。用户可以改方向。

- **简单**（单个模块、一个小工具、一个窄问题，比如「函数 X 是怎么工作的」）：不要 explorer。拉起一个 explainer，一轮里既探索又讲解，用 `references/explainer-prompt.md` 来构建，但不包含 explorer 发现那一节。转到第 4 步。
- **复杂**（一个跨多个文件或服务的子系统、一个横切功能、一份完整的架构概览）：转到第 2 步。

拿不准时，走简单那条。

## 2. 探索（仅复杂情况）

把问题拆成 2 到 4 个角度，每个角度是子系统的一片不同切面。在一条消息里拉起全部 explorer，每个都带上 `references/explorer-prompt.md`，并填好它的角度。

## 3. 综合（仅复杂情况）

全部 explorer 返回之后，拉起一个 explainer，带上 `references/explainer-prompt.md`，并填入每个 explorer 的发现。

## 4. 呈现

呈现 explainer 的产出。为了清晰、或为了补上对话里的上下文而做轻量编辑是可以的。不要大幅重写。

## 输出格式

说明使用 `references/explainer-prompt.md` 里定义的各节，丢掉不适用的：概述、关键概念、它如何工作、东西放在哪里、易错点。

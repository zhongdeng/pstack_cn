---
name: swarm
description: "并行铺开 N 个 worker，全部收完，返回一份报告。用于 /swarm、'swarm this'，以及并行覆盖、竞速、车轮战和探索。"
disable-model-invocation: true
---

# Swarm

## 开始

在启动任何东西之前，先开一个 todolist，每个阶段一条。

1. 框定
2. 铺开
3. 汇总
4. 报告

## 阶段 A：框定

1. 说清完成判据，以及 swarm 必须返回的产物或报告。
2. 选形状。切成切片、让 N 个 worker 用相同 brief 竞速，或者两者混用。竞速或混用时，在 spawn 之前先声明 `first pass`、`rank all` 还是 `best-of`。
3. 从 `~/.cursor/rules/pstack-models.mdc` 里的 `swarm workers` 那一行选 worker 模型。如果规则或那一行缺失，用 `grok-4.7-xhigh-fast`。`auto` 或 `inherit-parent` 时省略 `model`，让 worker 跑在父模型上。如果 Task 工具拒绝某个 slug，用默认值，并说明这一点。如果它连默认值也拒绝，就从它的报错信息里挑同族最接近的合法 slug。模型竞速时，提前给每一路命名模型。按 **poteto-mode** 技能的 Subagents 一节，为每个子智能体选定推理级别和 fast 或 standard 速度。
4. worker 要写东西时，给它各自可写的输出位置。worker 验证或测量提交时，每份 brief 都要点名确切的 SHA。测量类 brief 还要点名方法（采样数、一个样本是什么、顺序）。worker 在结果里把这两样都记下来。

## 阶段 B：铺开

在一条消息里 spawn 全部 N 个 worker，用 `subagent_type: generalPurpose`、`environment: "cloud"`、`run_in_background: true`，以及第 3 步选定的模型，`auto` 或 `inherit-parent` 时留空。只有当 worker 需要访问用户电脑上的东西时，才用 `environment: "local"`。

worker 必须从非默认的已推送分支起步时，传 `cloud_base_branch`。

每份 brief 都独立成立。写清目标、范围、确切的切片或竞速路数、怎么验证、报告什么。报告用 `PASS`、`ISSUES` 或 `BLOCKED`，并附证据。能证明缺陷的 worker 报 `ISSUES`，并列出它能证明的每一个问题，不只是第一个。

如果有 worker 掉队，用 N-1 继续，并注明。

## 阶段 C：汇总

读终态结果。丢掉没有记录 brief 点名的那几个 SHA 和方法的结果，并把这个 worker 重新 spawn 一次。第二次还缺，就记一个缺口。缺口不算通过。覆盖类任务，每个必需的切片都要有结果。竞速类任务，套用提前声明的选择规则。用 first pass、rank all 或 best-of。不要粘贴 worker 的原始输出。

## 阶段 D：报告

返回一份合并后的对话内报告，包含结果表、问题一句话摘要、缺口或掉队情况，以及用到的竞速规则。

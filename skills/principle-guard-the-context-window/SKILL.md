---
name: principle-guard-the-context-window
description: "上下文快满时用：大输出、长文件、反复读取、fan-out 规划。把批量工作交给子智能体，主线程只留摘要，不留原始数据。"
disable-model-invocation: true
---

# 守住上下文窗口

**为什么：** 上下文溢出会拉低推理质量，产生压缩失真，还会让进度卡住。

**做法：**
- **给阶段定规模，给范围设上限。** 限制每个阶段读多少文件，设定轮次预算，把机制本身的开销算进去。

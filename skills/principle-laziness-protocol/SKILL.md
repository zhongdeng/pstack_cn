---
name: principle-laziness-protocol
description: "重构、评估 diff 大小，或忍不住要加抽象、分层、信号透传时使用。偏向删除，以及能解决问题的最小改动。"
disable-model-invocation: true
---

# 懒惰协议

- **把决策收拢到一处。** 不要在多个地方重复同一个选择。把它放到单一事实来源后面，再把结果当作一个简单标志传下去。
- **把 diff 缩到最小。** 做能解决问题的最小改动。更少的行，好过“优雅”的样板代码。

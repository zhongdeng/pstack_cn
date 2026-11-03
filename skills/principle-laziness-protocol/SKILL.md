---
name: principle-laziness-protocol
description: "在重构、评估 diff 大小，或者忍不住想加抽象、加层、加信号透传时应用。偏向删除，偏向能解决问题的最小改动。"
disable-model-invocation: true
---

# 偷懒协议

- **把决策收拢到一处。** 别在好几个地方重复同一个选择。把它放到单一事实来源后面，把结果当成一个简单的 flag 传下去。
- **把 diff 压到最小。** 用能解决问题的最小改动。行数少胜过"优雅"的样板代码。

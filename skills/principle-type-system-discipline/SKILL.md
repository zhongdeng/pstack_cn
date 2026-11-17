---
name: principle-type-system-discipline
description: "设计类型、审阅函数签名，或用任何静态类型语言写代码时使用。让非法状态无法表示，给语义原语打上品牌，在边界解析外部数据，穷尽变体，从权威 schema 推导。"
disable-model-invocation: true
---

# 类型系统纪律

让编译器拒绝不可能的状态、对不上的原语，以及没处理的变体。

- **给语义原语打上品牌。** 两个参数底层是同一种原语、意思却不同时，各给一个自己的类型。创建时校验一次。
- **外部数据在解析之前是无类型的。** JSON、RPC 载荷、CLI 参数、配置、环境变量和数据库行，都经过边界上的解析函数，返回带类型的模型。
- **从权威 schema 推导类型。** 形状由一份 schema 文件拥有时，从它推导类型，不要手写一份平行的。

TypeScript 语法见 **typescript-best-practices** 技能。

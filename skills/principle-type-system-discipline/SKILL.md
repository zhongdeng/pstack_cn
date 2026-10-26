---
name: principle-type-system-discipline
description: "设计类型、审阅函数签名，或用任何静态类型语言写代码时使用。让非法状态无法表示，给语义原语打上品牌，在边界解析外部数据，穷尽变体，从权威 schema 推导。"
disable-model-invocation: true
---

# 类型系统纪律

让编译器拒绝不可能的状态、对不上的原语，以及未处理的变体。宁可把错误和特殊情况定义到不存在，也不要增殖处理器。TypeScript 语法见 `typescript-best-practices` 技能。

- **给语义原语打上品牌。** `UserId` 和 `OrderId` 底下都是字符串，但不应当可以互换。给每一个自己的类型，例如 TypeScript 里的品牌交叉类型，或其他语言里的 newtype。创建时校验一次，下游信任这个类型。如果两个参数共享同一种原语类型但意思不同，就给它们打上品牌。
- **外部数据在解析之前是无类型的。** RPC 载荷、JSON、IPC 消息、CLI 参数、配置文件、环境变量、数据库行。在每个边界放一个解析函数，把非结构化输入变成类型化模型。**boundary-discipline** 原则技能说明校验该放在哪里。
- **从权威 schema 推导类型。** 当 protocol buffer、OpenAPI spec、GraphQL schema、数据库迁移、设计令牌文件或其他文件拥有一个形状时，从它推导，而不是手写一个平行类型。见 **encode-lessons-in-structure** 原则技能。

---
name: principle-type-system-discipline
description: "在设计类型、审查函数签名,或用任何静态类型语言写代码时应用。让非法状态无法表示,给语义化基础类型打上品牌标记,在边界处解析外部数据,穷尽变体,从权威 schema 派生。"
disable-model-invocation: true
---

# 类型系统纪律

让编译器拒绝不可能的状态、不匹配的基础类型和未处理的变体。优先把错误和特殊情况定义成不存在,而不是不断增加处理分支。TypeScript 语法见 `typescript-best-practices` 技能。

- **给语义化基础类型打上品牌标记。** `UserId` 和 `OrderId` 底层都是字符串,但不应该能互换。给每个类型各自的类型,比如 TypeScript 里的 branded intersection,或者其他语言里的 newtype。在创建时校验一次,下游信任这个类型。如果两个参数共享同一个基础类型但含义不同,就给它们打上品牌标记。
- **外部数据在解析之前都是无类型的。** RPC payload、JSON、IPC 消息、CLI 参数、配置文件、环境变量、数据库行。在每个边界处放一个解析函数,把非结构化输入变成类型化模型。**boundary-discipline** 原则技能说明了校验该放在哪里。
- **从权威 schema 派生类型。** 当 protocol buffer、OpenAPI spec、GraphQL schema、数据库迁移、design-token 文件或其他文件拥有某个形状时,从它派生,而不是手写一个平行的类型。见 **encode-lessons-in-structure** 原则技能。

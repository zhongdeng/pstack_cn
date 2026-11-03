---
name: typescript-best-practices
description: TypeScript 最佳实践。在读取或编辑任何 .ts 或 .tsx 文件时使用。
paths: ["**/*.ts", "**/*.tsx"]
disable-model-invocation: true
---

# TypeScript 最佳实践

先应用 **type-system-discipline** 原则技能。

| 规则 | 摘要 |
|------|---------|
| 可辨识联合 | 用 `kind` 字面量判别字段来建模各个变体，让不可能的状态无法被表示。不要用一堆可选字段拼成一个对象。 |
| 品牌类型 | 用 `& { readonly __brand: "X" }` 给基础类型打上品牌，避免它们被混用。在边界处校验一次。品牌来自能真正校验的类型守卫（`input is AgentId`），绝不来自 `as`。 |
| 构造式建模 | 把形状设计成非法值根本构造不出来。非空用 `[T, ...T[]]`，偶数长度用 `[T, T][]`，区间用 `start` 加 `duration`。这不是运行时守卫，也不是指望细化类型。 |
| 最简单的全函数类型 | 只要对 T[] 的每个操作都保持全函数，就继续用 `T[]`。只有当宽松类型逼出 `!`、类型转换或"不该发生"的抛错时，才收紧成 `NonEmpty<T>`。 |
| `unknown` 优于 `any` | 外部数据一律是 `unknown`。 |
| schema 先于守卫 | 在手动逐属性写类型守卫之前，先用仓库里的运行时 schema 库，从 schema 推断类型，比如 `z.infer`。 |
| 不用 `as` 类型转换 | 每个 `as` 都是一次迟早要来的运行时崩溃。只在校验之后才转换。 |
| 收窄层级 | 判别字段 switch > `in` 运算符 > `typeof`/`instanceof` > 用户定义类型守卫 > `as`。 |
| 类型守卫 | 必须真正校验所声称的东西。说谎的守卫比 `as` 更糟，因为 bug 藏在一个声称安全的名字后面。命名为 `isX` 或 `hasX`。 |
| 穷尽性 | 在 default 分支里内联 `const _exhaustive: never = x;`，这样新增变体时编译器会报错。 |
| `satisfies` 优于 `as` | 校验值，同时不收窄字面量类型。 |
| 边界校验 | 在数据进入的地方解析，转成有名字的领域类型。`Record<string, unknown>`（无论怎么拼写）止步于那次解析。内部信任类型。见 **boundary-discipline** 原则技能。 |
| 从 schema 派生类型 | 在声明新 interface 之前，先用 `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof`。 |
| 对象参数 | 传对象，不传位置参数，这样参数顺序本身就说明含义。热路径上跳过（逐帧渲染、分词器、解析器）。 |
| 真实测试 | 能跑的就别 mock。优先用框架真实的测试原语，配合泄漏/可释放检查，并在运行中的构建里验证 UI。只 mock 本地跑不起来的东西。 |
| 结构化遥测 | 优先用结构化日志诊断，带上足够上下文，能凭一个 id 就调试。发布代码里不要有 `console.log`。 |

示例：`references/patterns.md`。

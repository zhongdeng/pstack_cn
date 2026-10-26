---
name: typescript-best-practices
description: TypeScript 最佳实践。阅读或编辑任何 .ts 或 .tsx 文件时使用。
paths: ["**/*.ts", "**/*.tsx"]
disable-model-invocation: true
---

# TypeScript 最佳实践

先应用 **type-system-discipline** 原则技能。

| 规则 | 摘要 |
|------|---------|
| 可区分联合 | 用一个 `kind` 字面量判别式来建模变体，使不可能的状态无法表示。不要用一袋可选字段。 |
| 品牌类型 | 用 `& { readonly __brand: "X" }` 给原语打上品牌，使它们不会被混用。在边界校验一次。品牌来自一个做了验证的类型守卫（`input is AgentId`），绝不要来自 `as`。 |
| 构造式建模 | 把形状建成非法值无法被构造出来。非空用 `[T, ...T[]]`，偶数长度用 `[T, T][]`，区间用 `start` 加 `duration`。不是运行时守卫，也不是对细化类型的愿望。 |
| 最简单的全函数类型 | 只要其上的每个操作都保持全函数，就继续用 `T[]`。只有松散类型迫使你用 `!`、断言，或抛出一个“不该发生”时，才收紧成 `NonEmpty<T>`。 |
| `unknown` 优于 `any` | 外部数据是 `unknown`。 |
| schema 先于守卫 | 在手写逐属性的类型守卫之前，使用仓库的运行时 schema 库，并从 schema 推导类型，例如 `z.infer`。 |
| 不要 `as` 断言 | 每一个 `as` 都是一次等待发生的运行时崩溃。只在校验之后断言。 |
| 收窄的层次 | 判别式 switch > `in` 运算符 > `typeof`/`instanceof` > 用户定义的类型守卫 > `as`。 |
| 类型守卫 | 必须验证它的主张。一个说谎的守卫比 `as` 更糟，因为 bug 藏在一个声称安全的名字后面。把它们命名为 `isX` 或 `hasX`。 |
| 穷尽性 | 在 default 分支里内联 `const _exhaustive: never = x;`，这样新增变体时编译器会报错。 |
| `satisfies` 优于 `as` | 校验值，同时不放宽字面量类型。 |
| 边界校验 | 在数据进入的地方解析，进入一个有名字的领域类型。`Record<string, unknown>`（无论怎么拼写）停在那次解析。内部信任类型。见 **boundary-discipline** 原则技能。 |
| 从 schema 推导的类型 | 在声明新接口之前，先用 `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof`。 |
| 对象参数 | 传对象，不传位置参数，这样参数顺序自己就能说明自己。热路径上跳过（逐帧渲染、分词器、解析器）。 |
| 真实测试 | 能跑的东西不要模拟。优先使用框架真正的测试原语，并做泄漏和 disposable 检查，在正在运行的构建里验证 UI。只模拟你无法在本地运行的东西。 |
| 结构化遥测 | 优先使用带有足够上下文、能凭一个 id 调试的结构化日志诊断。交付的代码里不要 `console.log`。 |

示例：`references/patterns.md`。

# TypeScript 模式

`SKILL.md` 里每条规则的代码示例。底层原则与语言无关。参见 **type-system-discipline** 和 **boundary-discipline** 原则技能。

## 品牌类型

给原始类型打上品牌，让它们没法互相混用。在边界处校验一次。下游代码直接信任这个类型。

```ts
type AgentId = string & { readonly __brand: "AgentId" };

function isAgentId(input: string): input is AgentId {
  return isUUID(input);
}

function parseAgentId(input: string): AgentId {
  if (!isAgentId(input)) throw new Error(`Invalid agent id: ${input}`);
  return input;
}

function focusAgent(id: AgentId): void {
  /* input is trusted */
}
```

照着 `readonly __brand: 'X'` 这个形状来。别自己发明新约定。

## 可辨识联合

用字面量判别字段来建模各个变体。每个变体共用同一个字段名，且每个变体的值都唯一，所以不可能的组合根本表示不出来。

```ts
// Don't. Boolean + optionals lets contradictory states exist.
type DiffState = { loading: boolean; diff?: GitDiff; error?: string };

// Do. Only valid states exist.
type DiffState =
  | { kind: "loading" }
  | { kind: "ready"; diff: GitDiff }
  | { kind: "error"; error: string };
```

挑一个判别字段名（`kind`、`type`、`tag`），然后一直用它。

## 构造式建模

用全都合法的部件把类型拼出来，而不是拿运行时检查去限制一个宽松类型。

非空，用可变元组：

```ts
type NonEmpty<T> = [T, ...T[]];

// Don't: T[] plus a length check every caller must repeat
function pickWinner(entries: string[]): string {
  if (entries.length === 0) throw new Error("no entries");
  return entries[Math.floor(Math.random() * entries.length)];
}

// Do: an empty value of the type can't exist
function pickWinner(entries: NonEmpty<string>): string {
  return entries[Math.floor(Math.random() * entries.length)];
}
```

如果传进来的是普通 `T[]`，用守卫收窄一次。这个事实之后就跟着类型一起走：

```ts
const isNonEmpty = <T>(arr: T[]): arr is NonEmpty<T> => arr.length > 0;
```

偶数长度，用成对：

```ts
type Pairs<T> = [T, T][];
```

时间范围，用起点加时长：

```ts
// Don't: a comment holds the invariant
type TimeRange = { start: Date; end: Date }; // start <= end

// Do: a negative range can't be written; derive end when needed
type TimeRange = { start: Date; durationMs: number };
```

`durationMs` 保持普通 number。只有当原始 number 可能被传到本该是时长的地方时才给它打品牌（见品牌类型），别条件反射地打。选那种让坏状态构造不出来的表示，然后在上面暴露你需要的读法（`pairs.flat()`、一个 `rangeEnd()` 辅助函数）。

## 最简全函数类型

别什么都加强。当每个操作都是全函数时，就保留 `T[]`：

```ts
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0); // [] is 0, fine
```

当宽松类型逼得使用处不得不说谎时才加强。信号是 `!`、`arr[0] as T`，以及一个"不该发生"的 throw：

```ts
// Don't: partiality smuggled past the compiler
function newestSession(sessions: Session[]): Session {
  return sessions.at(0)!;
}

// Do: strengthen the input; the assertion disappears
function newestSession(sessions: NonEmpty<Session>): Session {
  return sessions[0];
}
```

把返回值弱化成 `Session | undefined` 是另一种全函数签名。

## 用 `unknown` 而不是 `any`

外部数据永远是 `unknown`。用之前先收窄。

```ts
// Don't
function handle(input: any) {
  return input.foo.bar;
}

// Do
function handle(input: unknown) {
  if (typeof input === "object" && input !== null && "foo" in input) {
    // narrowed; compiler verifies access
  }
}
```

外部来源包括 RPC 载荷、`JSON.parse`、`postMessage`、IPC、文件内容、环境变量、数据库结果。

## 先看 schema，再手写守卫

给外部数据写逐属性的类型守卫之前，先找仓库里的运行时 schema 库和已有的 schema。让一个 schema 独占校验，并从它推导出 TypeScript 类型。别同时维护一个 schema、一个重复的 interface 和一个会跟它们漂移的守卫。

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["admin", "member"]),
});

type User = z.infer<typeof UserSchema>;

function parseUser(input: unknown): User {
  return UserSchema.parse(input);
}
```

失败是预期分支时用 `safeParse`。仓库用的是别的 schema 库时，用等价的推导辅助函数。别为了一个守卫新增 schema 依赖。这条规则优先用代码库已经信任的 schema 系统。

## 不用 `as` 断言

每个 `as` 都是一次潜在的运行时崩溃。只有类型系统验证过这个断言之后才能断言。

```ts
import { z } from "zod";

// Don't
const user = data as User;

// Don't
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}

// Do
const userSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof userSchema>;

function parseUser(data: unknown): User {
  return userSchema.parse(data);
}
```

类型先行时，给校验器标注它要证明的类型。这样编译器会拒绝证明得比类型少的校验器。把下面对象里的 `name` 删掉，赋值就编译不过。

```ts
type User = { id: string; name: string };

const userSchema: z.ZodType<User> = z.object({ id: z.string(), name: z.string() });
```

从已有代码里重构掉一个 `as` 时，先弄清 TypeScript 为什么推导不出来：

- 缺判别字段：加一个，改成可辨识联合。
- 来源类型过宽（比如 `Record<string, unknown>`）：收窄它。
- 边界没有类型：用拥有这个形状的 schema 来 parse。只在没有 schema 的地方加 schema。
- 确实表达不出来：用品牌类型或 `satisfies`。

## 收窄的优先级

从最好到最后的兜底：

1. **可辨识联合的 switch / if。** 编译器自动收窄。
2. **`in` 运算符。** `"key" in obj` 收窄到含该键的变体。
3. **`typeof` / `instanceof`。** 用于原始类型和类实例。
4. **用户定义的类型守卫。** 上面这些不够用时。
5. **`as` 断言。** 只在校验之后。

```ts
function area(s: Shape): number {
  if ("radius" in s) return Math.PI * s.radius ** 2; // narrowed to circle
  return s.width * s.height; // narrowed to rect
}
```

## 类型守卫

守卫必须真的验证这个断言。说谎的守卫比 `as` 更糟。

```ts
function isCircle(s: Shape): s is Shape & { kind: "circle" } {
  return s.kind === "circle";
}
```

能靠判别字段收窄时就优先用它。

## 穷尽性

在 default 分支里，把判别字段赋给一个 `never` 类型的局部变量。

```ts
// Value-returning switch
function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "rect":
      return s.width * s.height;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}

// Void switch
function handle(s: Shape): void {
  switch (s.kind) {
    case "circle":
      drawCircle(s);
      break;
    case "rect":
      drawRect(s);
      break;
    default: {
      const _exhaustive: never = s;
      void _exhaustive;
    }
  }
}
```

有返回值的 switch 用 return 风格，语句式 switch 用 void 风格。

## 用 `satisfies` 而不是 `as`

`satisfies` 做校验，但不放宽字面量类型。

```ts
// Don't. Widens, loses literal types.
const config = { theme: "dark", cols: 3 } as Config;

// Do. Validates AND preserves literal types.
const config = { theme: "dark", cols: 3 } satisfies Config;
// config.theme is "dark" (literal), not string
```

## 边界校验

在数据进来的地方校验一次。内部信任类型。参见 **boundary-discipline** 原则技能。

- **线格式**（proto、JSON-RPC）：用 `ignoreUnknownFields` 来 parse，这样向前兼容的改动不会弄坏老客户端。
- **持久化的 JSON：** 带版本号的 blob，parse 外面套 try/catch。
- **别在调用链深处重复校验。**

## 从 schema 推导类型

当 `.proto`、OpenAPI 规范、GraphQL schema 或数据库迁移已经定义了一个形状，就从生成的类型推导，别重复定义。

```ts
// Don't. Duplicate shape, drifts when the schema changes.
type CheckSummary = {
  totalCount: number;
  checks: { name: string; status: string }[];
};
function renderChecks(s: CheckSummary) {
  /* ... */
}

// Do. Derive from the generated schema type.
import type { ChecksMessage } from "<generated module>";
function renderChecks(s: Pick<ChecksMessage, "totalCount" | "checks">) {
  /* ... */
}
```

写新 interface 之前，先想想 `Pick`、`Omit`、`Parameters`、`ReturnType`、`Awaited`、`typeof`。

## 对象参数

```ts
// Don't. Swap two args, still compiles.
openFile(uri, {
  startLineNumber: 10,
  startColumn: 1,
  endLineNumber: 10,
  endColumn: 1,
});

// Do. Order-independent, self-documenting.
openFile({
  uri,
  selection: {
    startLineNumber: 10,
    startColumn: 1,
    endLineNumber: 10,
    endColumn: 1,
  },
});
```

热路径上跳过：逐帧渲染、tokenizer、parser，以及任何在紧循环里、分配开销要紧的地方。

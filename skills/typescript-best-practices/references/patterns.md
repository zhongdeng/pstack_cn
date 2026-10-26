# TypeScript 模式

`SKILL.md` 里每条规则的代码示例。底层原则与语言无关。见 **type-system-discipline** 和 **boundary-discipline** 原则技能。

## 品牌类型

给原语打上品牌，使它们不会被混用。在边界校验一次。下游代码信任这个类型。

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

匹配 `readonly __brand: 'X'` 这个形状。不要另起一套约定。

## 可区分联合

用一个字面量判别式来建模变体。每个变体共享字段名，并且每个变体的值唯一，所以不可能的组合无法被表示。

```ts
// Don't. Boolean + optionals lets contradictory states exist.
type DiffState = { loading: boolean; diff?: GitDiff; error?: string };

// Do. Only valid states exist.
type DiffState =
  | { kind: "loading" }
  | { kind: "ready"; diff: GitDiff }
  | { kind: "error"; error: string };
```

选定一个判别式名字（`kind`、`type`、`tag`），并坚持用它。

## 构造式建模

用全都合法的部件来建造类型，而不是用运行时检查去限制一个松散类型。

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

当到来的是普通 `T[]` 时，用一个守卫收窄一次。这个事实随后就在类型里旅行：

```ts
const isNonEmpty = <T>(arr: T[]): arr is NonEmpty<T> => arr.length > 0;
```

偶数长度，做成对：

```ts
type Pairs<T> = [T, T][];
```

时间区间，做成起点加时长：

```ts
// Don't: a comment holds the invariant
type TimeRange = { start: Date; end: Date }; // start <= end

// Do: a negative range can't be written; derive end when needed
type TimeRange = { start: Date; durationMs: number };
```

让 `durationMs` 保持普通数字。只在一个原始数字可能被传到需要时长的地方时才给它打品牌（见品牌类型），不要出于反射。选出使坏状态无法被构造的表示，然后在上面暴露你需要的读法（`pairs.flat()`、一个 `rangeEnd()` 辅助函数）。

## 最简单的全函数类型

不要把一切都收紧。当其上的每个操作都是全函数时，继续用 `T[]`：

```ts
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0); // [] is 0, fine
```

当松散类型迫使你在使用点说谎时才收紧。迹象是 `!`、`arr[0] as T`，以及一个「不该发生」的抛出：

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

把结果放宽成 `Session | undefined` 是另一种全函数签名。

## `unknown` 优于 `any`

外部数据始终是 `unknown`。使用之前先收窄。

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

## schema 先于手写守卫

在为外部数据手写逐属性的类型守卫之前，先找仓库的运行时 schema 库和已有 schema。让一个 schema 拥有校验，并从它推导 TypeScript 类型。不要同时维护一个 schema、一份重复的接口，以及一个可能漂开的守卫。

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

失败是预期分支时用 `safeParse`。仓库用另一套 schema 库时，用对应的推导辅助。不要为一个守卫新增 schema 依赖。这条规则优先使用代码库已经信任的 schema 体系。

## 不要 `as` 断言

每一个 `as` 都是一次潜在的运行时崩溃。只在类型系统已经核实了这条主张之后才断言。

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

当类型先行时，用它所证明的类型来标注校验器。编译器随后会拒绝一个证明得比类型少的校验器。从下面的对象里去掉 `name`，赋值就无法编译。

```ts
type User = { id: string; name: string };

const userSchema: z.ZodType<User> = z.object({ id: z.string(), name: z.string() });
```

把现有代码里的 `as` 重构掉时，找出 TypeScript 无法推断的原因：

- 缺少判别式：补上一个，改成可区分联合。
- 来源类型过宽（例如 `Record<string, unknown>`）：收窄它。
- 未类型化的边界：用拥有该形状的 schema 来解析。只在没有任何 schema 的地方才加一个。
- 确实无法表达：用品牌类型或 `satisfies`。

## 收窄的层次

从最好到最后手段：

1. **可区分联合的 switch / if。** 编译器自动收窄。
2. **`in` 运算符。** `"key" in obj` 收窄到包含该键的变体。
3. **`typeof` / `instanceof`。** 用于原语和类实例。
4. **用户定义的类型守卫。** 当前面那些不够时。
5. **`as` 断言。** 只在校验之后。

```ts
function area(s: Shape): number {
  if ("radius" in s) return Math.PI * s.radius ** 2; // narrowed to circle
  return s.width * s.height; // narrowed to rect
}
```

## 类型守卫

守卫必须真正核实它的主张。一个说谎的守卫比 `as` 更糟。

```ts
function isCircle(s: Shape): s is Shape & { kind: "circle" } {
  return s.kind === "circle";
}
```

能用判别式收窄时优先用它。

## 穷尽性

在 default 分支里，把判别式赋给一个 `never` 类型的局部变量。

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

返回值的 switch 用 return 风格，语句式 switch 用 void 风格。

## `satisfies` 优于 `as`

`satisfies` 做校验，同时不放宽字面量类型。

```ts
// Don't. Widens, loses literal types.
const config = { theme: "dark", cols: 3 } as Config;

// Do. Validates AND preserves literal types.
const config = { theme: "dark", cols: 3 } satisfies Config;
// config.theme is "dark" (literal), not string
```

## 边界校验

在数据进入的地方校验一次。内部信任类型。见 **boundary-discipline** 原则技能。

- **线上格式**（proto、JSON-RPC）：用 `ignoreUnknownFields` 解析，这样向前兼容的改动不会弄坏旧客户端。
- **持久化的 JSON：** 带版本的 blob，解析外包一层 try/catch。
- **不要在调用链深处重新校验。**

## 从 schema 推导的类型

当 `.proto`、OpenAPI spec、GraphQL schema 或数据库迁移已经定义了形状，从生成的类型推导，而不是复制它们。

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

在写新接口之前，先伸手去用 `Pick`、`Omit`、`Parameters`、`ReturnType`、`Awaited`、`typeof`。

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

热路径上跳过：逐帧渲染、分词器、解析器，以及任何分配成本要紧的紧循环。

import fs from "node:fs";
import path from "node:path";
import { BROKEN_MARK, PRIMES_OR_UNCHANGED, tlaVariables } from "./lib.mjs";

export const withoutComments = (spec) =>
  fs
    .readFileSync(spec, "utf8")
    .replace(/\(\*[^]*?\*\)/g, " ")
    .replace(/\\\*.*/g, " ");

function specVariables(spec, seen) {
  const text = withoutComments(spec);
  const extended = /\bEXTENDS\s+(\w+(?:\s*,\s*\w+)*)/.exec(text)?.[1].split(/\s*,\s*/) ?? [];
  return [
    ...extended.flatMap((m) => {
      const file = path.join(path.dirname(spec), `${m}.tla`);
      if (seen.has(m) || !fs.existsSync(file)) return [];
      seen.add(m);
      return specVariables(file, seen);
    }),
    ...tlaVariables(text),
  ];
}

export const RULES_INVARIANT = "StatechartRules";

export function writeRulesModule(spec, rules, dir) {
  const name = path.basename(spec, ".tla");
  const file = path.join(dir, `${name}_rules.tla`);
  const fields = specVariables(spec, new Set([name])).map((v) => `${v} |-> ${v}`);
  const broken = rules.map((r) => `(IF ${r} THEN {} ELSE {"${r}"})`).join(" \\cup ");
  fs.writeFileSync(
    file,
    `---- MODULE ${name}_rules ----
EXTENDS ${name}
StatechartTLC == INSTANCE TLC
StatechartBroken == ${broken}
${RULES_INVARIANT} == StatechartBroken = {} \\/ StatechartTLC!PrintT(<<"${BROKEN_MARK}", [${fields.join(", ")}], StatechartBroken>>)
====
`,
  );
  return file;
}

export const SCAFFOLD = (name, spec) => {
  const text = withoutComments(spec);
  const vars = tlaVariables(text);
  const primedDefinitions = [
    ...new Set(
      text
        .split(/\n(?=\S)/)
        .map((d) => /^(\w+)\s*(?:\([^)]*\))?\s*==([^]*)/.exec(d))
        .filter((d) => d && PRIMES_OR_UNCHANGED.test(d[2]))
        .map((d) => d[1]),
    ),
  ].sort();
  return `// ${name} 的状态图标签，供 statechart.mjs 使用。用读这张图的人的话说标签，
// 不要用变量名或动作名。
// v、before 和 after 把每个变量映射到它的值。字符串、数字和布尔保持各自的类型。
// 序列和元组，包括 1..n 上的函数，像 TLA+ 一样从 1 开始读，所以 v.seat[1] 是
// 第一项。读下标 0 会让这次运行停下。length、数组方法和展开仍然可用。
// 方法的下标，例如 indexOf，或 map((x, i) => ...) 里的 i，仍然从 0 计。
// 集合变成数组。记录和其他函数变成对象。
// 变量：${vars.join(", ")}。

// 读者采取的动作，按动作名。当这张图要把读者做的事和读者周围发生的事分开时使用。
// 只有这些动作被启用时，facts.settled 为真。带上 --cover 时，总览只保留到达每个
// 安定状态的最短路径，外加每一条 bug 路径。每个动作都同等重要时，把它留空。
export const readerActions = [];

// 一个模型状态的标签。facts.enabled 是该状态启用的动作集合，
// 包括不改变任何变量的步骤。形如 "上下文: 进展" 的标签，例如
// "主库宕机: 写入已排队"，会把同一上下文的状态放进一个框，并能把
// 总览画成两个并行区域。只有当上下文和进展独立变化时才用这种形式。
// 没有 ": " 的标签会把每个状态单独画出来。
// 不要声称一个仍可能被待处理步骤改变的结果，例如重试还在队列里时就写 "写入丢失"。
export function state(v, facts) {
	return JSON.stringify(v);
}

// 总览画出两个并行区域时它们的名字：先是上下文，然后是进展。
// export const regionNames = ["Primary", "Write"];

// 一个模型状态的分组，用读者的话，例如 "订单已发出"。图用同一种颜色填充
// 同一组的状态，图例点名这些组。仍然由 TLC 决定哪些状态打破规则，并在组颜色之上
// 用粗红边画出来。groupColors 给一组一个浅色。没有指定的组使用调色板颜色。
// export function group(v, facts) {}
// export const groupColors = { "订单已发出": "#d1f2eb" };

// 一步的标签。让读者留在同一状态的步骤不画，除非读者在一条 bug 路径上走了它。
// "" 不画标签，带编号的 bug 步骤会显示动作名。
// action 是不带参数的动作名，所以比较 before 和 after，判断这一步改的是
// 哪个进程或哪一项。
// STEPS 列出每一个改变变量的定义。如果某个定义被另一个动作用在 /\\ 列表里，
// 例如 Save == Log /\\ saved' = TRUE 里的 Log，TLC 不会用它来命名步骤，所以删掉那一项。
const STEPS = {
${primedDefinitions.map((a) => `\t${a}: ${JSON.stringify(a)},`).join("\n")}
};
export function step(action, before, after) {
	return STEPS[action] ?? action;
}

// 这一步何时可以发生，用白话，例如 "租约过期之后"。图上显示 "步骤 [话]"。"" 不添加任何东西。
// export function guard(action, before, after) {}

// 对于计时器步骤，代码等待多少秒，取自代码里的常量。图上显示 "N 秒后，步骤"。
// 其他步骤什么都不返回。
// export function timer(action, before, after) {}

// 一个坏状态为什么坏，用读者的话，例如 "一个 worker 领走任务后崩溃了，
// 没有其他 worker 能领走它"。不要出现变量名、函数名或事件名。
// 用同一个原因打破同一条规则的反例是同一个 bug，所以结束于同一状态的两个 bug
// 只有原因不同才分开。返回 null 则按结束状态分组。
// export function cause(v, facts, invariant) {}

// 一个模型状态的开发者用语。有了它，每个 bug 也会沿着这些状态画出来。
// export function detail(v, facts) {}

// 图例里每种状态的用语，用来替换默认值。分组条目保持自己的名字。
// export const legend = { works: "在 main 上正常", wrong: "在 main 上错误", fixed: "在打开的 PR 里已修复" };
`;
};

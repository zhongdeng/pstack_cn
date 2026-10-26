import { parsePrNumber } from "./types.ts";
import type {
  CiClean,
  GitHubMergeAllowed,
  PrContext,
  ReadyPr,
  TerminalVerdict,
} from "./types.ts";

type ReadyVerdict = Extract<TerminalVerdict, { readonly kind: "READY" }>;

const context = {
  owner: "octocat",
  repo: "hello-world",
  number: parsePrNumber(123),
} satisfies PrContext;
const cleanCi = {
  kind: "ci-clean",
  source: "gh-pr-checks",
  all: [
    {
      kind: "passed",
      name: "ci",
      reportedState: "SUCCESS",
      description: "",
      link: "",
      workflow: "",
    },
  ],
  failed: [],
  pending: [],
  hadPreviousPassingCi: false,
  github: {
    kind: "allowed",
    basis: "merge-state",
    mergeStateStatus: "CLEAN",
    headRollupState: "SUCCESS",
  },
} satisfies CiClean;
const readyPr = {
  kind: "ready-pr",
  context,
  proof: {
    mergeability: "clear",
    threads: [],
    ci: cleanCi,
    gate: {
      state: "OPEN",
      reviewDecision: "APPROVED",
      draft: "not-draft",
    },
  },
} satisfies ReadyPr;
const ready = {
  schemaVersion: 1,
  sequence: 1,
  observedAt: "2026-07-26T00:00:00.000Z",
  mode: "single",
  kind: "READY",
  terminal: true,
  exitCode: 0,
  scope: { kind: "single", pr: readyPr },
} satisfies ReadyVerdict;

void ready;

// PR 179929 的形状。下面每条断言都保持为一条简短语句，这样重新格式化
// 不会让指令漂离真正报错的那一行。
const refused = {
  kind: "allowed",
  basis: "rollup",
  mergeStateStatus: "BLOCKED",
  headRollupState: "FAILURE",
} as const;

// @ts-expect-error rollup 失败时的 BLOCKED 是拒绝，不是允许。
const refusalIsNotAllowed: GitHubMergeAllowed = refused;

// @ts-expect-error GitHub 拒绝合并时，CI 不可能是干净的。
const refusalIsNotClean: CiClean = { ...cleanCi, github: refused };

// @ts-expect-error READY 不能携带检查失败的退出码。
const readyWithBlockerExit: ReadyVerdict = { ...ready, exitCode: 4 };

const unprovenPr = { kind: "ready-pr", context } as const;

// @ts-expect-error 一条打开的 READY 记录必须带有正面的就绪证明。
const readyWithoutProof: ReadyPr = unprovenPr;

void refusalIsNotAllowed;
void refusalIsNotClean;
void readyWithBlockerExit;
void readyWithoutProof;

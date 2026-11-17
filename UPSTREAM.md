# Upstream

| | |
|---|---|
| repo | `cursor/plugins` |
| path | `pstack` |
| commit | `2f87c854fe3e2fcda44ca86b46ede35aad3c46b7` |
| date | 2026-11-17 |

`commit` 是 `main` 上最后一次改动 `pstack/` 的提交（2026-11-16，`feat(pstack): shorter skill texts, worker.md, and Opus-first routing capped at xhigh (#1249)`）。抓取时 `main` 就是这个 SHA。

```json
{
  "upstreamRepo": "cursor/plugins",
  "path": "pstack",
  "commit": "2f87c854fe3e2fcda44ca86b46ede35aad3c46b7",
  "date": "2026-11-17"
}
```

同步时用 GitHub `commits?path=pstack&sha=main` 的最新 SHA 与上表比较。下列内容按源文保留英文，不是漏译：

- `LICENSE` 的 MIT 法律正文（英文为权威文本）。文件顶部有一句中文说明。
- `skills/statechart/scripts/` 下的 TypeScript、测试、`package.json`、`tsconfig.json` 和可执行文件 `statechart` 按上游原样复制，包括注释。测试会解析源码并锁定输出。`test/cli.test.ts`、`test/pipeline.test.ts`、`test/corpus.test.ts`、`test/tlc.ts` 和 `test/plain-tlc.test.ts` 锁定的 CLI 与报告字符串包括 `Usage:`、`Wrote`、`Give one SPEC.tla.`、`Unknown option`、`stopped the check, so the command wrote nothing.`、`killed the check, so the command wrote nothing.`、`## Rules that hold`、`## Rules not checked`、`## <rule> breaks`、`The shortest path has`、`TLC's counterexample is in`。图例标记 `Legend`、`Breaks`、`mayBreak`、`bugPath`、`repeats` 同样锁定。`references/render.md` 的说明散文已译，其中的 CSS 代码块未改（`test/render.test.ts` 原样抽取）。
- 语料与夹具整文件照抄：`skills/statechart/scripts/test/corpus/**`（含 `report.md`、`*.out`、`*.exit`、`*.tla`、`*.cfg`、`*.dot`、`*.mmd`、`view.mjs`）和 `skills/statechart/scripts/test/charts/*.mmd`。
- 技能名、命令、路径、URL、代码围栏、CLI 旗标，以及 Bugbot 量规字段（`fix` / `dismiss` / `ask`，`Confidence`，`Skip when`）。`/interrogate` 的产出字段 **Intent** / **Findings** / **Dropped**，以及要求原样说出的 `no verified findings`，同样保留英文。`/reflect` 交出的 `Accepted`、`Rejected`、`Backlog`，以及 PR 正文标题 `Why`、`What changed`、`Scope`、`Tradeoffs`、`Blast Radius`、`Verification`，也按源文保留英文。

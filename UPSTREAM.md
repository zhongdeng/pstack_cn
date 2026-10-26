# Upstream

| | |
|---|---|
| repo | `cursor/plugins` |
| path | `pstack` |
| commit | `e73df471cd4bd918367e99f3dd9c51bd53ddf5f0` |
| date | 2026-10-26 |

`commit` 是 `main` 上最后一次改动 `pstack/` 的提交（2026-10-23，`fix(pstack): renumber swarm's Phase A…`）。抓取时 `main` 为 `99b609a72323b70204eab407c622f436e858e112`，其后没有 `pstack/` 文件变化，树与上述 SHA 一致。

```json
{
  "upstreamRepo": "cursor/plugins",
  "path": "pstack",
  "commit": "e73df471cd4bd918367e99f3dd9c51bd53ddf5f0",
  "date": "2026-10-26"
}
```

同步时用 GitHub `commits?path=pstack&sha=main` 的最新 SHA 与上表比较。下列内容按源文保留英文，不是漏译：

- `LICENSE` 的 MIT 法律正文（英文为权威文本）。
- `skills/statechart/scripts/test/statechart.test.mjs` 锁定的 CLI 与图例协议字符串，包括 `Usage:`、`Exit codes`、`more()`（`Run node statechart.mjs … --help for the flags, the output, and the exit codes.`）、`unknown argument`、`Wrote`，以及故事/图例里的 `Works today`、`with the fix`、`does not check this rule` 等。`statechart-help.mjs` 的说明散文已译，这些标记未改。
- `skills/poteto-mode/scripts/check-plan.mjs` 要求的计划骨架，留在 `skills/poteto-mode/playbooks/multi-phase-plan.md`（`## How to read this`、`**Depends on.**`、`**Verify, unit.**` 等）。
- Mermaid 夹具 `skills/statechart/scripts/test/fixtures/*.mmd`。
- 技能名、命令、路径、URL、代码围栏、CLI 旗标，以及 Bugbot 量规字段（`fix` / `dismiss` / `ask`，`Confidence`，`Skip when`）。

### 多阶段或多 PR 计划

**计划由你负责，代码不由你负责。计划是一份清单，负责人一格一格地跑，操作者根据证据来审计。** 计划就是交付物。不要实现。

1. 当改动是一两个文件、做法明显时，跳过计划。这样说，然后停。
2. 写下来之前，用原型把未决问题定下来。每一个都跑 `playbooks/prototype.md`。把分支、SHA 和截图留给附录 A。只向操作者问那些没有任何一次运行能裁定的产品或偏好决定。给出选项（**never-block-on-the-human** 原则技能）。
3. 在子代理里探索，使用 `subagent_type: "poteto-agent"`，并按子代理一节给出明确模型（**guard-the-context-window** 原则技能）。按子代理一节，为每个子代理选择这项工作所需的推理档位，以及 fast 或 standard 速度。每个返回文件指针、惯例、测试命令和入口。不要内联倾倒。
4. 把下面的骨架复制进计划文件，并填上每一个占位符。除非操作者点名一条路径，否则把文件写在代理存储的 `docs/` 下。按所示顺序保留每一个标题和每一个子块。每个 PR 一节。一个 PR 是一次改动，带它自己的证据（**sequence-verifiable-units** 原则技能）。在 **How to read this** 里点名执行手册。运行可以合并时选 `playbooks/autopilot-full.md`。操作者来合入这些 PR 时选 `playbooks/autopilot-stack.md`。常设项目用 `playbooks/orchestrate.md`。
5. 完整地按 `/technical-writing` 来写，然后 `/unslop`。正文是一种 Diátaxis 模式，how-to。附录放解释和参考。每个标题说出任务或发现。不要长破折号。不要句中冒号。
6. 运行 `node pstack/skills/poteto-mode/scripts/check-plan.mjs <plan.md>`，并修掉它打印的每一行（**encode-lessons-in-structure** 原则技能）。
7. 交回。贴出计划路径和脚本的输出，然后停。执行在操作者明确放行时开始，走计划所点名的执行手册。

**验证。** 仅有测试不是充分的验证。一个 PR 只有在它的单元、实机和性能格子全部勾上时才算验证过（**prove-it-works** 原则技能）。那句话就是验证规则。每一个验证块都以它开头。实机块是强制的。十条通道在 PR 的 head 上，经它的控制技能驱动真实交互面，按 **swarm** 技能，使用 `swarm workers` 模型（默认 `grok-4.7-xhigh-fast`）。每一条通道是一格，带一个具体场景、它保存的截图，以及它的通过谓词。一条通道是 **Regression lane against trunk.** 它在主干和 head 上跑同一个承重场景。如果主干没有这个功能，这条通道记下这个事实，并门控 diff 所增加的行为，加上用户在等的终态，而不是发明一个主干结果。性能门禁是双侧的。主干和 head 都必须产出点名的指标。如果主干缺少这个功能，还要隔离 diff 所增加的工作，并为那项工作加上用户在等的端到端状态设一个绝对预算。不要在不相同的场景之间声称一个比值。性能块点名指标、交错的探测、先测到的主干基线，以及带有失败数字的规则。一个改变交互的 PR 要过审查门禁。操作者在聊天里带着截图和一段视频审查它，然后才合并。一个不改变交互的 PR 写 `**Review gate.** None. <PR id> is not review-gated.`，并且它下面没有格子。

**控制技能。** 按交互面来选。浏览器、Electron 和 Web UI 用来自 `cursor-team-kit` 的 `control-ui`。CLI 和 TUI 用来自 `cursor-team-kit` 的 `control-cli`。原生移动端用仓库里任何能驱动模拟器的技能。一个碰到两个交互面的 PR 在两边都有通道。一个没有控制技能的交互面是附录 C 里的一项风险，并且它的实机块仍然点名每一条通道如何驱动它。

````markdown
# <Program> plan

<Under ten lines. What changes, for whom, the rule the program enforces, and the PR ids in order.>

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, a file, a log line, a screenshot, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs `pstack/skills/poteto-mode/playbooks/<execution playbook>.md`. <Who merges, and which PR ids are the operator's items that stop at merge-ready.>

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on the operator's explicit go.
- [ ] Read these from trunk at program start. Re-read them at every tick.
  - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/<execution playbook>.md`
  - [ ] `git show origin/main:pstack/skills/swarm/SKILL.md`
  - [ ] `git show origin/main:<control skill path>`
  - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/opening-a-pr.md`
  - [ ] `git show origin/main:pstack/skills/<each other leaf skill the program uses>`
- [ ] On the operator's go, arm the audit tick as `/loop 1h` with the tick prompt below. Never leave the cadence to memory.
- [ ] Use this tick prompt, verbatim. "Re-read the execution playbook from trunk. Audit the operation against it and fix drift in this tick. Probe every active lane and judge progress by side effects only. Stand down a stuck lane and dispatch its replacement now. Then post a short status message to the operator in chat only when the audit found a tracked change that no earlier status message reported, such as a PR opened, a code-ready head, a round launched or closed, a verdict, a merge, a stuck agent and the action taken, a blocker added or cleared, or a decision only the operator can make. Name every such change and nothing else. Do not repeat a table, the merged list, or an unchanged blocker. If the audit found none, end the turn with no reply text. Either way, log this tick's row in your decision trail. The row names the items reported, or none."
- [ ] On the operator's hold or stand-down, send every owner a zero-writes order at once.

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle the execution playbook names.
- [ ] Follow this dependency graph. Start dependent work only after its parent merges, or base it on the parent branch when the execution playbook stacks.
  - [ ] <PR id> and <PR id> are independent and first. Both branch from `main`.
  - [ ] <PR id> after <PR id>.
- [ ] Hold the file boundaries. <PR id or class> touches only `<glob>`.
- [ ] Hold the review gate. <PR ids> change an interaction. They wait for the operator's review in chat with screenshots and a video before merge.

### PR mechanics, for every PR

- [ ] Resolve the forge once. Default to `gh`; if `command -v origin` succeeds and Origin can resolve the repository, use `origin pr` for every PR operation. Record any fallback to `gh`. Never require `gt`.
- [ ] Open the PR ready, never draft, per **Opening a PR**. Use the run's built-in PR tool when it has one, else `origin pr create --status open --base <base-branch>` or `gh pr create --base <base-branch>` according to the resolved forge. A stack child targets its parent branch.
- [ ] Run the repo's lint and typecheck once before the PR-facing push. Push with hooks on.
- [ ] Run `/deslop` before each commit and `/no-comments` before review.
- [ ] Triage every Bugbot and security-reviewer comment per `../references/bugbot-triage.md`.
- [ ] Rebase onto current trunk before the code-ready report and babysit. Keep that merge base in fix rounds. Rebase again only at merge prep, on a `git merge-tree` conflict with trunk, on a CI failure that comes from a change on trunk, or when a known concurrent change to the same files lands.

### Verdict and merge, for every PR

- [ ] A full swarm runs once, at the code-ready head. Another full swarm runs only for new behavior, a redesign, or a large new diff. A rebase, a merge-conflict resolution, or a minor fix gets a single verifier at the new head, and a wording-only change gets none. Run each full swarm per `pstack/skills/swarm/SKILL.md`. One gates lane. The ten live lanes from the PR's **Verify, live** block. The perf lane from its **Verify, perf** block. Two or more audit lanes, each with its own focus, that read the diff and the receipts and distrust the PR body. The root audits the receipts in the merge-ready report before the verdict.
- [ ] Judge every finding by the execution playbook's blocking rule. The verdict is clean when none blocks. A failure on trunk behavior in a lane marked `Regression lane against trunk.` is recorded against trunk and does not block the PR. A new head gets a fresh verdict, except for results that stay valid under the patch-id rule in `playbooks/shipping.md`.
- [ ] <The merge or handoff rule from the execution playbook, with the patch-id rule from `playbooks/shipping.md`.>

### Boot recipe, for every live lane

Each live lane runs on its own cloud VM at the PR head. Drive through `control-ui` or `control-cli` from `cursor-team-kit`.

- [ ] `git fetch origin <head-branch> && git checkout <head SHA>`.
- [ ] <Start the backend and the surface. Wait for ready.>
- [ ] <Deliver input only through the control skill's commands. Name the read-only diagnostics.>
- [ ] Save every screenshot to `/tmp/swarm-<pr-id>/worker-<n>/<slug>.png` and return the paths with the report.

## <Task as a verb phrase> (<PR id>)

**Depends on.** <PR id, or None.>

**Files.**

- [ ] Edit `<path>`.
- [ ] Create `<path>`.
- [ ] Delete `<path>`.

**Build.**

- [ ] <One change. Name the symbol and the file.>

**You see.**

- [ ] <One observable result, with the exact log line or screen state.>

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] <Test file and the case it gains.> Run `<command>`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `<swarm workers model>` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run <the same load-bearing scenario> at trunk and head. If trunk lacks the feature, record that and gate <the behavior the diff adds plus the end state the user waits for>. Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 2. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 3. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 4. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 5. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 6. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 7. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 8. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 9. <Scenario.> Save `<slug>.png`. Pass when <predicate>.
- [ ] Lane 10. <Scenario.> Save `<slug>.png`. Pass when <predicate>.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. <What is measured at both trunk and head. If trunk lacks the feature, also name the diff-added work and the end-to-end state the user waits for.>
- [ ] Probe. <The command or procedure, run at trunk and at the head, interleaved. Both sides must produce the metric.>
- [ ] Baseline. Record the trunk <value> first.
- [ ] Rule. <Head against trunk, with the number that fails. If the scenarios differ, add absolute budgets for the diff-added work and the user-visible end state instead of an invalid ratio.>

**Review gate.** The operator reviews before merge.

- [ ] Copy lane <n> screenshots into `<media path>/<pr-id>-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `<media path>/<pr-id>-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] <The owner squash-merges its own PR, or the root appends it to the base-branch stack and the operator lands it bottom-up.>

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the report the execution playbook names.

## Appendix A. Prototype evidence

<Each open question a prototype answered, with the branch, the SHA, and the artifact links. Each question that stays unproven.>

## Appendix B. Alternatives rejected

<Each approach weighed and why it lost.>

## Appendix C. Risks

<Each risk with the PR it lands in and what the owner watches.>

## Appendix D. Links and reading list

<Docs to read before editing. Which PRs get `pstack/skills/how/SKILL.md` and `pstack/skills/interrogate/SKILL.md`. The trail per `pstack/skills/show-me-your-work/SKILL.md`.>
````

**回复：** 计划路径、各 PR id 及其依赖和过审查门禁的那一组、原型证明了什么以及什么仍然未证明，还有检查脚本的输出。

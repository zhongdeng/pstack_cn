### 落地

**落地的东西由你负责。每个 PR 都要独立验证，只从根目录落地已验证的那一段，然后别再碰这个栈。**

1. **先确定用哪个 forge，再在落地前逐个独立验证每个 PR。** 默认用 GitHub CLI（`gh`）。如果 `command -v origin` 成功，并且 Origin 能解析这个仓库，那么所有 PR 操作都用 `origin pr`。否则继续用 `gh`，并记下这个回退。绝不要求 Graphite（`gt`）。每个 PR 一个验证者，都是 Cursor 云智能体，用对应的 control 技能（比如 `cursor-team-kit` 里的 `control-ui` 或 `control-cli`）像用户那样跑一遍改动，父分支对头分支，然后在这个 PR 上贴 `PASS`、`PASS+NOTES` 或 `FAIL`。只有没写这段代码的智能体给出的结论才算数，因为作者检查的是它本来想做成什么样。CI 全绿和机器人审查通过都不算结论，因为这两者都没有像用户那样跑一遍改动。
2. **只落地从最底部开始连续已验证的那一段。** 从最低的未合并 PR 往上走，停在第一个没有 `PASS` 或 `PASS+NOTES` 的 PR。它下面的那些 PR 就是这一段，最上面那个是天花板。一个已验证的 PR 如果下面压着未验证的，就得等，因为下面那段代码不在它就没法落地。如果某个 PR 的分支既不包含也不需要那段代码，它可以挪到 trunk 上单独落地。但它得先拿一个新结论，因为旧结论是在那段代码垫在下面时跑的，而 trunk 上没有那段代码。
3. **复查结论是否仍然描述的是当前代码。** 一个结论覆盖的是一个补丁，而链式 rebase 会把上面每个 PR 挪到新的 SHA，却不会让任何检查失败。在信任旧结论之前，把结论 SHA 处的 `git patch-id` 和当前 head 比一下。如果补丁只在测试、文档或 lint 配置上有差别，那么只要这条 lane 跑的东西在两个 SHA 上构建结果一样（除去噪声），它的结果就仍然成立。噪声是指两个结论 SHA 的构建之间也会出现的差异，或者内嵌的 commit SHA。报告每种噪声时带上它的文件，好让读者能核对这个判断。改动本身仍然要跑新检查、过一遍审查，因为旧结论从没见过它。没有构建产物的 lane（比如 dev server）没法证明这一点，所以要重跑，其他漂移的东西也要重新验证。
4. **自底向上落地，一次一个 PR。** 永远合并这一段里最低的未合并 PR，用 `origin pr merge <pr>` 或 `gh pr merge <pr> --squash`。在 Origin 上，不加参数的这条命令还会把你点名的那个 PR 下面的所有 PR 一起合并；在 GitHub 上，如果某个 PR 的 base 还是它父分支的分支，它就会合进那个分支，而不是 trunk。合并后把 PR 读回来确认结果（`origin pr view <pr>` 或 `gh pr view <pr> --json state,mergedAt,baseRefName`），因为合并命令可能在合并队列只是把 PR 排上队时就报成功，而请求的 auto-merge 也不是合并。落地后的 PR 读出来是 merged，base 是 trunk，不是它父分支的分支。只对结论覆盖其当前 head 的 PR 启用 `--auto`（Origin 的 merge-when-ready 或 GitHub 的 auto-merge），因为它会落地当时就绪的那个 head。合并落地后，把 base 是那个已合并分支的 PR 重新指向 trunk（`origin pr edit <pr> --base <trunk>` 或 `gh pr edit <pr> --base <trunk>`），把它的补丁挪到合并结果上，然后用 `--force-with-lease` 推送。结论覆盖的是补丁，不是它的 commit，所以第 3 步的 patch-id 规则决定结论是否还成立。等它的检查通过、结论仍然成立，就合并它。
5. **落地期间别动这个栈。** 第 4 步挪下一个 PR 是唯一对分支或 base 的改动，因为合并落地的是那一刻分支和 base 上的东西，不管有没有结论。在 GitHub 上，用 `playbooks/babysit.md` 里的排队监视器（`scripts/watch-pr/watch-pr --queued-stack --stack-prs <bottom-to-top>`）在 `/loop` 下盯着这一段，直到它在天花板处报 `COMPLETE`。在 Origin 上，每次 `origin pr checks <pr> --watch` 返回时，用 `origin pr view <pr> --checks` 重新读当前 PR，直到天花板读出来是 merged。父 PR 合并时 base 挪到 trunk 是预期行为，不是要修的损坏。如果某个合并卡住了，先搞清楚原因再动任何东西。
6. **到天花板就停。** 往下延伸这一段需要新结论，所以那是重新走一遍第 1 步。

**回复：** 已验证的那一段和它的天花板，每个 PR 的结论以及是谁给出的，什么落地了、你怎么确认的，以及下一个缺口需要什么。

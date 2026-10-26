### 工作树与模拟器清理

1. 快照并审计。记录 `df -h /`，然后运行 `scripts/worktree-audit.sh [-b <pr-base-ref>] [repo-path]`（principle-build-the-lever）。不加 `-b` 时，它对照 `origin/HEAD` 检查 `MERGED`，所以当 PR 的目标是另一条分支时，传 `-b origin/<branch>`。它从 `git worktree list` 读路径，绝不手打，因为手打的 `myrepo-worktrees/x` 会漏掉实际位于 `.cursor/worktrees/myrepo/x` 的那一个（principle-encode-lessons-in-structure）。它按大小、年龄、合并状态、未提交的工作、PR 状态，以及碰过它的最新对话，给每个工作树分类，然后建议一个桶。记录稿扫描很慢，所以把它放到后台。
2. 桶是建议，不是许可。置顶的和活跃的对话才是真实产物（principle-prove-it-works）。从用户或侧边栏拿到那一组，并交叉核对每一个候选。这个杠杆曾经把用户置顶的工作树标成 `safe`，所以置顶集合胜出。
3. 删除之前验证是否还在用。对每一个 `verify-recent-chat` 行，或任何你怀疑的东西，扇出子代理去读记录稿，并报告该对话是置顶还是仍在进行，以及它碰到哪些工作树（principle-guard-the-context-window，记录稿是大块内容）。一个置顶对话会经后台子代理把 arena 和复现树生到同级工作树里，即使它们的名字从不出现在侧边栏，那些也在使用中。按子代理一节，为每个子代理选择这项工作所需的推理档位，以及 fast 或 standard 速度。
4. 在不可逆损失前暂停。`wip:N` 是 N 处已跟踪的未提交编辑。先给出 diff 并拿到决定，因为删掉一个干净的工作树可以从它的分支恢复，但未提交的工作就没了。`scratch:N` 是未跟踪的丢弃物，可以丢掉，但要点名那些文件。按自治，干净、已合并、且不在使用中的，继续。`wip` 和在使用中的，暂停。
5. 修剪已确认的那一组。按路径，`git worktree remove --force <path>`。如果目录因为被忽略的构建产物还在，就 `rm -rf` 它，然后 `git worktree prune`。分支引用还在，所以没有提交会丢。用 `df -h /` 确认，并重新列出。
6. 模拟器和其他回收项。模拟器通常是下一块最大的收益。`xcrun simctl --set testing delete all`（XCTestDevices 的克隆）、`xcrun simctl delete unavailable`，以及 `xcrun simctl runtime list` 然后对旧运行时 `runtime delete <id>`。需要时还有：Xcode 的 `DerivedData` 和 `iOS DeviceSupport`、`~/Library/Application Support/Cursor`（`state.vscdb.backup`，以及 `snapshots/roots/<root>`，其中以你作为工作区打开过的文件夹命名的 `<root>` 会膨胀）、包缓存（pnpm、uv、brew、yarn）。只清用户没有说过要保留的缓存。

这是唯一一本会删除用户状态、又没有代码审查来抓住失手的手册，所以上面的门禁就是审查。

**回复：** 前后的 `df -h /` 以及回收的空间、修剪了哪些工作树，以及对每一个留住的给出一行理由（被哪个对话占用，或有未提交的工作）。

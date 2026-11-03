### worktree 与模拟器清理

1. 快照并审计。记录 `df -h /`，然后运行 `scripts/worktree-audit.sh [-b <pr-base-ref>] [repo-path]`（principle-build-the-lever）。不带 `-b` 时它拿 `MERGED` 去对 `origin/HEAD`，所以 PR 指向别的分支时要传 `-b origin/<branch>`。它从 `git worktree list` 读路径，绝不手敲，因为手敲的 `myrepo-worktrees/x` 会漏掉住在 `.cursor/worktrees/myrepo/x` 的那个（principle-encode-lessons-in-structure）。它按大小、年龄、合并状态、未提交改动、PR 状态和最近碰过它的聊天给每个 worktree 分类，然后给出一个桶的建议。扫描 transcript 很慢，放到后台跑。
2. 桶只是建议，不是许可。被 pin 的聊天和活跃聊天才是真正的产物（principle-prove-it-works）。从用户或侧边栏拿到这个集合，逐个核对每个候选。这个工具曾经把一个用户 pin 过的 worktree 标成 `safe`，所以以 pin 集合为准。
3. 删之前先核实使用情况。对每个 `verify-recent-chat` 行，或任何你拿不准的，派子智能体去读 transcript，报告这个聊天是否被 pin、是否还在进行，以及它碰了哪些 worktree（principle-guard-the-context-window，transcript 是批量数据）。一个被 pin 的聊天会通过后台子智能体把 arena 和 repro 树开进兄弟 worktree，这些树即使名字从没出现在侧边栏里，也是在用的。按 Subagents 一节给每个子智能体挑推理档位和 fast 或 standard 速度。
4. 遇到不可逆的损失就停下来。`wip:N` 是 N 个被跟踪的未提交改动。先展示 diff 拿到决定，因为删一个干净的 worktree 还能从它的分支恢复，未提交的改动删了就没了。`scratch:N` 是未跟踪的一次性文件，可以安全丢弃，但要列出文件名。按 Autonomy，干净、已合并、没在用的直接走。`wip` 和在用的停下来。
5. 清理确认过的集合。逐个路径 `git worktree remove --force <path>`。如果目录因为被忽略的构建产物还留着，`rm -rf` 掉它，然后 `git worktree prune`。分支引用还在，所以不会丢提交。用 `df -h /` 确认并重新列一遍。
6. 模拟器和其他可回收项。模拟器通常是下一个大头。`xcrun simctl --set testing delete all`（XCTestDevices 克隆），`xcrun simctl delete unavailable`，以及 `xcrun simctl runtime list` 然后对旧运行时 `runtime delete <id>`。需要时还有更多：Xcode 的 `DerivedData` 和 `iOS DeviceSupport`，`~/Library/Application Support/Cursor`（`state.vscdb.backup`，以及 `snapshots/roots/<root>`，那里一个以你作为工作区打开过的文件夹命名的 `<root>` 会膨胀），包缓存（pnpm、uv、brew、yarn）。只清用户没说要留的缓存。

这是唯一一个删用户状态却没有代码审查兜底的作战手册，所以上面这些关卡就是审查。

**Reply:** `df -h /` 前后对比和回收的空间，清理掉的 worktree，以及每个被留下的用一行说明原因（被哪个聊天占用，或有未提交改动）。

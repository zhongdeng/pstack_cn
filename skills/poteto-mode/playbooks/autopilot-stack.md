### 自动驾驶栈

跑 Autopilot-full 作战手册，但不合并。

1. **用已验证代替第 5 步，到此为止。** 每个 PR 在当前 head 上验证通过、CI 全绿就停，然后把 PR 交给操作者。交接之后，没有操作者点头，谁都不许推。每个循环 tick 的提示词都会点名这个文件，所以每个 tick 都看得到不合并的规则。
2. **只有当一个 PR 建立在另一个 PR 之上时才堆叠。** 这是第 3 步唯一的例外。按 `playbooks/opening-a-pr.md` 里 **Size and stacks** 的说法，把 PR 的基底设成另一个 PR 的分支，用来代替 trunk。用每个 PR rebase 到父 PR 的分支代替第 2 步的 rebase 到 trunk，栈根则 rebase 到 trunk。下层 PR 出现新 head 会让它上面的 PR 重新堆叠，而重新堆叠后 `git patch-id` 没变的 PR 保留原来的结论。

**回复：** 列出每个 PR 和它的结论，用来代替合并了什么。

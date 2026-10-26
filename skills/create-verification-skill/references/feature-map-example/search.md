# 搜索笔记

搜索让用户按标题或正文找到笔记，查看一条匹配的笔记，并把「没有匹配」和「搜索不可用」区分开。

## Sub-features

- `search-open` 从每个支持的浏览器入口打开搜索。
- `search-match` 返回标题和正文的匹配，且不改变笔记数据。
- `search-open-result` 在笔记编辑器里打开一条结果。
- `search-empty` 对没有匹配的查询显示一个完整的空状态。
- `search-clear` 清掉查询，并恢复最近笔记视图。
- `search-cli` 从终端返回同样的匹配笔记。

## How to get to it (user POV)

- 在浏览器工具栏里选择 `Search` 按钮。
- 焦点不在可编辑字段里时，在浏览器中按 `/`。
- 在终端里跑 `notes search <query>`。

## Driving it with control-notes

Preconditions:

- Notes 在 `http://127.0.0.1:4173` 上是健康的。
- 一次性数据目录里有 `Quarterly plan`，正文为 `Draft budget`。
- `control-notes doctor` 报告的是预期的 URL 和数据目录。

- **工具栏入口。** 选择 `Search` 按钮。跑 `control-notes browser click --role button --name "Search"`。出现一个名为 `Search notes` 的对话框，焦点在它的搜索框里。
- **键盘入口。** 关闭对话框，把焦点放到页面上，然后按 `/`。跑 `control-notes browser press --key "/"`。出现同一个对话框，页面没有插入斜杠。
- **标题匹配。** 输入 `quarterly`。跑 `control-notes browser fill --role searchbox --name "Search notes" --value "quarterly"`。`Search results` 列表包含 `Quarterly plan`，不包含 `Grocery list`。
- **正文匹配。** 把查询换成 `budget`。跑 `control-notes browser fill --role searchbox --name "Search notes" --value "budget"`。结果 `Quarterly plan` 仍然可见，并带一段正文匹配摘录。
- **打开结果。** 选择 `Quarterly plan`。跑 `control-notes browser click --role link --name "Quarterly plan"`。对话框关闭，编辑器标题读作 `Quarterly plan`。
- **空状态。** 重新打开搜索并输入 `volcano`。跑 `control-notes browser fill --role searchbox --name "Search notes" --value "volcano"`。搜索完成后，出现一个名为 `No matching notes` 的状态。
- **清除查询。** 选择 `Clear search`。跑 `control-notes browser click --role button --name "Clear search"`。搜索框是空的，`Recent notes` 区域替换了结果列表。
- **CLI 命中。** 从终端搜索。跑 `control-notes cli -- notes search "quarterly" --format json`。退出码为 `0`，stdout 包含一个对象，其标题为 `Quarterly plan`。
- **CLI 未命中。** 搜索一个不存在的值。跑 `control-notes cli -- notes search "volcano" --format json`。退出码为 `0`，stdout 为 `[]`。
- **证明。** 捕获已经有结果的那个状态。跑 `control-notes browser snapshot --aria --path artifacts/search/results.aria.txt` 和 `control-notes browser screenshot --path artifacts/search/results.png`。两份产物都能辨出 Notes、查询词和 `Quarterly plan`。

## Gotchas

- 编辑器或搜索框持有焦点时按下 `/`，会插入文本，而不是打开搜索。
- 结果会在短暂的 debounce 之后更新。等结果列表或空状态，不要用固定时长的 sleep。
- 归档的笔记会被排除，除非用户启用 `Include archived`。
- CLI 默认给人读的输出。稳定的断言要用 `--format json`。
- 打开一条结果会改变浏览器状态。在证明另一个查询之前，重新打开搜索。

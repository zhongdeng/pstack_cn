# 功能地图示例

把 Benny 可能复现的每一个面向用户的功能都画进这张地图。驱动应用之前先读相关小节。这张地图要始终站在用户视角。内部实现和当前代码路径在运行时去发现，不要在这里写死。

把这个文件复制到 `.cursor/automations/benny/` 之外，比如 `.cursor/benny/feature-map.md`，然后把 `control.feature_map_path` 指向这份副本。包刷新不能覆盖它。

## 单个功能的模板

### `<feature name>`

`<one-line user-visible purpose>`

#### 用户怎么走到这里

- 点击路径：`<screen> -> <menu, tab, or panel> -> <control>`
- 键盘快捷键：`<shortcut or none>`

#### 控制适配器怎么驱动它

- `<adapter action>` 配合 `<inputs>` 应该 `<visible result>`。
- 重置：`<how the adapter returns to a fresh state>`。

#### 稳定选择器

- `<role and accessible name>`
- `<ARIA relationship>`
- `<data-component or purpose-named data attribute>`

绝不要用生成的 CSS 或 StyleX 类名、动态哈希、子节点索引，或者脆弱的 DOM 位置。

#### 要覆盖的状态

- 默认、hover、focus-visible、active、disabled
- 加载中、空、错误
- 已选中、已打开、已展开
- `<relevant feature-specific variants>`

不适用的状态要标出来。

#### 前置条件和准备

- 认证：`<account state>`
- 数据：`<fixture>`
- 权限：`<role>`
- 开关：`<flag or none>`
- 服务：`<required availability>`

#### 证据和交叉核对

- 截图：`<app identity, feature, and discriminating state>`
- 视频：`<entry path, interaction, and final state>`
- 交叉核对：`<read-only state or value that confirms the UI>`

#### 坑

- `<known dead end or wrong surface>`
- `<safe environment translation>`

## 虚构示例

这些功能属于一个虚构的任务应用。它们只是示例，不是 Benny 必须有的功能。

### 登录

让用户进入任务应用。

#### 用户怎么走到这里

- 打开应用，选 `Sign in`。没有快捷键。

#### 控制适配器怎么驱动它

- `open_app`、`click Sign in`、`fill credentials`、`click Continue` 应该打开条目列表。
- 重置方式是退出登录并清掉一次性会话。

#### 稳定选择器

- 按钮 `Sign in`，文本框 `Email` 和 `Password`，`data-component="sign-in-form"`

#### 要覆盖的状态

- 默认、focus-visible、提交中、disabled、加载中、错误

#### 前置条件和准备

- 一次性账号，认证服务可用

#### 证据和交叉核对

- 录制从落地页到条目列表的过程。检查只读的会话状态。

#### 坑

- 营销页是错的界面。认证服务缺失就是阻塞。

### 条目列表和详情

让用户浏览条目并打开其中一个。

#### 用户怎么走到这里

- 打开 `Items` 标签页，然后选一行。

#### 控制适配器怎么驱动它

- `select_tab Items` 和 `click <fixture item>` 应该打开它的详情。
- 重置方式是关掉详情并清空选中。

#### 稳定选择器

- 名为 `Items` 的标签页和列表，按 fixture 命名的行，`data-component="item-detail"`

#### 要覆盖的状态

- 加载中、空、错误、已选中、已打开、已展开

#### 前置条件和准备

- 有名字的 fixture 条目，读权限，条目服务可用

#### 证据和交叉核对

- 展示选中状态和匹配的详情标题。检查选中条目的 ID。

#### 坑

- 搜索结果看起来可能很像，但走的是另一条路径。

### 条目编辑器

让用户创建或编辑条目。

#### 用户怎么走到这里

- 从详情里选 `Edit`，或者从列表里选 `New item`。

#### 控制适配器怎么驱动它

- `click Edit`、`fill <field>`、`click Save` 应该更新详情。
- 重置方式是恢复 fixture。

#### 稳定选择器

- 按钮 `Edit`、`New item`、`Save`，表单 `Item editor`，与 label 关联的字段

#### 要覆盖的状态

- 默认、focus-visible、有未保存改动、校验中、disabled、保存中、错误、成功

#### 前置条件和准备

- 可编辑的 fixture，写权限，保存服务可用

#### 证据和交叉核对

- 展示字段改动到详情更新。只读检查存储的条目值。

#### 坑

- 不要注入表单状态。只读的详情字段不是编辑器。

### 设置

让用户修改个人偏好。

#### 用户怎么走到这里

- 打开个人资料菜单，然后选 `Settings`。

#### 控制适配器怎么驱动它

- `open_menu Profile`、`click Settings`、`toggle <preference>` 应该更新控件。
- 重置方式是恢复初始偏好。

#### 稳定选择器

- 按钮 `Profile`，菜单项 `Settings`，区域 `Settings`，按用途命名的偏好属性

#### 要覆盖的状态

- 已关闭、已打开、已选中、focus-visible、disabled、加载中、错误

#### 前置条件和准备

- 已登录的测试账号，已知的偏好，偏好服务可用

#### 证据和交叉核对

- 展示菜单路径和最终控件状态。只读检查偏好值。

#### 坑

- 操作系统设置是另一个界面。

## 完整性检查清单

- 每个可复现的面向用户的功能都有一个小节。
- 每个小节都写明了用户路径、适配器动作和重置方式。
- 选择器使用角色、名称、ARIA、稳定的组件标记，或者按用途命名的属性。
- 没有选择器使用生成的类名或 DOM 位置。
- 覆盖了相关的交互、加载中、空、错误、已选中和已展开状态。
- 认证、fixture、权限、开关和服务都写清楚了。
- 截图、视频和底层交叉核对的要求都写清楚了。
- 列出了错误界面、死路和安全的环境转换。
- 实现细节留作运行时发现。

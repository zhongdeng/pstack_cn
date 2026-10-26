# 功能映射示例

为 Benny 可能复现的每一个面向用户的功能建立映射。在驱动应用之前阅读相关小节。让这份映射保持在用户视角。内部实现和当前代码路径留到运行时再发现，不要冻结在这里。

把这个文件复制到 `.cursor/automations/benny/` 之外，例如 `.cursor/benny/feature-map.md`，并把 `control.feature_map_path` 设为该副本。包刷新不得覆盖它。

## 每个功能的模板

### `<feature name>`

`<one-line user-visible purpose>`

#### 用户如何到达该功能

- 点击路径：`<screen> -> <menu, tab, or panel> -> <control>`
- 键盘快捷键：`<shortcut or none>`

#### 控制适配器如何驱动它

- `<adapter action>` 搭配 `<inputs>`，应当 `<visible result>`。
- 重置：`<how the adapter returns to a fresh state>`。

#### 稳定选择器

- `<role and accessible name>`
- `<ARIA relationship>`
- `<data-component 或按用途命名的 data 属性>`

绝不要使用生成的 CSS 或 StyleX 类名、动态哈希、子元素序号，或脆弱的 DOM 位置。

#### 需要演练的状态

- 默认（default）、悬停（hover）、焦点可见（focus-visible）、激活（active）、禁用（disabled）
- 加载中（loading）、空（empty）、错误（error）
- 已选中（selected）、打开（open）、展开（expanded）
- `<relevant feature-specific variants>`

标出不适用的状态。

#### 前置条件与准备

- 认证：`<account state>`
- 数据：`<fixture>`
- 权限：`<role>`
- 功能开关：`<flag or none>`
- 服务：`<required availability>`

#### 证据与交叉核对

- 截图：`<app identity, feature, and discriminating state>`
- 视频：`<entry path, interaction, and final state>`
- 交叉核对：`<read-only state or value that confirms the UI>`

#### 易错点

- `<known dead end or wrong surface>`
- `<safe environment translation>`

## 虚构示例

这些功能属于一个虚构的任务应用。它们是示例，不是 Benny 必需的功能。

### 登录

让用户进入这个任务应用。

#### 用户如何到达该功能

- 打开应用并选择 `Sign in`。没有快捷键。

#### 控制适配器如何驱动它

- `open_app`、`click Sign in`、`fill credentials` 和 `click Continue` 应当打开条目列表。
- 通过登出并清除一次性会话来重置。

#### 稳定选择器

- 按钮 `Sign in`，文本框 `Email` 和 `Password`，`data-component="sign-in-form"`

#### 需要演练的状态

- 默认（default）、焦点可见（focus-visible）、提交中（submitting）、禁用（disabled）、加载中（loading）、错误（error）

#### 前置条件与准备

- 一次性账号，以及可用的认证服务

#### 证据与交叉核对

- 录下从落地页直到条目列表的过程。检查只读的会话状态。

#### 易错点

- 营销页面是错误的界面。缺失认证服务则是阻塞。

### 条目列表与详情

让用户浏览条目并打开其中一条。

#### 用户如何到达该功能

- 打开 `Items` 标签页，然后选择一行。

#### 控制适配器如何驱动它

- `select_tab Items` 和 `click <fixture item>` 应当打开它的详情。
- 通过关闭详情并清除选择来重置。

#### 稳定选择器

- 名为 `Items` 的标签页和列表，以 fixture 命名的行，`data-component="item-detail"`

#### 需要演练的状态

- 加载中（loading）、空（empty）、错误（error）、已选中（selected）、打开（open）、展开（expanded）

#### 前置条件与准备

- 具名的 fixture 条目、读取权限、可用的条目服务

#### 证据与交叉核对

- 展示所选内容以及与之匹配的详情标题。检查所选条目的 ID。

#### 易错点

- 搜索结果可能看起来相似，但走的是另一条路径。

### 条目编辑器

让用户创建或编辑一条条目。

#### 用户如何到达该功能

- 在详情中选择 `Edit`，或在列表中选择 `New item`。

#### 控制适配器如何驱动它

- `click Edit`、`fill <field>` 和 `click Save` 应当更新详情。
- 通过恢复 fixture 来重置。

#### 稳定选择器

- 按钮 `Edit`、`New item`、`Save`，表单 `Item editor`，与标签关联的字段

#### 需要演练的状态

- 默认（default）、焦点可见（focus-visible）、已修改（dirty）、校验中（validating）、禁用（disabled）、保存中（saving）、错误（error）、成功（success）

#### 前置条件与准备

- 可编辑的 fixture、写入权限、可用的保存服务

#### 证据与交叉核对

- 展示字段变更，直到更新后的详情。以只读方式检查已存储的条目值。

#### 易错点

- 不要注入表单状态。只读的详情字段并不是编辑器。

### 设置

让用户更改个人偏好。

#### 用户如何到达该功能

- 打开个人资料菜单，然后选择 `Settings`。

#### 控制适配器如何驱动它

- `open_menu Profile`、`click Settings` 和 `toggle <preference>` 应当更新该控件。
- 通过恢复起始偏好来重置。

#### 稳定选择器

- 按钮 `Profile`，菜单项 `Settings`，区域 `Settings`，按用途命名的偏好属性

#### 需要演练的状态

- 关闭（closed）、打开（open）、已选中（selected）、焦点可见（focus-visible）、禁用（disabled）、加载中（loading）、错误（error）

#### 前置条件与准备

- 已登录的测试账号、已知偏好、可用的偏好服务

#### 证据与交叉核对

- 展示菜单路径和最终的控件状态。以只读方式检查偏好值。

#### 易错点

- 操作系统设置是另一个界面。

## 完整性清单

- 每一个可复现的、面向用户的功能都有一节。
- 每一节都写明用户路径、适配器操作和重置方式。
- 选择器使用角色、名称、ARIA、稳定的组件标记，或按用途命名的属性。
- 没有选择器使用生成的类名或 DOM 位置。
- 覆盖了相关的交互、加载中、空、错误、已选中和展开状态。
- 认证、fixture、权限、功能开关和服务都写明了。
- 截图、视频和底层交叉核对的要求都写明了。
- 列出了错误界面、死路，以及安全的环境转译。
- 实现细节仍然留到运行时再发现。

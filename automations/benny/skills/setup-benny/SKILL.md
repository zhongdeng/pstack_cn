---
name: setup-benny
description: 配置 Benny，并准备好它的分诊和复现自动化。在安装 Benny，或修改它的 Slack、跟踪器、仓库、路由、控制、模型、预算设置时使用。
disable-model-invocation: true
---

# 配置 Benny

Benny 作为一套休眠的自动化包随 pstack 一起发布。插件清单只暴露 pstack 常规的技能根目录；本文件和两个运行文件都不是斜杠技能。

人类通过把 Cursor 指向这个包的 `FOR_AGENTS.md` 进入配置流程。引导流程会把整个包复制到目标仓库，然后直接在 `.cursor/automations/benny/skills/setup-benny/SKILL.md` 读取本文件。

Benny 需要外部配置和两个运行中的 Cursor 自动化。

在用户明确要求之前，不要创建或更新任何自动化。绝不要把密钥值写进插件文件、提示词或已提交的配置里。

## 1. 复制包并启用共享的 pstack 技能

在询问 Benny 配置之前、在调用内置的 `/automate` 技能之前，先做这一步。

问清楚哪个仓库会运行这些自动化。源包就是包含 `FOR_AGENTS.md` 的那个目录。目标是 `<target-repository>/.cursor/automations/benny/`。

把整个源包合并进目标目录：

1. 目标目录不存在时先创建。
2. 把每个源文件复制到相同的相对路径。
3. 保留目标目录独有的文件。安装或刷新时绝不删除无关文件。
4. 用户自有的配置、功能地图和路由地图放在目标目录之外。绝不覆盖它们。
5. 当某个由源管理的已有文件存在差异时，检查 diff 并合并，不要丢弃本地改动。如果归属不明确，停下来先问再替换。
6. 确认目标目录包含 `FOR_AGENTS.md`、本配置文件、两个运行文件、它们的参考文档以及模板。

如果本文件已经是从目标目录读取的，就把复制视为已完成，并在继续之前跑同样的校验。

把 pstack 加到目标仓库的 `.cursor/settings.json`。如果文件或 `.cursor` 目录不存在，就创建它们。

把下面这一项合并进已有的 JSON 或 JSONC：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

保留每一个无关的顶层设置和每一个其他插件条目。如果 `plugins.pstack` 已存在，只改它的 `enabled` 值。文件是 JSONC 时，保留注释和合法的 JSONC 语法。编辑后校验文件。

重新加载目标项目，或在目标仓库下启动一个新的智能体。确认这些共享的 pstack 技能能从项目作用域解析到：

- `how`
- `why`
- `tdd`
- `unslop`
- `principle-separate-before-serializing-shared-state`
- `principle-minimize-reader-load`
- `principle-guard-the-context-window`
- `principle-sequence-verifiable-units`
- `principle-fix-root-causes`
- `principle-prove-it-works`

不要把从当前会话或用户作用域插件加载的技能算进去。这项检查必须证明：目标仓库里的新智能体是通过项目设置拿到 pstack 的。

如果项目作用域的插件安装不可用，或任何共享依赖解析不到，停下来并说明失败原因。

Benny 的文件直接从 `.cursor/automations/benny/` 读取。不要把这个目录加进插件清单，也不要指望它的 `SKILL.md` 文件出现在斜杠技能列表里。

告诉用户：在启用任何一个自动化之前，`.cursor/settings.json`、`.cursor/automations/benny/` 以及任何被引用的无密钥配置都必须提交。除非用户要求，否则不要提交它们。

这项检查通过后，运行中的自动化提示词可以按稳定的仓库相对路径读取已提交的运行文件。它们不得内嵌插件缓存路径，也不得复制文件内容。

## 2. 调整配置

打开这些复制过来的示例：

- `../../templates/configuration.example.yaml`
- `../reproduce-and-fix-issues/references/feature-map.example.md`

在 `.cursor/automations/benny/` 之外创建用户自有的副本。这些是配置文件，不是包文件。示例位置：

- 项目配置，例如 `.cursor/benny/configuration.yaml`
- 项目功能地图，例如 `.cursor/benny/feature-map.md`
- 项目路由地图，例如 `.cursor/benny/routing.md`
- 用户配置，例如 `~/.config/benny/configuration.yaml`
- 用户功能地图，例如 `~/.config/benny/feature-map.md`

为自动化可能复现的每个面向用户的功能填好一节功能地图。保持用户视角。不要把实现细节或当前代码路径固化进地图。

不要编辑复制过来的示例。包刷新在冲突审查后可能更新由源管理的文件，但绝不能碰用户自有的副本。

当全新的自动化检出需要读取时，优先用目标仓库里已提交的无密钥文件。否则把所需的值转述进运行中的提示词。只有在内置的 `/automate` 技能确认文件已提交在自动化运行所在的仓库之后，才引用仓库文件。

已提交的包文件和配置文件使用稳定的仓库相对路径。绝不要在运行中的自动化里引用插件源目录或插件缓存路径。

## 3. 填写必需的选项

询问或确认：

- 源 Slack 频道 ID
- 可选的运维或状态频道 ID
- 仓库 URL 和默认分支
- 分诊身份或 Slack 用户 ID
- 问题跟踪器类型、团队、项目、标签和接收状态
- 跟踪器适配器技能或 MCP 动作
- 可选的路由地图路径
- 必需的控制技能名称
- 必需的面向用户功能地图路径
- 状态 emoji 字符串
- Pull request URL 格式
- 轮询和投入预算
- 分诊、复现、代码工作和媒体审查所用的模型 slug

只用用户 Cursor 模型选择器或受支持模型列表里显示为可用的模型 slug。不要猜 slug，也不要沿用某个私有默认值。

源频道、分诊身份、仓库、跟踪器适配器、控制技能和功能地图必须明确。任何必需的值仍然含糊，就让配置失败。

在保存最终的自动化名称、描述和提示词垫片之前，用 pstack 的 `unslop` 技能处理它们。

## 4. 检查集成能力

分诊自动化需要：

- 对已配置源 Slack 频道及其线程的读取权限
- 在该频道内的线程回复权限
- 报告包含媒体时的附件元数据和文件下载权限
- 通过已配置的问题跟踪器适配器进行搜索、读取、创建和更新的权限

复现自动化需要：

- 对源线程的读取权限
- 在源频道内的线程回复权限
- 在已配置运维频道里可选的发帖和编辑权限
- 仓库读取和历史访问权限
- 能开草稿 pull request 的 pull request 动作
- 已配置的控制适配器技能

读取和发帖优先用已配置的 Cursor Slack 动作。可选的 `BENNY_SLACK_BOT_TOKEN` 可以补一个很窄的缺口，比如编辑一条运维状态消息或下载一个附件。把值存在密钥管理器或环境变量里，不要放在 YAML 里。

不要使用未文档化的集成端点。

## 5. 准备路由地图

如果用户想要改派或 @ 负责人：

1. 把 `../triage-issue-reports/references/routing.example.md` 复制到 `.cursor/automations/benny/` 之外。
2. 把每个占位符替换成公开值或组织内部值。
3. 默认关闭负责人 @。
4. 只对已配置的功能负责人或已确认的可能回归作者允许 @。

如果没有配置路由地图，分诊可以给报告分类，但不得猜测目标或负责人。

## 6. 验证控制适配器

阅读 `../reproduce-and-fix-issues/references/control-adapter.md` 和用户填好的功能地图。

确认指定的技能能够：

- 启动目标应用
- 通过真实 UI 走遍每个已映射的功能
- 通过声明的适配器动作触发已映射的状态
- 检查状态而不强行制造结果
- 截图
- 开始和停止录制
- 清理自己的进程和临时数据

如果缺少任何一项能力，就让复现自动化保持禁用。它必须失败关闭，而不是声称做过一次它其实没做的复现。
## 7. 准备线上自动化

先问清楚这是首次创建，还是配置已有的自动化。

无论走哪条路径，都从复制过来的包里读 `../../FOR_AGENTS.md`，把它作为用户意图的主要来源。用它理解两个触发器、工具、指令、结果和共享规则。

### 首次创建

一次只创建一个自动化。

对每个自动化：

1. 读对应的已复制提示词模板，作为次要的内部素材。
2. 把 `FOR_AGENTS.md`、已完成的 Benny 配置和模板意图，整合成一段完整的自然语言请求。
3. 告诉线上提示词去读取并遵循 `.cursor/automations/benny/` 下它对应的、已提交的精确操作文件。
4. 用仓库内的稳定相对路径，不要用插件源路径或缓存路径。不要把操作文件的内容复制进线上提示词。
5. 读取并遵循内置的 `automate` 技能。
6. 让 `automate` 去发现 Slack 频道、仓库和已连接的集成。
7. 让 `automate` 确认复制过来的包和所有被引用的配置文件，都提交在自动化将要运行的那个仓库里。
8. 让 `automate` 展示它的草稿表格，取得批准，询问是否就绪，然后打开 Automations 编辑器。
9. 先把当前这个自动化的编辑器交接做完，再开始下一个。

把下面这段完整的分诊意图交给 `automate`，内容从配置里填好：

- 名称 `benny-triage`。
- 每次运行都读取并遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。
- 在配置的源 Slack 频道里，每条新的顶层报告都触发。
- 读取触发的那条 thread，只在里面回复。
- 使用配置好的 issue-tracker 集成。
- 分类、检查证据、追踪原因、去重，只创建明确的新 bug。
- 以一条只发在 thread 里的结论收尾，带上配置好的 `[benny:bug]`、`[benny:performance]` 或 `[benny:other]` 标记，以及可选的 tracker URL。
- 绝不在源频道发根消息。

分诊的编辑器交接完成后，把下面这段完整的复现与修复意图交给 `automate`：

- 名称 `benny-reproduce`。
- 每次运行都读取并遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。
- 在配置的源 Slack 频道里，同样由新的顶层报告触发。
- 使用配置好的仓库和默认分支。
- 读取源 thread，只在里面回复。
- 包含创建 pull request，以及配置好的 tracker、control-adapter 和 feature-map 要求。对映射出的用户路径和状态做转述，除非 `automate` 确认同一仓库里存在符合条件的已提交文件。
- 等到可信的分诊标记再动手。
- 通过映射出的真实 UI 把确切症状复现两次，并留下证据。
- 验证已有的修复，不要在上面另写一套。
- 只有在复现确认之后，才尝试一个可选的有界修复，然后在证据和检查都通过时开一个 draft pull request。
- 绝不在源频道发根消息。

不要重复 `automate` 已经做的 Slack、仓库、集成、完整性、认证、草稿评审、批准、就绪或编辑器交接工作。

### 已有的自动化

内置的 `automate` 技能只负责创建。不要用它去搜索、检查或更新已有的自动化。

先完成配置、路由、control-adapter 和 feature-map 的校验。然后给用户下面这份简明的编辑器清单。

对已有的分诊自动化，更新：

- 名称和描述
- 直接指示去读 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`
- 新的顶层 Slack 报告触发器和源频道
- 读取和回复 Slack thread 的能力
- issue-tracker 集成
- 转述过的分诊指令、只发 thread 的规则，以及 Benny 结论标记

对已有的复现自动化，更新：

- 名称和描述
- 直接指示去读 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`
- 对应的 Slack 触发器和源频道
- 仓库和默认分支
- 读取和回复 Slack thread 的能力
- 创建 pull request 的动作
- tracker、control-adapter 和 feature-map 要求
- 转述过的等待标记、证据、验证和有界修复指令

请用户直接在各自的 Automations 编辑器里更新每个已有的自动化。不要创建替代品或副本。

### 创建边界

绝不要直接调用自动化的后端服务或后端自动化工具。绝不要使用带草稿字段的浏览器 URL。绝不要构造或打开 Cursor 协议深链。对新的自动化，唯一的完成路径是内置 `automate` 技能经过评审的 Automations 编辑器交接。

在编辑器保存后 thread 安全测试通过之前，不要启用任何一个自动化。

## 8. 测试 thread 安全

用一个测试频道，或者一条无害的测试报告。

测试之前，确认目标仓库的 `.cursor/settings.json`、`.cursor/automations/benny/`，以及每个被引用的、不含密钥的配置文件，都提交在自动化检出所用的那个分支上。确认两条线上提示词都指向它们各自已提交的精确操作文件。任何一项检查不过，就停下来。告诉用户这个自动化暂时还不能启用。

验证：

1. 分诊保存根 `thread_ts`，并且只发一条结论作为回复。
2. 结论里只包含一个配置好的标记。
3. 复现只接受来自配置好的分诊身份的那个标记。
4. 复现保持同一组不可变的源坐标。
5. 源频道里不出现根消息。
6. 被委派的 worker 不能使用任何 Slack 写操作。
7. 坐标缺失、父消息被删或预检失败时，不发帖，也不建 tracker issue。

七项检查全部通过后，才放正常流量进来。

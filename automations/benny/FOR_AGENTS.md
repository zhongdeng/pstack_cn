# benny 自动化意图

## 我想自动化什么

我想要两个 Cursor 自动化，在同一个 Slack issue 频道里协同工作。

### 自动化 1：分诊 issue 报告

- 触发条件：当有人在我配置的源 Slack 频道里发出一条新的顶层报告时，我希望这个自动化从那条报告开始，并保留它原来的 thread 坐标。
- 行为：我希望它读取 thread 和附件，把报告归类为 bug 或性能问题、功能请求、问题或反馈，或者改派，并在路由之前追查可能的归属层。
- tracker：我希望它在配置的 tracker 里搜索重复项，更新有把握的重复项，只在明确是净新增 bug 时才创建工单。
- 工具：我希望有 Slack thread 读取和回复权限、我配置的 tracker 集成，以及我可选的路由映射。
- 结果：我希望在源 thread 里恰好有一条回复，带一句简短结论和 `[benny:bug]`、`[benny:performance]` 或 `[benny:other]`。bug 或性能标记可以带上 tracker url。
- 边界：我绝不要这个自动化在源频道里发根消息。

### 自动化 2：复现并修复已确认的 bug

- 触发条件：我希望这个自动化从同一条新的顶层报告开始，或者从设置时选定的另一个受支持的触发器开始，然后在原 thread 里等待可信的分诊标记。
- 关卡：当有人明确负责修复时，我希望它停下来。如果已有 pull request 或已合并的 commit 可能修复了这条报告，我希望做验证，而不是另起一个竞争性的改动。
- 行为：我希望它使用我配置的控制适配器和功能映射，通过真实 ui 把确切症状复现两次，并截取截图、视频，以及做一次只读状态交叉核对。
- 修复：我希望它验证已有的 pull request，而不是在其之上另写。确认复现之后，它可以尝试一次有边界的根因修复，在测试成本低时使用 tdd，对影响范围做冒烟测试，并且只在前后对比证据通过时才开一个 draft pull request。
- 工具：我希望有 Slack thread 读取和回复权限、仓库和历史访问权限、draft pull request 创建权限、我配置的 tracker，以及我的控制适配器。
- 结果：我希望在源 thread 或可选的操作 thread 里有证据和已验证的结果，外加一个可选的 draft pull request。更新应当简洁。
- 边界：我绝不要这个自动化在源频道里发根消息。

### 共享规则

- 我希望源频道和根 thread 坐标在整个运行期间保持不变。
- 我把工具类和调试类机器人当作证据，而不是委托或修复归属。
- 我允许子智能体帮忙，但它们不能向 Slack 发帖，也不能拿到 Slack 凭据。
- 我希望整个包提交到目标仓库的 `.cursor/automations/benny/`。它的 `SKILL.md` 文件是直接的自动化指令，不是注册的插件技能。
- 我希望只通过目标仓库已提交的 `.cursor/settings.json` 启用 pstack，且只用于共享依赖，比如 `how`、`why`、`tdd`、`unslop`，以及所需的原则技能。
- 我希望每个线上自动化提示直接读取它已提交的操作文件。我不要插件缓存路径、复制出来的摘录，也不要 slash 技能发现。
- 我把用户自有的配置、功能映射、路由映射和密钥放在 `.cursor/automations/benny/` 之外，这样刷新包时不会覆盖它们。
- 当频道坐标、tracker 访问、控制适配器或功能映射缺失或不确定时，我希望两个自动化都 fail closed。
- 我只想要 draft pull request。不要合并或部署。

### 我的配置

- 源 Slack 频道：`<channel>`
- 可选操作频道：`<channel or none>`
- 仓库和默认分支：`<repo>`、`<branch>`
- tracker：`<type, team, project, labels, intake status>`
- 路由映射：`<path or none>`
- 分诊身份：`<slack identity>`
- 控制技能：`<configured skill or adapter>`
- 功能映射：`<committed same-repo path outside the copied pack, or behavior to paraphrase>`
- 模型：`<triage, reproduce, code, media review>`
- 状态 emoji 字符串：`<seen, reproducing, reproduced, blocked, fixing, failed, pull request opened>`
- 预算：`<polling, verdict wait, follow-up, repro, rejection, fix>`
- 可选的 bot token 能力：`<none, file download, or editable operations status>`

从 [`configuration.example.yaml`](./templates/configuration.example.yaml) 和 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md) 开始。把它们复制并填写到这个包之外，比如放在 `.cursor/benny/` 下。把密钥值放在密钥管理器或环境变量里。

## 给智能体

人类通过把 Cursor 指向这个文件来进入设置流程。不要去找或调用一个被发现的 benny slash 技能。

1. 问清楚哪个仓库将运行这些自动化。
2. 把包含这个 `FOR_AGENTS.md` 的目录当作源包。
3. 把整个源包合并进 `<target-repository>/.cursor/automations/benny/`。
4. 保留每一个仅存在于目标位置的文件。绝不要删除无关文件，也不要覆盖用户自有的配置、功能映射或路由映射。
5. 当源管理的路径上已存在目标文件且内容不同时，审查 diff 并合并，不要丢弃本地修改。如果归属不明确，停下来先问再替换。
6. 确认复制过去的 `FOR_AGENTS.md` 和 `skills/setup-benny/SKILL.md` 存在于目标仓库中。
7. 直接从目标仓库读取并遵循 `.cursor/automations/benny/skills/setup-benny/SKILL.md`。

我希望你把下面这条配置合并进目标仓库的 `.cursor/settings.json`：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

保留每一个无关的设置和插件。当现有文件使用 jsonc 时，保留注释和合法的 jsonc 语法。

我希望由一个以目标仓库为根的全新智能体来做验证。确认 pstack 的 `how`、`why`、`tdd`、`unslop`，以及 benny 用到的原则技能，都能在项目作用域内解析。不要算上从当前会话或用户作用域安装加载的技能。

如果项目作用域的插件不可用，或者任何共享依赖无法解析，就停下来并说明哪里失败了。不要把 `.cursor/automations/benny/skills/` 加进插件清单，也不要指望它的文件出现在 slash 技能列表里。

告诉我，在启用任一自动化之前，`.cursor/settings.json`、`.cursor/automations/benny/`，以及任何被引用的不含密钥的配置都必须先提交。在我明确要求之前，不要创建或更新自动化。

首次创建时，用内置的 `/automate`，分诊一次、复现并修复一次。先把第一个自动化的草稿审查、批准、就绪检查和 Automations 编辑器交接全部完成，再开始第二个。

把这份意图和最终配置改写成每个草稿的内容。分诊提示必须读取并遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。复现提示必须读取并遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。只有在 `/automate` 确认这些仓库相对路径已提交到自动化将要运行的仓库之后，才使用它们。

对于已有的自动化，不要用 `/automate` 去查看或更新它们。先验证配置，然后用复制过去的设置文件里那份简洁的字段清单，这样我就能直接在各自的编辑器里编辑每个自动化。不要创建重复项。

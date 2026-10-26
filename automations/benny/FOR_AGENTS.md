# benny automation 意图

## 我想自动化什么

我想要两个 Cursor automation，在同一个 Slack 问题频道里一起工作。

### automation 1：分诊问题报告

- 触发：有人在我配置的来源 Slack 频道发一条新的顶层报告时，我希望这个 automation 从那份报告开始，并保住它原来的线程坐标。
- 行为：我希望它阅读线程和附件，把报告分成 bug 或性能问题、功能请求、提问或反馈，或者改道，并在路由之前追溯可能负责的层。
- 跟踪器：我希望它在我配置的跟踪器里搜索重复项，更新一个有把握的重复项，并且只为清晰的全新 bug 创建工单。
- 工具：我希望有 Slack 线程的读取和回复权限、我配置的跟踪器集成，以及可选的路由表。
- 结果：我希望来源线程里恰好有一条回复，带一段简短裁决，以及 `[benny:bug]`、`[benny:performance]` 或 `[benny:other]`。bug 或性能标记可以带上跟踪器 URL。
- 边界：我绝不希望这个 automation 在来源频道发一条根消息。

### automation 2：复现并修复已确认的 bug

- 触发：我希望这个 automation 从同一条新的顶层报告开始，或从安装时选定的另一种受支持触发器开始，然后在原线程里等待可信的分诊标记。
- 门：有人已经明确负责修复时，我希望它停下。如果已有的拉取请求或已合并的提交可能修好这份报告，我希望做验证，而不是再写一份竞争的改动。
- 行为：我希望它使用我配置的控制适配器和功能地图，通过真实 UI 把那个确切症状复现两遍，并捕获截图、视频，以及一次只读的状态交叉核对。
- 修复：我希望它核对应有的拉取请求，不要在它们上面另写一套。复现确认之后，它可以尝试一次有边界的根因修复，测试便宜时使用 tdd，对爆炸半径做冒烟，并且只有前后证明都通过时才打开一个草稿拉取请求。
- 工具：我希望有 Slack 线程的读取和回复权限、仓库和历史访问、创建草稿拉取请求、我配置的跟踪器，以及我的控制适配器。
- 结果：我希望证据和已验证的结果出现在来源线程或可选的运营线程里，外加一个可选的草稿拉取请求。更新应当简短。
- 边界：我绝不希望这个 automation 在来源频道发一条根消息。

### 共享规则

- 我希望来源频道和根线程坐标在整个运行期间保持不可变。
- 我把工具机器人和调试机器人当作证据，而不是委派或修复的所有权。
- 我允许子智能体帮忙，但它们不能往 Slack 发帖，也不能拿到 Slack 凭证。
- 我希望整个包提交在目标仓库的 `.cursor/automations/benny/`。其中的 `SKILL.md` 是直接的 automation 指令，不是已注册的插件技能。
- 我希望只通过目标仓库已提交的 `.cursor/settings.json` 启用 pstack，而且只为了共享依赖，例如 `how`、`why`、`tdd`、`unslop`，以及需要的原则技能。
- 我希望每个上线的 automation 提示词直接阅读它已提交的操作文件。我不要插件缓存路径、摘抄的副本，或斜杠技能发现。
- 我把用户自己的配置、功能地图、路由表和密钥放在 `.cursor/automations/benny/` 之外，这样包刷新不能覆盖它们。
- 当频道坐标、跟踪器访问、控制适配器或功能地图缺失或不确定时，我希望两个 automation 都失败关闭。
- 我只要草稿拉取请求。不要合并，也不要部署。

### 我的配置

- 来源 Slack 频道：`<channel>`
- 可选的运营频道：`<channel or none>`
- 仓库和默认分支：`<repo>`、`<branch>`
- 跟踪器：`<type, team, project, labels, intake status>`
- 路由表：`<path or none>`
- 分诊身份：`<slack identity>`
- 控制技能：`<configured skill or adapter>`
- 功能地图：`<committed same-repo path outside the copied pack, or behavior to paraphrase>`
- 模型：`<triage, reproduce, code, media review>`
- 状态 emoji 字符串：`<seen, reproducing, reproduced, blocked, fixing, failed, pull request opened>`
- 预算：`<polling, verdict wait, follow-up, repro, rejection, fix>`
- 可选的 bot token 能力：`<none, file download, or editable operations status>`

从 [`configuration.example.yaml`](./templates/configuration.example.yaml) 和 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md) 开始。把它们复制到这个包之外再填写，例如 `.cursor/benny/` 下面。密钥放在密钥管理器或环境变量里。

## 给智能体

人通过让 Cursor 指向这个文件来进入安装。不要去找，也不要调用一个被发现的 benny 斜杠技能。

1. 询问哪个仓库将运行这些 automation。
2. 把包含这份 `FOR_AGENTS.md` 的目录当作源包。
3. 把整个源包合并进 `<target-repository>/.cursor/automations/benny/`。
4. 保留每一个目标端独有的文件。绝不删除无关文件，也不要覆盖用户自己的配置、功能地图或路由表。
5. 当一条由源管理的路径上已有目标文件，且内容不同时，审阅 diff 并合并，不要丢掉本地编辑。如果所有权含糊，先停下来问，再替换。
6. 确认复制后的 `FOR_AGENTS.md` 和 `skills/setup-benny/SKILL.md` 存在于目标仓库。
7. 直接从目标仓库阅读并遵循 `.cursor/automations/benny/skills/setup-benny/SKILL.md`。

我希望你把下面这项合并进目标仓库的 `.cursor/settings.json`：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

保留每一个无关的设置和插件。如果现有文件使用 jsonc，就保留注释和合法的 jsonc 语法。

我希望验证来自一个根在目标仓库的新智能体。确认 pstack 的 `how`、`why`、`tdd`、`unslop`，以及 benny 用到的原则技能，能在项目范围内解析。不要把当前会话或用户范围安装里加载的技能算进去。

如果项目范围的插件不可用，或任何共享依赖解析不到，就停下来并说明失败了什么。不要把 `.cursor/automations/benny/skills/` 加进插件清单，也不要指望这些文件出现在斜杠技能列表里。

告诉我：启用任一 automation 之前，必须先提交 `.cursor/settings.json`、`.cursor/automations/benny/`，以及任何被引用的、不含密钥的配置。在我明确要求之前，不要创建或更新 automation。

第一次创建时，分诊用一次内置的 `/automate`，复现和修复再用一次。先完成第一个 automation 的草稿审阅、批准、就绪检查，以及 Automations 编辑器交接，再开始第二个。

把这份意图和完成的配置改述进每一份草稿。分诊提示词必须阅读并遵循 `.cursor/automations/benny/skills/triage-issue-reports/SKILL.md`。复现提示词必须阅读并遵循 `.cursor/automations/benny/skills/reproduce-and-fix-issues/SKILL.md`。只有在 `/automate` 确认这些仓库相对路径已经提交到 automation 将要运行的仓库之后，才使用它们。

对于已有的 automation，不要用 `/automate` 去检查或更新它们。先验证配置，然后使用已复制的安装文件里那份简短的字段清单，让我可以在各自的编辑器里直接编辑每个 automation。不要制造重复。

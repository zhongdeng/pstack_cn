# benny

benny 给你两个处理 Slack 问题报告的 Cursor automation。一个分诊每一份报告。另一个复现已确认的 bug，并可能准备一个小的草稿修复。

这个目录里的文件是休眠的安装与 automation 源。它们不会作为斜杠技能出现。

## 安装

1. 让 Cursor 读 [`FOR_AGENTS.md`](./FOR_AGENTS.md)，并点名目标仓库。
2. 让安装把整个目录合并进目标仓库的 `.cursor/automations/benny/`。它必须保留目标端独有的文件，冲突时先审阅，不要覆盖本地编辑。
3. 让安装在目标仓库的 `.cursor/settings.json` 里启用 pstack，以便使用共享依赖：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

4. 把用户自己的配置放在复制包之外，例如 `.cursor/benny/`。改写 [`configuration.example.yaml`](./templates/configuration.example.yaml) 和 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md)。
5. 启用任一 automation 之前，先提交 `.cursor/settings.json`、`.cursor/automations/benny/`，以及任何不含密钥的配置。
6. 审阅每个新建的 automation 草稿，或在它们的编辑器里更新已有的 automation。然后发送一条无害的测试报告，并确认来源频道的每一条帖子都留在原来的线程里。

# benny

benny 给你两个针对 slack 问题报告的 cursor 自动化。一个负责分诊每份报告。另一个复现已确认的 bug，并可能准备一个小型草稿修复。

这个目录里的文件是休眠的安装配置和自动化源文件。它们不会作为 slash 技能出现。

## 安装

1. 让 cursor 指向 [`FOR_AGENTS.md`](./FOR_AGENTS.md)，并指定目标仓库。
2. 让安装流程把整个目录合并到目标的 `.cursor/automations/benny/`。它必须保留目标端独有的文件，遇到冲突要提出来评审，而不是覆盖本地改动。
3. 让安装流程在目标仓库的 `.cursor/settings.json` 里启用 pstack，用于共享依赖：

```json
{
	"plugins": {
		"pstack": { "enabled": true }
	}
}
```

4. 把用户自己的配置放在复制包之外，比如 `.cursor/benny/`。参照 [`configuration.example.yaml`](./templates/configuration.example.yaml) 和 [`feature-map.example.md`](./skills/reproduce-and-fix-issues/references/feature-map.example.md) 做适配。
5. 在启用任一自动化之前，先提交 `.cursor/settings.json`、`.cursor/automations/benny/` 以及所有不含密钥的配置。
6. 在各自的编辑器里评审每个新建的自动化草稿，或更新已有的自动化。然后发一份无害的测试报告，确认每条发到源频道的帖子都留在原来的 thread 里。

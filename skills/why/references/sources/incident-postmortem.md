# 事故与复盘背景

- **Linear**：找带 `incident`、`sev-*`、`postmortem-action-item`、`reliability` 标签的工单
- **Slack**：在目标代码加入的时间点前后，搜 `#sev-*` 和 `#incident-*` 频道
- **Git**：提交信息里出现 "fix for incident"、"add defensive check"、"revert" 后面又跟 "re-apply with..." 这类，都是很强的信号

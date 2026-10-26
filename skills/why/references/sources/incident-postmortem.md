# 事故与复盘上下文

- **Linear**：查找标有 `incident`、`sev-*`、`postmortem-action-item`、`reliability` 的工单
- **Slack**：在目标代码加入前后的日期附近，搜索 `#sev-*` 和 `#incident-*` 频道
- **Git**：提交说明类似 "fix for incident"、"add defensive check"，或先 "revert" 再 "re-apply with..." 的，是强烈信号

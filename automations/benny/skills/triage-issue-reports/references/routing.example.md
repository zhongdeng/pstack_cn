# 路由表示例

把这个文件复制到 `.cursor/automations/benny/` 之外，比如 `.cursor/benny/routing.md`，然后把每个占位符都替换掉。让 `routing.map_path` 指向这份副本。包刷新时不能覆盖它。

triage 技能把它当数据用。一条路由需要报告或原因追踪里的证据。光靠关键词匹配不够。

```yaml
routes:
  - name: "billing-example"
    match:
      product_areas:
        - "billing-area-placeholder"
      code_paths:
        - "billing-code-path-placeholder"
      error_signatures:
        - "billing-error-placeholder"
    destination:
      slack_channel: "billing-channel-placeholder"
      tracker_team: "billing-team-placeholder"
    owners:
      - "billing-owner-placeholder"
    allow_feature_owner_ping: false

  - name: "desktop-example"
    match:
      product_areas:
        - "desktop-area-placeholder"
      code_paths:
        - "desktop-code-path-placeholder"
      error_signatures:
        - "desktop-error-placeholder"
    destination:
      slack_channel: "desktop-channel-placeholder"
      tracker_team: "desktop-team-placeholder"
    owners:
      - "desktop-owner-placeholder"
    allow_feature_owner_ping: false

fallback:
  destination: ""
  owners: []
  allow_feature_owner_ping: false

ping_policy:
  default: "off"
  allow:
    - "configured-feature-owner"
    - "confirmed-regression-author"
  deny:
    - "broad-on-call-group"
    - "unverified-owner"
```

## 规则

- 除非有一个团队接收所有未匹配的报告，否则把 `fallback.destination` 留空。
- 用稳定的产品区域、代码路径和错误签名。
- 公开的副本里不要放私有数据。
- 不要往要发布的示例里粘贴原始的用户 ID 或频道 ID。
- 在目标团队同意之前，功能负责人 ping 保持关闭。
- 改路由只是告诉报告人去哪儿。自动化从不跨频道转发。

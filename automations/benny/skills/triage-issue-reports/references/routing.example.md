# 路由表示例

把这个文件复制到 `.cursor/automations/benny/` 之外，例如 `.cursor/benny/routing.md`，并替换每一个占位符。让 `routing.map_path` 指向这份副本。包刷新不得覆盖它。

分诊技能把这当作数据。一条路由需要来自报告或原因追溯的证据。仅有关键词匹配不够。

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
- 使用稳定的产品区域、代码路径和错误签名。
- 不要在公开副本里放私人数据。
- 不要把原始的用户或频道 ID 贴进一份将会发布的示例。
- 在目标团队同意之前，保持功能所有者的 ping 关闭。
- 改道会告诉报告人该去哪里。automation 绝不交叉发帖。

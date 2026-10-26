# Bugbot 分诊

当 Babysit 手册（`../playbooks/babysit.md`）处理 Bugbot 或审查自动化评论时，用这份参考。目标不是默认忽略 Bugbot。目标是不再把每一条评论都当成必须改代码。

## 决定量规

行动之前先给每条 Bugbot 线程分类：

- `fix`（修复）：评论指出一个说得通的正确性、安全、隐私、数据丢失、认证、计费、迁移、幂等、竞态，或已交付行为的问题。在拥有这段代码的最低 PR 里修，然后回复提交 SHA 并解决该线程。
- `dismiss`（驳回）：评论符合一条已记录的低风险噪声模式，并且当前代码/上下文证明这个顾虑不需要改代码。回复一句短理由并解决该线程。
- `ask`（询问）：评论是新的、高严重性的、与安全/隐私/数据相关的，或含糊的。去问用户，不要猜。

拿不准就问。跳过一条吵闹的代码质量评论代价很低；跳过一个真的数据或安全缺陷则不是。

## 已学模式的格式

以后的模式按这个形状追加：

```markdown
### <short pattern name>

- Confidence: candidate | recurring | strong
- Skip when: <conditions that must be true>
- Do not skip when: <risk boundaries>
- Example signal: <phrases or code context that identify the pattern>
- Source: <PR/comment URL or short historical note>
```

一两个例子用 `candidate`。多次真实驳回之后用 `recurring`。只有模式很窄、反复核实过、并且低风险时才用 `strong`。

## 反复出现的可跳过候选

### 有意的 UI 或设计系统视觉改动

- Confidence: candidate
- Skip when: PR 描述、截图、设计审查或附近代码把这次视觉改动说得很明确，并且 Bugbot 评论只是在重述一个共享视觉默认值变了。
- Do not skip when: 评论指向无障碍、焦点可见性、键盘导航、颜色对比度，或一个本 PR 并非有意改动的组件 API 契约。
- Example signal: 关于焦点轮廓、按钮尺寸、间距或共享组件视觉默认值的评论，负责人回复 "intentional" 或 "intended"。

### Bugbot 看不见的栈上方或栈内用法

- Confidence: candidate
- Skip when: Bugbot 把一个导出、组件、辅助函数或文件标成未使用，而当前托管平台的 PR 列表和 diff、栈上方 diff 或 PR 上下文显示它被栈里更后面的 PR 使用。
- Do not skip when: 当前 PR 不属于一个栈，该符号是公开 API，或所谓的栈上方用法无法核实。
- Example signal: "Exported component is never used"，并有人回复类似 "used upstack"。

### 并行实现期间的临时重复

- Confidence: candidate
- Skip when: PR 有意重复一小段代码，让一条新路径与一条正在被删除、替换或验证的旧路径保持并行。
- Do not skip when: 重复的代码改动了安全、计费、数据访问、API 行为，或者一个长期存在的共享抽象明显能降低风险。
- Example signal: "Significant duplication" 或 "duplicated validation logic"，负责人解释旧路径将被删除，或重复逻辑有意保持局部。

### 已有框架或组件不变量覆盖了这条警告

- Confidence: candidate
- Skip when: 这个顾虑已经被当前 diff 或附近代码里看得见的共享组件、框架契约、类型不变量或单一事实来源保证。
- Do not skip when: 不变量只是被假定而没有被强制，依赖时序，或跨过值可能分叉的异步/状态边界。
- Example signal: 关于内层 popover 缺少 max-height 的评论，而共享 popover 已经强制视口边界；或者可空值的评论，而本地检查过的值和传入的值共享同一来源。

### 负责人声明的后续或推迟的清理

- Confidence: candidate
- Skip when: PR 负责人明确说这个问题是已知的后续，当前 PR 没有让行为变得更糟，并且评论不涉及高风险区域。
- Do not skip when: 代理在没有负责人输入的情况下行动，问题是中/高严重性的产品行为，或推迟会合并进一个新的回归。
- Example signal: "I'll worry about that later" 或 "we'll delete this eventually"。

### 自行撤回或明确的假阳性规则评论

- Confidence: recurring
- Skip when: 评论正文或后来的 Bugbot 回复明确说该发现已撤回、已合规，或是假阳性，并且代理能在本地核实相关规则。
- Do not skip when: 唯一证据是一个人在高风险问题上说 "false positive"，却没有解释。
- Example signal: 一条文件命名规则评论，其正文说该文件已经合规。

## 默认去问

即使以前的 PR 驳回过类似的东西，也不要自动跳过这些类别：

- 安全、隐私、认证、计费、数据保留、训练数据，以及权限边界的发现。
- 高严重性的发现。
- 迁移、schema、幂等、并发，以及跨系统行为的发现。
- 建议的修复很小，并且在不改变产品意图的前提下明确降低风险的评论。

历史数据显示，人有时会驳回安全/数据流评论。把那些当成负责人的判断，而不是全团队的跳过规则。

## 最近 babysit 里的候选教训

在 babysit 期间或之后，当它们看起来对团队有用但还不成熟时，把新的候选教训追加到这里。一旦几条 PR 确认了这个模式，优先把反复出现的候选提升到上面那一节。

### 对浏览器原生行为的手工重实现

- Confidence: candidate
- Skip when: 实际上从不跳过。当一个 diff 用手工等价物替换浏览器原生行为（原生 sticky → JS 定位的克隆、原生滚动定位 → 转发的滚轮/触摸事件、绘制顺序遮挡 → mask/clip-path）时，Bugbot 针对这段代码的逻辑缺陷发现一直是成立的。
- Do not skip when: 发现涉及事件转发缺口（wheel 的 deltaMode、触摸平移、边缘的滚动串联、tap slop）、mask/clip 命中测试的分歧，或这类代码里 observer 与 React 状态的时序竞态。默认 `fix`。
- Example signal: "masks do not affect hit-testing"、"overlay blocks wheel scroll"、"ignores deltaMode"、"runs in the IntersectionObserver callback before React applies state"。
- Source: 一条 sticky 遮挡 PR：六轮 Bugbot，大约十八条发现，每一条都修了而不是驳回。

### 契约测试漂移的说法很容易核实——先跑测试

- Confidence: candidate
- Skip when: 绝不要跳过核实本身；它只花一条命令。当一条 PR 交付的契约测试钉住了协议或文档散文（对 SKILL.md 的正则、文档措辞的快照），而 Bugbot 声称「测试不再与文档匹配」（或反过来），在分类之前先在 PR 尖端跑那个测试。红的运行从经验上确认这条说法；绿的运行是驳回回复里的具体反证。
- Do not skip when: 不适用——这是一条核实捷径，不是驳回模式。注意，重复通过就倾向驳回的启发式在这里会误伤：钉住散文的测试之所以漂移，正是因为更早的修复轮次改了那段散文。
- Example signal: "Contract test omits the pre-fix wait"，出现在一条更早的修复提交改写了被钉住段落的 PR 上；在尖端跑测试，恰好在被引用的断言上失败。
- Source: 一条钉住散文的 PR，八轮 Bugbot；尽管更早每一轮都已修复并解决，第 7 轮的说法是真的。

### 同一条 PR 里稍后已经修好的过期安全审查发现

- Confidence: candidate
- Skip when: 一次代理式安全审查（或类似的）声称缺少一次认证/校验调用，而当前 PR 尖端已经明确包含那个确切的门（带测试），通常是在审查跑完之后的一次加固提交里加上的。
- Do not skip when: 被引用的辅助函数对正在讨论的主体是空操作，检查发生在它所守卫的副作用之后，或缺少对被声称主体的覆盖。
- Example signal: 一条 HIGH 的 "missing authorization check" 发现，而那个确切的守卫在尖端已经于副作用之前被调用。
- Source: 一条 webhook 端点 PR，其加固提交晚于那次审查运行。

### 放宽一个故意收窄的错误条件会掩盖真正的错误

- Confidence: candidate
- Skip when: 发现要求把一个收窄的错误条件（某个具体的 `errno`、错误码或状态类）放宽成全捕获，而那种收窄编码了一个真实的区分。典型形状是一个依赖回退门控在 `ENOENT` 上：「二进制没安装」和「命令跑了并且失败了」是两种不同的情况。对任何非零退出都重试，会把一次正当失败（未找到、认证过期、网络）再对着回退跑一遍，然后报告回退的错误，把真正的错误藏起来。
- Do not skip when: 收窄条件漏掉了同一类别里的一种情况（另一个「二进制不可用」的 errno，例如 `EACCES`，或另一种传输层失败），未处理的路径丢失数据或留下部分状态，或者重试是幂等的并且原始错误仍然被呈现出来。
- Example signal: "only retries when X fails with ENOENT … never tries the fallback even when a working Y exists"，指向的代码其回退是为缺失的依赖而存在，而不是为失败的操作。
- Source: 一条 CLI 重命名 PR，其回退是为缺失的二进制而存在，而不是为失败的命令。

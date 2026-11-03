# Bugbot 分诊

当 Babysit 作战手册（`../playbooks/babysit.md`）处理 Bugbot 或评审自动化评论时，用这份参考。目标不是默认忽略 Bugbot，而是不再把每条评论都当成必须改代码。

## 决策标准

动手前先给每个 Bugbot 线程分类：

- `fix`：评论指出了一个可信的正确性、安全、隐私、数据丢失、鉴权、计费、迁移、幂等、竞态或已上线行为问题。在最低的所属 PR 里修掉，然后回复 commit SHA 并解决该线程。
- `dismiss`：评论符合已记录的低风险噪音模式，且当前代码/上下文证明这个担忧不需要改代码。回复一句简短理由并解决该线程。
- `ask`：评论是新的、高严重度的、涉及安全/隐私/数据的，或者含糊不清。问用户，别猜。

拿不准就问。跳过一条噪音式的代码质量评论代价很低；跳过真正的数据或安全 bug 代价不低。

## 已学模式格式

以后新增模式按这个形状写：

```markdown
### <short pattern name>

- Confidence: candidate | recurring | strong
- Skip when: <conditions that must be true>
- Do not skip when: <risk boundaries>
- Example signal: <phrases or code context that identify the pattern>
- Source: <PR/comment URL or short historical note>
```

一两个例子用 `candidate`。多次真实 dismiss 之后用 `recurring`。只有模式足够窄、反复验证过、且低风险时才用 `strong`。

## 反复出现的跳过候选

### 有意的 UI 或设计系统视觉改动

- Confidence: candidate
- Skip when: PR 描述、截图、设计评审或附近代码已经明确说明这个视觉改动，而 Bugbot 评论只是在重复某个共享视觉默认值变了。
- Do not skip when: 评论指向无障碍、焦点可见性、键盘导航、颜色对比度，或 PR 并未有意改动的组件 API 契约。
- Example signal: 关于焦点轮廓、按钮尺寸、间距或共享组件视觉默认值的评论，而 owner 回复"intentional"或"intended"。

### Bugbot 看不到的 upstack 或栈内用法

- Confidence: candidate
- Skip when: Bugbot 把某个 export、组件、helper 或文件标为未使用，而当前 forge 的 PR 列表和 diff、上层栈 diff 或 PR 上下文显示它被栈里更靠后的 PR 用到了。
- Do not skip when: 当前 PR 不属于任何栈，符号是公开 API，或者所谓的 upstack 用法无法验证。
- Example signal: "Exported component is never used"，而人类回复类似"used upstack"。

### 并行实现期间的临时重复

- Confidence: candidate
- Skip when: PR 有意重复少量代码，让新路径与正在被删除、替换或验证的旧路径并行存在。
- Do not skip when: 重复的代码改动了安全、计费、数据访问、API 行为，或者一个长期存在的共享抽象显然能降低风险。
- Example signal: "Significant duplication"或"duplicated validation logic"，而 owner 解释旧路径会被删除，或重复逻辑是有意留在本地的。

### 已有框架或组件不变量覆盖了该警告

- Confidence: candidate
- Skip when: 这个担忧已经被共享组件、框架契约、类型不变量，或当前 diff 及附近代码里可见的单一事实来源保证了。
- Do not skip when: 这个不变量只是假设、并未强制，依赖时序，或跨越异步/状态边界、值可能分叉。
- Example signal: 评论说内层 popover 缺少 max-height，而共享 popover 已强制视口边界；或者说值可为 null，而本地检查的值和传入的值来自同一来源。

### Owner 声明的后续处理或延后清理

- Confidence: candidate
- Skip when: PR owner 明确说这是已知的后续事项，当前 PR 没有让行为变差，且评论不涉及高风险区域。
- Do not skip when: 智能体在没有 owner 输入的情况下自行行动，问题属于中/高严重度的产品行为，或延后会合入一个新的回归。
- Example signal: "I'll worry about that later"或"we'll delete this eventually"。

### 自我撤回或明确误报的规则评论

- Confidence: recurring
- Skip when: 评论正文或后续 Bugbot 回复明确说该发现已撤回、已合规或是误报，且智能体能本地验证相关规则。
- Do not skip when: 唯一证据是有人在高风险问题上说了句"false positive"却没给解释。
- Example signal: 一条文件命名规则评论，正文说文件已经合规。

## 默认要问

即使之前的 PR 跳过过类似的东西，也不要自动跳过这些类别：

- 安全、隐私、鉴权、计费、数据保留、训练数据、权限边界相关的发现。
- 高严重度的发现。
- 迁移、schema、幂等、并发、跨系统行为相关的发现。
- 建议的修复很小、明显降低风险且不改变产品意图的评论。

历史数据显示人类有时会 dismiss 安全/数据流评论。把这些当作 owner 的判断，而不是全团队通用的跳过规则。

## 近期 babysit 的候选经验

在 babysit 过程中或之后，把看起来对团队有用但还不成熟的新候选经验追加到这里。等几个 PR 都确认了某个模式，优先把反复出现的候选提升到上面那一节。

### 手动重实现原生浏览器行为

- Confidence: candidate
- Skip when: 基本从不。当 diff 用人工等价物替换原生浏览器行为时（原生 sticky → JS 定位的克隆，原生滚动定位 → 转发的 wheel/touch 事件，paint-order 遮挡 → masks/clip-path），Bugbot 针对这段代码提出的逻辑 bug 发现一直是真的。
- Do not skip when: 发现涉及这类代码里的事件转发缺口（wheel deltaMode、touch pans、边缘的滚动链、tap slop）、mask/clip 命中测试分歧，或 observer 与 React 状态之间的时序竞态。默认 fix。
- Example signal: "masks do not affect hit-testing"、"overlay blocks wheel scroll"、"ignores deltaMode"、"runs in the IntersectionObserver callback before React applies state"。
- Source: 一个 sticky 遮挡 PR：六轮 Bugbot，大约十八条发现，每一条都是修掉而不是 dismiss。

### 契约测试漂移的说法验证成本很低，先跑测试

- Confidence: candidate
- Skip when: 验证本身永远不要跳过，它只花一条命令。当一个 PR
  带了一个钉住协议或文档措辞的契约测试（对 SKILL.md 跑正则、对文档措辞做快照），而 Bugbot 声称"测试已经和文档对不上了"（或反过来），先分类之前，在 PR tip 上跑那个测试。跑红就在经验上证实了说法；跑绿就是给 dismiss 回复一个具体的反证。
- Do not skip when: 不适用，这是一个验证捷径，不是 dismiss
  模式。注意重复轮次的"倾向 dismiss"启发式在这里会误判：
  钉住措辞的测试会漂移，恰恰是因为早先的修复轮次改了措辞。
- Example signal: "Contract test omits the pre-fix wait"，出现在一个早先的修复 commit 改写了被钉住段落的 PR 上；在 tip 上跑测试，正好在引用的那条断言上失败。
- Source: 一个钉住措辞的 PR，八轮 Bugbot；这个说法在第 7 轮是真的，尽管之前每一轮都是修掉并解决。

### 过期的安全评审发现，同一 PR 后面已经修了

- Confidence: candidate
- Skip when: 一个智能体安全评审（或类似的东西）声称缺少某个鉴权/校验调用，而当前 PR tip 明显包含那个确切的关卡（带测试），通常是在评审跑完之后的一个加固 commit 里加的。
- Do not skip when: 引用的 helper 对讨论的主体是个空操作，检查跑在它所守护的副作用之后，或者声称的主体的覆盖缺失。
- Example signal: 一条 HIGH 的"missing authorization check"发现，而 tip 上那个确切的守卫已经在副作用之前被调用了。
- Source: 一个 webhook 端点 PR，它的加固 commit 晚于评审运行。

### 把刻意收窄的错误条件放宽会掩盖真正的错误

- Confidence: candidate
- Skip when: 发现要求把一个窄的错误条件（某个具体的
  `errno`、错误码或状态类别）放宽成 catch-all，而这种窄本身编码了真实的区分。典型形状是一个以 `ENOENT` 为条件的依赖回退："binary 没装"和"命令跑了但失败了"是两种不同的情况。对任何非零退出都重试，会把一个合理的失败（找不到、鉴权过期、网络）也拿去跑回退，然后报告回退的错误，把真正的错误藏起来。
- Do not skip when: 窄条件漏掉了同一类别里的情况
  （另一个"binary 不可用"的 errno，比如 `EACCES`，另一种传输层失败），未处理的路径会丢数据或留下部分状态，或者重试是幂等的且原始错误仍然被暴露出来。
- Example signal: "only retries when X fails with ENOENT … never tries the
  fallback even when a working Y exists"，指向的代码里回退是为缺失的依赖准备的，而不是为失败的操作准备的。
- Source: 一个 CLI 改名 PR，它的回退是为缺失的 binary 准备的，而不是为失败的命令准备的。

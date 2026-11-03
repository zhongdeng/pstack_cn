### 追踪取证

**从产物出发，诊断由你负责。**

这和 **Runtime forensics** 不同，后者是给活着的进程插桩。这里捕获已经存在。产物是固定数据集，读它，不要重跑。工具保持通用：cpuprofile 和 `.json.gz` 用 DevTools 或 trace 解析器，spindump 用文本编辑器，heapsnapshot 用你的堆工具。

1. 先认格式，再用对的工具加载。大产物放到子智能体里解析（**principle-guard-the-context-window** 技能），主线程只留精简后的结论。按 Subagents 一节，给每个子智能体挑推理档位和 fast 或 standard 速度。
2. 把原始产物转成能查询的形态。把 trace 或堆快照倒进 sqlite，一个 sample、frame 或 node 一行。先到可查询的形状，再开始读。
3. 收窄到原因。查占时间最多的 frame，沿调用树走到热路径。查泄漏，就从泄漏对象沿 retainer 链追到 GC root。查 spindump，就找卡在 on-CPU 或阻塞的线程，以及它的等待原因。
4. 归因到源码。用产物自带的符号把热 frame 映射到文件、符号和行号。没有源码映射的 frame 还不算诊断。把符号解析出来，或者直说产物里没带。
5. 如果有配对捕获，就 diff 前后两份产物来确认。没有的话，把结论标成产物能支撑的最强假设，而不是已确认的原因。
6. 交回一份带引用的诊断，除非被要求，否则不给修复。原因明确后，路由到 Bug fix 或 Perf issue。Throughput checkpoint 保持一行：`throughput checkpoint: n/a, read-only forensics`。

**回复：** 产物和格式、精简后的结论、源码位置、产物路径，以及配对捕获是否确认了它。

### 调查

**答案由你负责。规划、路由、撰写。**

调查类请求是只读的。产出的是带引用的解释或建议，不是代码改动。

1. 通过 **how** 技能路由。如果是动机类问题，还要通过 **why** 技能路由。
2. 吞吐检查点保持一行：`throughput checkpoint: n/a, read-only investigation`。
3. 产出 `how` 形状的输出（Overview / Key Concepts / How It Works / Where Things Live / Gotchas），如果请求是在几个方案之间做决定，则产出带权衡表的建议。
4. 对回复应用 **unslop** 技能。

不发 PR，不 babysit，不调用 `architect`，除非调查之后要接着改代码。如果确实要改，交回给用户，重新路由到 Bug fix 或 Feature。

**回复：** 调查输出。对于"我们确定吗？"这类问题，给出你真实的判断和理由。如果前提是错的，就反驳（见 Autonomy）。

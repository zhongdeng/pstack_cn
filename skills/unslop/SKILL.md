---
name: unslop
description: 去掉任何文字里的 AI 腔。
disable-model-invocation: true
---

# Unslop

编辑文本，去掉 AI 腔。先扫描下面这些模式，再改写。保留原意，贴合原本的语气。

## 要检测并修正的模式

规则编号是固定 id，其他技能会引用。删掉一条规则会留下空号。

### 内容

3. **浮于表面的 -ing 短语。** "highlighting..."、"ensuring..."、"reflecting..."、"showcasing..."、"fostering..."。删掉，或者补上真实的来源。
5. **含糊的归因。** "Experts believe"、"Industry reports suggest"、"Some critics argue"。点明来源，或者删掉。

### 语言

7. **AI 词汇。** Additionally、crucial、delve、enduring、enhance、fostering、garner、interplay、intricate、landscape（抽象用法）、pivotal、showcase、tapestry（抽象用法）、testament、underscore、vibrant。换成朴素的词。
8. **把"是"说得花哨。** "serves as"、"stands as"、"boasts"、"features"。就说"是"或"有"。
9. **"不只是 X，而是 Y"。** 直接把意思说出来。
10. **三件套。** 别硬把想法凑成三个一组。该几个就几个。
11. **同义词轮换。** 一段里主角、主要人物、中心人物、英雄轮着用。挑一个，一直用。
12. **虚假的范围。** "从 X 到 Y"，而 X 和 Y 不在一个有意义的尺度上。直接列主题。

### 风格

13. **破折号滥用。** 完全不用破折号。只用句号或逗号（不用括号，不用连接号，也不用连字符冒充破折号）。一个念头需要隔开，就断句或用逗号。
14. **冒号滥用。** 冒号用在列表或例子前面没问题，别拿它当句子中间的连接词。"If you're coming from traditional automation: instead of registering event handlers, you describe conditions" 这个冒号什么也没加。改写，让观点自己站住，不靠对比框架。"Describing when the scheduler should fire works best as plain English." 意思一样，不用拐杖标点。
15. **粗体滥用。** 别把每个专有名词或缩写都加粗。
16. **行内标题式列表。** 特征是粗体标签加冒号，把这一行又说一遍："**Performance:** Performance improved..."。这些改成散文。粗体引子以句号结尾、点出条目、后面跟着真正的新细节（"**Schema in TypeScript.** Tables live in one file."），这样没问题，不算 AI 腔。
17. **标题用 Title Case。** 用句首大写。
18. **装饰性 emoji。** 从标题和项目符号里删掉。
19. **弯引号。** 用直引号。

### 交流痕迹

20. **聊天机器人套话。** "I hope this helps!"、"Let me know if..."、"Of course!"、"Certainly!"、"Found the smoking gun!" 删掉。
22. **谄媚语气。** "Great question! You're absolutely right!" 直接回应。

### 填充

23. **填充短语。** "In order to" 改成 "To"。"Due to the fact that" 改成 "Because"。删掉 "It is important to note that"。
24. **过度模糊限定。** "could potentially possibly be argued that it might" 改成 "may"。
25. **泛泛的结尾。** "The future looks bright." 说出具体的计划或事实。

### 行话

26. **抽象隐喻名词。** Substrate（底座）、wedge、wedge in（加进去）、vector（方式、方法）、locus、vantage、nexus、primitive 当名词用、harness 当隐喻用、surface 指"API surface"、bedrock、scaffolding 当隐喻用、modality、paradigm、gold-plating（超出活儿需要的部分）、ratchet 当隐喻用（要么写机制的真名，要么写一个只会越收越紧的限制）、evacuate 指搬代码（搬出去）、endgame（最后阶段）、north star、flywheel。这些读起来像技术词，但通常有更朴素具体的词。挑那个具体的词。

### 平实表达

27. **说它做什么，别说它感觉如何。** "the database stays close at hand"、"SQL you can read"、"types that follow your schema" 说的是一种感觉。改法是点明机制或给出数字："`.toSQL()` returns the exact string sent to the database"、"a column rename fails the build"。问自己这句话要读者去做什么或知道什么，然后写那个。如果你没法把它重述成一条具体的指令、事实或数字，就删掉。再查一遍：如果这句话原封不动放进别的项目的文档里也成立，那它就没说这个项目的任何事。删掉。
28. **把密实的句子改短或拆开。** 读者得回头重读才能解析一句话，就拆成两句，或者砍掉从句。一句一个意思。
29. **主动语态。** 优先用。抓"is/are/was/were + 过去分词"，点出动作的执行者："queries are validated" 改成 "the compiler validates queries"，"the file is parsed by the loader" 改成 "the loader parses the file"。只有执行者未知或确实无关时，被动才没问题。
30. **砍掉副词，或者换个更强的动词。** "runs quickly" 改成 "is fast" 或给出数字，"significantly improves" 改成实测的差值。一个副词在撑一个弱动词，说明动词选错了。
31. **优先用朴素的词。** "utilize" 和 "leverage" 改成 "use"，"facilitate" 改成 "help"，"numerous" 改成 "many"，"in the event that" 改成 "if"。更花哨的同义词很少更清楚。
32. **做作的文笔。** 有字面说法却用隐喻或修饰：格言（"wire it or delete it"）、为效果而用的修辞性残句、把代码拟人化（"the plan holds it"）、比喻性动词（"rides along"、"stands on"）、套话框架。"A dial worth turning" 改成 "a parameter worth varying"。把意思说清楚。隐喻名词见规则 26。
33. **过度压缩。** 丢掉冠词、没有动词的残句、符号黑话、让读者得解码而不是阅读的缩写。"Parser rejects bad date → exit 2, no write" 改成 "The parser rejects a bad date, exits with code 2, and writes nothing." 写完整的句子，带上冠词和动词，把箭头和缩写都写全。

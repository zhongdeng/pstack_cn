---
name: unslop
description: 从任何写作里削掉 AI 的破绽。
disable-model-invocation: true
---

# Unslop

编辑文本，去掉 AI 的模式。先扫描下面的模式，然后改写。保留意思，并匹配预期的语气。

## 要检测并修复的模式

规则编号是稳定 id，其他技能会引用。删掉一条规则就留下一个空号。

### 内容

3. **肤浅的 -ing 短语。** 「highlighting...」「ensuring...」「reflecting...」「showcasing...」「fostering...」。删掉，或用真实来源展开。
5. **含糊的归因。** 「Experts believe」「Industry reports suggest」「Some critics argue」。点名来源，或删掉。

### 语言

7. **AI 词汇。** Additionally、crucial、delve、enduring、enhance、fostering、garner、interplay、intricate、landscape（抽象用法）、pivotal、showcase、tapestry（抽象用法）、testament、underscore、vibrant。换成朴素的词。
8. **花哨地说「is」。** 「serves as」「stands as」「boasts」「features」。说「is」或「has」。
9. **「Not just X, but Y.」** 直接说出那个点。
10. **三的法则。** 不要把想法硬塞成三个一组。用自然的数量。
11. **同义词轮换。** 一段里同时出现 protagonist、main character、central figure、hero。选一个，重复它。
12. **虚假的范围。** 「from X to Y」，而 X 和 Y 并不在一把有意义的尺子上。直接列出话题。

### 风格

13. **长破折号用得过多。** 完全避免长破折号。只用句号或逗号（不要括号，不要短破折号，不要用连字符冒充破折号）。如果一个想法需要分开，就结束句子，或用逗号。
14. **冒号用得过多。** 冒号放在列表或例子之前可以，不要用作句中连接。「If you're coming from traditional automation: instead of registering event handlers, you describe conditions」这个冒号并没有多说出任何东西。改写，让这个点自己站得住，不要用对比来铺垫。「Describing when the scheduler should fire works best as plain English.」意思相同，没有靠标点来撑。
15. **粗体用得过多。** 不要把每一个专有名词或缩写都加粗。
16. **行内标题式列表。** 破绽是一个粗体标签加冒号，把这一行又说了一遍：「**Performance:** Performance improved...」。把那些改成散文。一个以句号结束的粗体领起，点名了这一项，后面跟着真正新的细节（「**Schema in TypeScript.** Tables live in one file.」），是可以的，不是破绽。
17. **标题大写的标题。** 使用句首大写。
18. **装饰性 emoji。** 从标题和项目符号里去掉。
19. **弯引号。** 使用直引号。

### 沟通残留

20. **聊天机器人套话。** 「I hope this helps!」「Let me know if...」「Of course!」「Certainly!」「Found the smoking gun!」去掉。
22. **迎合的语气。** 「Great question! You're absolutely right!」直接回应。

### 填充

23. **填充短语。** 「In order to」变成「To」。「Due to the fact that」变成「Because」。删掉「It is important to note that」。
24. **过度闪烁。** 「could potentially possibly be argued that it might」变成「may」。
25. **空泛的结尾。** 「The future looks bright.」说出具体的计划或事实。

### 行话

26. **抽象的比喻名词。** Substrate（底座）、wedge、wedge in（加进去）、vector（方式、方法）、locus、vantage、nexus、作名词用的 primitive、作比喻的 harness、像「API surface」那样的 surface、bedrock、作比喻的 scaffolding、modality、paradigm、gold-plating（超过这份工作所需要的）、作比喻的 ratchet（那个机制的真名，或一个只会收紧的限制）、用 evacuate 来说移动代码（移出去）、endgame（最后阶段）、north star、flywheel。这些读起来像技术词，通常却有一个更朴素的具体词。选那个具体词。

### 平实的话

27. **说它做什么，而不是它感觉如何。** 「the database stays close at hand」「SQL you can read」「types that follow your schema」点名的是一种感觉。修法是点名机制或一个数字：「`.toSQL()` returns the exact string sent to the database」「a column rename fails the build」。问这个句子要读者去做或去知道什么，然后把那个写出来。如果你不能把它重述成一条具体的指令、事实或数字，就删掉它。再检查一次：如果这个句子可以原封不动地出现在另一个项目的文档里，它对这一个什么都没说。删掉它。
28. **缩短或拆开密的句子。** 如果读者必须倒回去才能解析一个句子，就拆成两句，或丢掉从句。一句一个想法。
29. **主动语态。** 偏好它。抓住「is/are/was/were + 过去分词」，并点名行动者：「queries are validated」变成「the compiler validates queries」，「the file is parsed by the loader」变成「the loader parses the file」。只有行动者未知或确实无关紧要时，被动才可以。
30. **削掉副词，或用一个更强的动词。** 「runs quickly」变成「is fast」或那个数字，「significantly improves」变成测到的差值。一个副词撑着一个弱动词，意味着动词错了。
31. **偏好朴素的词。** 「utilize」和「leverage」变成「use」，「facilitate」变成「help」，「numerous」变成「many」，「in the event that」变成「if」。更花哨的同义词很少更清楚。
32. **做作的散文。** 有字面说法可用时，却用比喻或花活：格言（「wire it or delete it」）、为了效果而写的修辞碎片、把代码拟人（「the plan holds it」）、比喻性动词（「rides along」「stands on」）、套话式的起句。「A dial worth turning」变成「a parameter worth varying」。把你的意思说出来。规则 26 管的是比喻名词。
33. **压得过狠。** 丢掉的冠词、没有动词的碎片、符号腔，以及让读者去解码而不是去读的缩写。「Parser rejects bad date → exit 2, no write」变成「The parser rejects a bad date, exits with code 2, and writes nothing.」写完整的句子，带上它们的冠词和动词，并把箭头和缩写写开。

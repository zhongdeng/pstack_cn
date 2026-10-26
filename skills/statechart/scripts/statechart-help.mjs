import { CACHE_NAME, PACKAGES } from "./render.mjs";

export const USAGE = {
  "from-spec":
    "node statechart.mjs from-spec SPEC.tla [--config FILE] [--fixed FIXED.tla [--fixed-config FILE] | --against AGREED.tla [--against-config FILE]] [--label TEXT] [--map FILE] [--expect-broken RULE]... [--title TEXT] [--out DIR] [--cover] [--png [--theme NAME]]",
  "from-chart":
    "node statechart.mjs from-chart CHART.mmd [--module NAME] [--expect-broken RULE]... [--title TEXT] [--out DIR] [--png [--theme NAME]]",
  render: "node statechart.mjs render CHART.mmd [--theme NAME] [--out FILE]",
};
export const usage = (lines) => `Usage: ${lines.join("\n       ")}`;

const FROM_SPEC = `from-spec SPEC.tla
  在单独的一次 TLC 运行里检查 SPEC.cfg 中的每一条 INVARIANT。TLC 停在某个状态打破的第一条规则上，分开的运行找出其余的。每次运行也把这条规则当作 CONSTRAINT，于是 TLC 把每条路径停在它打破该规则的第一个状态，一条一直被打破的规则只报告打破它的那一步。SPEC.cfg 有 SPECIFICATION，以及每条规则一行 INVARIANT。每一条 PROPERTY（关于整段行为的规则）也得到一次 TLC 运行，图并不画出它。一条没有 []、<> 或 ~> 的 PROPERTY，TLC 只在初始状态里检查，命令会这样说。一条同时列为 INVARIANT 和 PROPERTY 的规则只检查一次，作为 INVARIANT。这些运行打印结果之后，再有一次运行倾倒状态图，并在图中的每一个状态上检查每一条 INVARIANT，然后命令画出这些图。TLC 从下一步动作往下穿过每一个 \\/、\\E、LET 和定义，并用那条路径上的最后一个定义给每一步命名。它停在任何其他表达式上，例如 /\\、IF 或 CASE，所以嵌在其中一个里面的定义不会给步骤命名。给每一种步骤它自己的定义，并用 \\/ 把它们接进下一步动作。当步骤带着整个下一步动作的名字时，命令会警告。命令打印它用来检查每个模型的配置，并在配置不存在时停下，配置与 spec 放在一起。

  --config FILE      SPEC.tla 的配置。默认：spec 旁边的 SPEC.cfg。
  --fixed FIXED.tla  开放修复的模型。它是 spec 在另一个文件里的副本，例如
                     SpecFixed.tla 或 fix/Spec.tla。命令用同样的方式检查它，用
                     FIXED.cfg，没有 FIXED.cfg 时用 SPEC.tla 的配置。图随后把每个坏状态标成已修复或仍然错误。FIXED.tla 的配置不检查的规则，保持它今天的错误程度。当修复显示出与这类规则的一个缺陷相同的状态和步骤时，故事说
                     "does not check this rule"。
  --fixed-config FILE
                     FIXED.tla 的配置。
  --against AGREED.tla
                     当 SPEC.tla 为代码建模时，SPEC.tla 必须遵循的那份 spec。它是与 SPEC.tla 不同的文件。命令用 AGREED.cfg 检查它，从不用 SPEC.tla 的配置。SPEC.tla 可以增加 AGREED.tla 没有的变量、记录字段和动作。比较把它们留在外面。不要和 --fixed 一起用。
  --against-config FILE
                     AGREED.tla 的配置，当它不是 AGREED.cfg 时。给出 spec 作者所说的、未改动的 spec 能通过的那份配置。当 spec 显示出与这份配置不检查的规则的一个缺陷相同的状态和步骤时，故事说 "does not check this rule"。
  --label TEXT       图和故事里 --fixed 或 --against 模型的名字。
                     默认："the fix"，或 "the spec"。
  --map FILE         每个模型状态和步骤的标签。默认：spec 旁边的 SPEC.map.mjs。
                     文件不存在时，命令根据 spec 的 VARIABLES 和动作写一份待填写的，并在运行 TLC 之前以退出码 2 退出。它的注释说明每个函数得到什么。映射从 1 读取序列或元组，与 TLA+ 一样，所以 v.seat[1] 是它的第一项。从 0 读取的映射，例如 v.pc[r - 1]，拿到的是它想要的那一项的前一项，并在读到下标 0 时停下这次运行。
  --cover            在总览里只画从起点到每个落定状态的最短路径，再加上每一条缺陷路径。一个状态在只有映射的 readerActions 被启用时是落定的。命令打印总览省掉的状态和箭头。工作或打破一条规则的状态计数仍然包括它省掉的状态。当 TLC 的图里没有一步是读者动作时，总览画出每一个状态。

  带上 --fixed 或 --against 时，SPEC.tla（以及 FIXED.tla）为代码建模，命令找出动作里没有任何注释用文件和行系到代码的每一个条件，例如 \\* pay.ts:120。一个条件是动作的一个合取项，它什么都不改，并且读取一个该动作并不修改的变量。一条规则之所以成立，可能只是因为模型在等一个代码并不检查的条件，所以当一条规则成立时，命令打印这些条件。
  带上 --against 时，每个故事说明 AGREED.tla 旁边的一份配置是否预期 TLC 打破这个缺陷的规则。配置里的一行 "\\* expect: RULE" 说出 TLC 发现什么，"\\* module: NAME" 在文件夹里有多于一个 .tla 文件时点名它检查的模块。当 AGREED.tla 旁边没有任何配置为那个模块写了 expect 行时，命令警告。`;

const FROM_CHART = `from-chart CHART.mmd
  在图旁边写下 NAME.tla、NAME.cfg 和 NAME.map.mjs。当 NAME.tla 已经存在时，它一个都不写。否则它替换已经在那里的 NAME.cfg 或 NAME.map.mjs。然后它像 from-spec 那样检查这份 spec，并把 spec 画出的图与 CHART.mmd 比较。

  --module NAME      TLA+ 模块名。默认：图的文件名的 CamelCase，例如
                     notes-app.mmd 对应 NotesApp。

  这张图是 Mermaid stateDiagram-v2。每条迁移标签是一个动作。并行区域：用 -- 拆开一个顶层复合状态，并把每一部分放进一个有名字的复合状态，例如 state Connection { ... }。每个区域是一个变量。一步移动当前状态上有这条步骤标签的迁移的每一个区域，其他区域留在原地。每条规则是一行注释：
    %% never NAME: A & B -- the rule in one sentence
  冒号后面的每个名字是一个状态标题或一个复合状态，并且各自来自不同的区域。一个复合状态代表它里面的每一个状态。紧跟在一条迁移后面的一行 "%% when ID, ID" 或 "%% when not ID, ID" 是它的守卫，并且这条迁移的标签必须以守卫的词收尾，放在 [ ] 里。只有当该行点名的每一个其他区域都处在它点名的某个状态里时，这个区域才走这条迁移；带上 not 时，则是当没有一个处在其中时。一条没有标签的迁移是它自己的动作。NAME.cfg 有 SPECIFICATION Spec、INVARIANT TypeOK，以及每个 never 行一条 INVARIANT。命令拒绝 final、choice、fork 和 history 状态，以及顶层以下的区域。

  比较看的是可达状态、起始状态和带标签的步骤。有区域的图按它的组合机器来比较，每个状态用它的区域状态以 " | " 连接来命名，所以一个只在某些区域组合里挡住一步的守卫会显示为差异。守卫在 [ ] 里的词不是标签的一部分。一个环和其他步骤一样比较。一条边的标签 "a or b" 算作两个标签。一条没有标签的边，只有当没有带标签的边连接同样两个状态时才计入。`;

const RENDER = `render CHART.mmd
  把一张图画成 PNG。它不运行 TLC，所以图可以来自 from-spec、来自 from-chart，或来自一个人。

  --theme NAME       PNG 的颜色：light、dark 或 classic。默认：light。
  --out FILE         要写的 PNG。默认：把图的路径里的 .mmd 换成 .png。
                     文件夹不存在时命令会创建它。

  Exit codes
    0  命令写下了 PNG。
    2  命令无法完成：坏的参数、读不了的图、装不上或加载不了的渲染器，或渲染不了、写不了的 PNG。那时它不写 PNG。`;

const PNG = `PNG
  Pele 排布每一张图，resvg 以两倍尺寸绘制它。在那个尺寸上超过 1 亿像素的图会画得更小，大约 1 亿像素。第一张 PNG 用 npm 把
  ${PACKAGES.join(" and ")} 装进一个缓存文件夹。文件夹是
  $XDG_CACHE_HOME/statechart/${CACHE_NAME}，或在未设置 XDG_CACHE_HOME 时为
  ~/.cache/statechart/${CACHE_NAME}。删掉那个文件夹可以重新安装。当 npm 或这些包失败时，命令打印原因，以 2 退出，并且不写文件。
  PNG 使用 fc-match 为 system-ui 找到的字体。命令用那种字体测量每个标签，所以没有标签超出它的盒子。当那种字体比 Pele 内建的宽度更宽时，命令把换行宽度加宽同样的量，于是行在图断开它们的地方断开。没有 fc-match，或 resvg 读不了那种字体时，PNG 使用 Pele 的宽度。
  Pele 把并行区域并排放。当一张有区域的图没有顶层方向时，PNG 把图例放在区域上方，所以 PNG 更窄。
  --theme 选择 light、dark 或 classic。light 是默认。classic 保留图自己的 classDef 行里的组填充。`;

const COMMON = `两条命令都有
  --expect-broken RULE
                     一条已知会打破的 INVARIANT 或 PROPERTY。重复它，或用逗号列出规则，例如 A,B。当恰好是这些规则被打破，并且 --fixed 或 --against 模型不打破其他规则时，命令以 0 退出。
  --title TEXT       图的标题。每张缺陷图加上 ", bug N"。
  --out DIR          输出文件夹。默认：输入旁边的 NAME-statechart。一次运行先把文件写在临时文件夹里，然后用它替换整个输出文件夹。运行重叠时，输出文件夹里是最后完成的那次运行的文件。命令不使用一个含有并非它写下的文件的输出文件夹。在不能重命名的文件系统上，命令把文件复制到位，重叠的运行可能把文件混在一起。
  --png              同时把每张图画成 PNG。PNG 一节说明怎么做。
  --theme NAME       每张 PNG 的颜色：light、dark 或 classic。默认：light。它需要
                     --png。
  -h, --help         打印这份帮助，并以 0 退出。

输出
  命令打印每条规则是否成立、图的计数，以及每个缺陷一个故事。
  from-chart 还打印比较。命令在输出文件夹里写下这些文件：
  chart.mmd          总览。
  bug-N.mmd          只含缺陷 N 的步骤，带编号。缺陷按最少的读者步骤、然后最少的模型步骤、然后规则名、然后原因来编号。只有 --fixed 或 --against 模型才有的缺陷排在最后。
  bug-N-developer.mmd, bug-N-layered.mmd
                     缺陷 N 穿过开发者状态的路径，当映射导出 detail() 时。分层图把每个细节状态放进一个以其状态标签命名的盒子。细节为空的状态保持为普通状态。
  stories.md         每个缺陷一条：规则、它为什么被打破、通向它的步骤、读者步骤上的最短路径，以及 --fixed 或 --against 模型改做了什么。规则的句子是 spec 里该规则上方的 \\* 注释行，或 spec 直接或经由另一个模块 EXTENDS 的、同一文件夹里某个模块中的注释行。带上 --fixed 或 --against 时，另一份 spec 及其模块也算，排在 SPEC.tla 及其模块之后。条目给改变状态标签的每一步、每个读者动作、改变该规则所读变量的每一步，以及进入缺陷的那一步编号。在它们之间，它计数隐藏的步骤，并把每个不同的步骤命名一次。在步骤上方，一行点名至多五个通向缺陷的不同步骤，最常见的在前，并计数其余的。当多于一步或一个起始状态通向缺陷时，条目说这条路径是 TLC 找到的最短路径。一步通向缺陷，是指它从保持该缺陷自己那条规则的一个状态走到那里。那个状态可以已经打破其他规则。"(the state stays the same)" 标出那一行上保持状态标签、并且不在缺陷路径上的一步。from-spec 不画这样的一步。当 TLC 只按整个下一步动作给步骤命名时，条目无法计数它们。然后是每条被打破的 PROPERTY 一行，带上它的句子（只来自它自己的 spec 文件）、永远重复的读者状态（如果有），以及含有它的反例的 TLC 输出。
  summary.json       图背后的计数。每个缺陷有反例、有多少模型状态以它结束（各自带自己的 TLC 轨迹）；lastSteps，通向它的步骤，最常见的在前；以及 startsHere，一个起始状态是否在其中。brokenProperties 有每条被打破的 PROPERTY、它的规则句子、作为 repeats 的永远重复的读者状态，以及它的 TLC 输出。mixedStatus 列出在某些情况下打破一条规则的状态。chartGroups 计数每个组画出的状态，mixedGroups 列出属于多于一个组的状态。带上 --cover 时，cover 列出总览省掉的状态和箭头。带上 --fixed 或 --against 时，uncited 有每个代码模型里没有文件和行的条件。带上 --against 时，second.listed 有 AGREED.tla 旁边每份配置所预期的，并且每个缺陷有列出它的配置。
  tlc/               每次运行的配置和 TLC 输出。当总览有区域时，from-spec 还写下 tlc/regions-all.mmd（带每一条箭头的区域）和 tlc/regions-proof.mmd（TLC 的图的每一个状态和步骤，放在一个区域里）。compare-charts.mjs tlc/regions-all.mmd tlc/regions-proof.mmd 重复这次证明。它打印 "same" 并以 0 退出，或打印每一处差异并以 1 退出。
  *.png              带上 --png 时，每张图的 PNG。一次没有 --png 的运行会删掉它们。

读一张图
  当每个状态都读作 "context: progress" 时，from-spec 把总览画成两个并行区域：一边是上下文，另一边是进度，同时成立。只有当这样状态更少、当这些区域组合回去恰好是 TLC 的图的每一个状态和步骤、并且每个状态的颜色是它的两个区域状态里更差的颜色时，它才这样做。否则它把一个上下文的状态放进一个名为 context 的盒子，并打印原因。盒子里的每个状态只显示它的进度，只有一个状态的上下文保持为普通状态。
  区域只画到每个状态的最短路径的箭头、每条缺陷路径的箭头，以及每个标签最近一步的箭头。脚本检查这些箭头不会造出 TLC 的图里没有的步骤。在它们错误地造出一步的地方，它把完整区域在那里走的每一条箭头放回去。
  从盒子边框出发的箭头，是从盒子里的每一个状态离开。只有当盒子里的每个状态都以相同的标签走到同一个状态，并且盒子外没有状态拥有盒子的名字时，图才画出它。
  在区域里，一步离开每一个拥有它的区域。"[when A or B]" 或 "[unless A or B]"，哪个更短用哪个，说出这一步需要另一个区域的哪些状态，它下面的一行 "%% when" 或 "%% when not" 列出它们的 id。一个环表示这个区域也可以留下。
  [ ] 里的其他词来自映射的 guard()，"after N s" 来自它的 timer()。一条边只有在它背后的每一个模型步骤都有这些词时才显示 guard() 的词。在区域里，它们替换 "when A or B" 和 "unless A or B"。TLC 不检查它们，也没有时钟，所以由审查者对照代码检查它们。
  灰色状态是正常的。红色状态打破一条规则。橙色状态在某些情况下打破一条规则：它的标签下有一个模型状态打破规则，并且一条没有缺陷的路径到达另一个。白色状态只在一个缺陷之后到达：从起点到它的模型状态的每一条路径都经过一个打破规则的状态，并且它们自己都不打破规则。带上 --fixed 时，红、橙、白描述的是修复，绿色状态被它修好，或只随它存在。紫色状态只在修复下打破一条规则：今天它是正常的、只在缺陷之后到达，或不存在。带上 --against 时，一个状态取它两个模型颜色里更差的那个，先红，然后橙，然后白，绿色状态只存在于 spec。
  当映射导出 group() 时，填充是状态的组，图例点名它。一个图状态在它的全部模型状态都在某个组里时属于该组，一个区域状态在它所参与的每一个状态都在该组里时属于该组。不属于任何组、或属于多于一个组的状态是灰色。图例列出图所画的组：先是 groupColors 里的组，按那个顺序，然后是其余的从 A 到 Z，然后是图所用的每一种状态边框。groupColors 给一个组一个浅色的 "#rgb" 或 "#rrggbb"。没有颜色的组取调色板上下一个空闲颜色：浅蓝、橙、紫、黄、青绿、棕褐，然后粉。一个组不能拥有状态的名字，例如 "Breaks a rule"。没有 group() 时，图例只显示图所用的状态。在 .mmd 文件里，状态是它那种颜色的粗边框，白色状态用灰色，盖在组填充之上。在 PNG 里，红、橙、紫或白的状态是那个颜色的盒子，带边框和同色文字，代替它的组填充，修好的状态是绿色盒子，所以每个盒子显示一个信号。
  粗的蓝色边框和带编号的标签标出缺陷。带上 group() 时，以及在 PNG 里，蓝色边框只标出缺陷路径上正常的状态，带编号的标签显示其余的。
  Mermaid 状态图不能给边着色。
  每个缺陷按它的状态标签和步骤用词在另一个模型上重放，那是读者看到的东西。重放走缺陷自己的步骤。在它们之间，它也走另一个模型上 SPEC.tla 的状态图里没有的动作的步骤，当它们保持状态标签、不是读者动作、并且不改变被打破的规则所读的变量时。故事隐藏的一步缺陷步骤，在另一个模型上也必须保持状态标签，除非那个模型走不了它。读者看到的一步，是在同样两个状态标签之间走一步用词相同的步骤，并优先同一动作的一步。另一个模型没有的动作的隐藏步骤被跳过。读者看到的、属于这样一个动作的一步，当它改变一个共享变量时，走任意一步到同一个共享状态，否则在同样两个状态标签之间走一步用词相同的步骤。
  标签 "with the fix, STEP" 或 "in the spec, STEP" 是只有另一个模型才走的一步。在缺陷路径上，它离开另一个模型向读者展示得不同的第一步之前的那个状态，并结束在那个模型改去的地方。用词不同时，故事引用另一个模型的用词。"with the fix, STEP cannot happen at step N" 或 "in the spec, STEP cannot happen at step N" 在那个模型挡住这一步的状态上打环，用它自己的一条箭头。在总览上，标签以 "of bug M" 结尾。区域之外，两个状态之间至多有一条箭头。它的行是带编号的步骤，然后是 SPEC.tla 的步骤，然后是另一个模型的步骤，每组之间空一行。
  另一个模型可以有其他变量、记录字段和动作。比较略去一个模型的任何状态（在它的状态图或它的轨迹里）都没有的变量或字段，以及两个模型里值从不同型的那个。一份映射画两个模型，所以它只能读两者都有的东西。当映射在另一个模型的一个状态上读取那个模型的任何状态都没有的变量或字段，或读取一个其值的类型是 SPEC.tla 在那里从未有过的变量或字段时，命令停下。当映射列出这样一个状态的字段时，命令也停下，像展开、Object.keys 或 JSON.stringify 所做的那样。在映射读取另一个模型所缺的字段之前，先测试 "name" in v。当映射为另一个模型做出的标签、守卫、组或原因里含有单词 "undefined" 时，命令也停下。
  带有另一个模型的图，在 stateDiagram-v2 正后方有一行 "%% second model (fix|against): LABEL"。每张图以 front matter 开头，它阻止 Mermaid 把图缩到页面里，或再次折它的标签。
  一条边列出走它的每一步，最常见的在前。步骤在开头共享的词只写一次，例如 "you tap Pay or Back"。

重新生成
  用 --expect-broken 列出每一条已知会打破的规则，也就是目标和已知缺陷。每次运行随后以 0 退出，直到某条规则改变，于是一个脚本重建每一张图，并在任何改变处停下：
    set -e
    node statechart.mjs from-spec Code.tla --against Agreed.tla --expect-broken NoLostUpload --png
  一次运行若把一条被打破的规则留在 --expect-broken 之外，以 1 退出，set -e 就在那里停下脚本。

TLC
  TLA2TOOLS 是 tla2tools.jar 的路径，JAVA 是 java 二进制的路径。只设置了 TLA2TOOLS 时，命令从 PATH 运行 java。否则它使用 mise 里的 TLC 1.7.4 和 Java temurin-25，或在设置了 JAVA 时使用 JAVA，并用 mise 安装所缺的。第一次安装大约下载 305 MB，并且需要网络。它检查 tla2tools.jar 的校验和。mise 在一个空的临时文件夹里运行，所以 spec 周围、仓库里或 TMPDIR 之上的 mise 文件不适用、不会被改动，也不需要信任。当 mise 无法启动或失败时，命令打印原因、安装命令，以及如何改为设置 TLA2TOOLS 和 JAVA。
  命令启动时，它复制 Exit codes 一节所列出的输入文件。TLC 检查这些副本，所以运行期间的一次编辑不会改变 TLC 检查的内容。
  TLC 用每个 CPU 一个 worker 检查每条规则。当一条规则被打破时，TLC 再用一个 worker 检查它，这找到最短的缺陷路径，每次运行都相同。命令随后打印 TLC 跑了多少次、花了多久。
  TLC 可能发现一条规则被打破，然后停在一个错误上，例如一个 Java 异常。命令随后保留 TLC 打印过的路径，把规则标成被打破，并警告图可能漏掉打破它的状态。一个更小的常量可以让 TLC 跑完。

Exit codes
  0  每一条规则都成立，或恰好是 --expect-broken 的规则被打破。from-chart 还把 CHART.mmd 原样画回来。
  1  另一条规则被打破，一条预期的规则成立，或 spec 画出的图不是 CHART.mmd。输出说明是哪一个。
  2  命令无法完成：坏的参数、缺失的文件、读不了的图或 TLC 输出、没有 TLC、启动不了的辅助脚本、含有并非命令写下的文件的输出文件夹、运行期间内容变了的输入文件、一份待填写的新映射、用不上的映射、--png 装不上或加载不了的渲染器，或 --png 渲染不了的图。
     当一张图渲染失败时，命令保留它写下的文件并以 2 退出，不论规则给出什么。否则，退出码 2 不改变输出文件夹，除非命令把它挪到一边并且放不回去。那时消息点名文件夹的新路径。当命令在 TLC 已经跑过之后停下时，它把写下的文件（其中包括 TLC 的输出）留在一个临时文件夹里，消息点名它。当 TLC 的状态图大到画不下时，命令打印每条规则是否成立并以 2 退出，不论规则给出什么。图一超过那个大小，它就停下 TLC。输入文件是 spec 和配置、--fixed 或 --against 的 spec 和配置、图，以及映射。与一份输入 .tla 文件同一文件夹里、被它 EXTENDS 或 INSTANCEs 的每个 .tla 文件也是输入文件，一份输入 .mjs 或 .js 文件以相对路径导入的每个文件也是。在 --png 渲染之前，以及再次在它写输出文件夹之前，命令把每个输入文件的内容与启动时的内容比较。一次不改变内容的保存不会停下这次运行。`;

export const HELP = {
  "": `${usage([...Object.values(USAGE), "node statechart.mjs [from-spec|from-chart|render] --help"])}

从一份 TLA+ spec 的 TLC 状态图画出一张 Mermaid 状态图。这份 spec 可以为任何系统建模，例如一条产品流程、一个协议、一个服务、一个作业队列，或一个算法。一份映射用读图的人的话给每个状态和步骤贴标签，帮助把这个人叫做读者。读者可以是用户、操作者、工程师或审查者。

${FROM_SPEC}

${FROM_CHART}

${COMMON}

${RENDER}

${PNG}`,
  "from-spec": `${usage([USAGE["from-spec"]])}\n\n${FROM_SPEC}\n\n${COMMON}\n\n${PNG}`,
  "from-chart": `${usage([USAGE["from-chart"]])}\n\n${FROM_CHART}\n\n${COMMON}\n\n${PNG}`,
  render: `${usage([USAGE.render])}\n\n${RENDER}\n\n${PNG}`,
};

export const more = (cmd) =>
  `Run node statechart.mjs ${cmd ? `${cmd} ` : ""}--help for the flags, the output, and the exit codes.`;

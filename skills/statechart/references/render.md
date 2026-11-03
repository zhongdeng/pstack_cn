# 渲染图表

你展示的每个 `.mmd` 文件都用 npm 包 `pele@1.9.0` 渲染，并把 SVG 交给用户。Pele 只装一次，装在仓库外面。每个 SVG 写在对应 `.mmd` 文件旁边，名字相同。API 在 https://pele.run/api。把 `{ limit: 1_000_000, outputLimit: 8_000_000, maxEdges: 10_000 }` 作为 `render` 的 options 传进去。Pele 的默认值比一张 500 个状态的图表能用的要小。Pele 抛出 `PeleError` 时，把 Mermaid 文本和错误一起给用户看。

## 颜色

Pele 忽略 Mermaid 的 `theme` 和 `themeVariables`。把它的 `--pele-*` CSS 变量设在 `.pele` 上。https://pele.run/theming 列出了这些变量。命令给每个状态加上它所属分组的颜色类，比如 `class sN teal`。它给每个坏状态标上 `class sN breaks` 或 `class sN mayBreak`，给最短路径上通往 bug 的每个状态标上 `class sN bugPath`，给 PROPERTY 反例永远重复的每个状态标上 `class sN repeats`。Pele 把这些类放在状态的节点上。用 CSS 给这些类上色。

`.mmd` 文件里有针对 `breaks` 和 `mayBreak` 的 `classDef` 行，这样任何 Mermaid 查看器都能显示 bug 标记。它没有针对分组颜色、`bugPath` 或 `repeats` 的 `classDef`。Pele 把每个 `classDef` 的颜色写成节点上的 `style` 属性，而 `style` 属性会盖过普通的 CSS 规则。所以下面这些标记的规则用了 `!important`。没有它，深色主题会保留浅色的标记颜色。bug 标记设置填充和文字，`bugPath` 和 `repeats` 设置边框。把标记规则放在分组颜色之后，这样标记会盖在分组颜色上面。

这些颜色是建议。它们是旧技能的颜色。把它们放进每个 SVG 开头的 `<style>` 元素里。这样每个 SVG 都会跟随查看器的浅色或深色设置。

```css
.pele {
  --pele-bg: #ffffff;
  --pele-fg: #1c1c1c;
  --pele-muted: #656565;
  --pele-line: #808080;
  --pele-surface: #fcfcfc;
  --pele-surface-alt: #f1f1f1;
  --pele-border: #c9c9c9;
}
.pele .blue rect { fill: #c3e0ff; }
.pele .orange rect { fill: #f0d3bf; }
.pele .purple rect { fill: #e3d5ff; }
.pele .yellow rect { fill: #f0dcbf; }
.pele .teal rect { fill: #bfe3df; }
.pele .tan rect { fill: #e5d9ce; }
.pele .pink rect { fill: #ffcbe6; }
.pele .breaks rect {
  fill: #ffecee !important;
  stroke: #e72e3b !important;
  stroke-width: 2.5px !important;
}
.pele .breaks text {
  fill: #cd2834 !important;
}
.pele .mayBreak rect {
  fill: #fff3e6 !important;
  stroke: #e8730c !important;
  stroke-width: 2.5px !important;
}
.pele .mayBreak text {
  fill: #b85a06 !important;
}
.pele .bugPath rect {
  stroke: #1680f3 !important;
  stroke-width: 2.5px !important;
}
.pele .repeats rect {
  stroke: #9b35d6 !important;
  stroke-width: 2.5px !important;
  stroke-dasharray: 6 3;
}
@media (prefers-color-scheme: dark) {
  .pele {
    --pele-bg: #1f1f1f;
    --pele-fg: #f5f5f5;
    --pele-muted: #acacac;
    --pele-line: #939393;
    --pele-surface: #121212;
    --pele-surface-alt: #2c2c2c;
    --pele-border: #4e4e4e;
  }
  .pele .blue rect { fill: #1b3857; }
  .pele .orange rect { fill: #573117; }
  .pele .purple rect { fill: #3c2e57; }
  .pele .yellow rect { fill: #573d17; }
  .pele .teal rect { fill: #174641; }
  .pele .tan rect { fill: #3d3127; }
  .pele .pink rect { fill: #57233e; }
  .pele .breaks rect {
    fill: #2e2021 !important;
    stroke: #cf2b35 !important;
  }
  .pele .breaks text {
    fill: #ff6463 !important;
  }
  .pele .mayBreak rect {
    fill: #2e2619 !important;
    stroke: #d0700f !important;
  }
  .pele .mayBreak text {
    fill: #ffa257 !important;
  }
  .pele .bugPath rect {
    stroke: #116dd2 !important;
  }
  .pele .repeats rect {
    stroke: #9a3fcf !important;
  }
}
```

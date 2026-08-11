# StepProgramView（文档内嵌）

只读步骤列表。视觉切片自 Quicker Headless：

`QuickerPc/Quicker.Headless/Web/src/features/steps/StepListEditor.tsx`

`QuickerPc/Quicker.Headless/Web/src/features/steps/StepListRowPreview.tsx`

不要搬拖放、选中、插入槽或参数弹窗。

## MDX

已注册到 `MDXComponents` / `MDXContent`，正文可直接写：

```mdx
<StepProgramView
  caption="跳出循环"
  data={{
    steps: [
      {
        key: "sys:each",
        inputs: { input: "list" },
        outputs: { item: "item", count: "count" },
        ifSteps: [
          {
            key: "sys:if",
            inputs: { condition: "$= {count} > 2" },
            ifSteps: [{ key: "sys:break" }],
          },
        ],
      },
    ],
  }}
/>
```

| Prop | 默认 | 说明 |
| --- | --- | --- |
| `data` | 必填 | 步骤数组 / `{ steps }` / 单步 |
| `caption` | — | 列表上方说明 |
| `showParams` | `false` | 在行下展开输入/输出（设计器本身只显示备注摘要） |
| `showIndex` | `false` | 行号 |
| `showKey` | `false` | 显示 `sys:…` key |
| `density` | `docs` | `docs` / `compact` |

默认 catalog：`data/step-render/catalog.json`。`key` 对齐 `data/xaction/catalog.json`。

图标：catalog 的 `icon`（`fa:Light_Bell`）+ `data/step-render/fa-icons.json` 里的 SVG path。更新：`npm run docs:step-catalog`。

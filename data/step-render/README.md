# step-render data

Offline catalog for `<StepProgramView />`.

| File | Role |
|------|------|
| `catalog.json` | Generated from `data/xaction/catalog.json` + Quicker step `FaIcon`/`Icon` |
| `fa-icons.json` | FA5 SVG paths used by those specs (subset of Quicker `EFontAwesomeIcon.cs`) |
| `sample-steps.json` | Optional fixture |
| `examples/<code>.json` | Pulled shared actions (StepWire). Do not hand-edit steps. |

Regenerate:

```powershell
npm run docs:step-catalog
# needs Quicker at QUICKER_ROOT or D:\source\repos\quicker\quickerorg\Quicker

# Pull a simple shared example → examples/<code>.json + exampleRegistry.ts
npm run docs:example-action -- <shared-action-guid>
```

Screenshot replacement map (docs):

| 截图类型 | 组件 |
|----------|------|
| 步骤列表 / 分支 | `StepProgramView` |
| 添加/编辑变量 | `VariableDefPreview` |
| 步骤参数弹窗 | `ModuleParamPreview`；步骤列表里双击行也会打开 |
| 整窗编辑器 chrome | 一般不复刻，只替换中间步骤区 |

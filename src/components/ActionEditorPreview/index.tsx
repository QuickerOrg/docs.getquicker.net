/**
 * Read-only three-column action editor chrome for docs.
 * Sliced from Headless:
 * - pages/ActionDesignerPage.tsx (toolbox + program)
 * - features/toolbox/TreeActionToolbox.tsx
 * - features/program/XProgramEditor.tsx
 * - features/variables/VariableEditor.tsx
 * - features/program/ActionAppearanceSidebar.tsx
 */
import {useMemo, type ReactNode} from 'react';
import catalogJson from '@site/data/xaction/catalog.json';
import stepCatalog from '@site/data/step-render/catalog.json';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
import StepProgramView from '@site/src/components/StepProgramView';
import {VariableListPane} from '@site/src/components/StepProgramView/VariableListPane';
import {collectProgramVars} from '@site/src/components/StepProgramView/collectProgramVars';
import {normalizeStepList} from '@site/src/components/StepProgramView/normalize';
import type {ProgramVar} from '@site/src/components/StepProgramView/types';
import './styles.css';

type ToolboxTabKey =
  | 'all'
  | 'basic'
  | 'input'
  | 'ui'
  | 'text'
  | 'clipboard'
  | 'files'
  | 'system'
  | 'compute'
  | 'flow';

type EditorFocus = 'full' | 'toolbox' | 'steps' | 'variables' | 'appearance';
type RightTab = 'variables' | 'appearance';

type CatalogModule = {
  key: string;
  name: string;
  description?: string;
  category: string;
};

type StepCatalogShape = {
  runners?: Record<string, {icon?: string; name?: string; description?: string}>;
  icons?: Record<string, string>;
};

const STEP_CATALOG = stepCatalog as StepCatalogShape;

const TOOLBOX_TABS: {key: ToolboxTabKey; label: string; icon: string; category?: string}[] =
  [
    {key: 'all', label: '所有', icon: 'fa:Solid_Bars'},
    {key: 'basic', label: '基础', icon: 'fa:Solid_Cog', category: 'Basic'},
    {key: 'input', label: '输入', icon: 'fa:Solid_Keyboard', category: 'Input'},
    {key: 'ui', label: '界面', icon: 'fa:Solid_WindowMaximize', category: 'Ui'},
    {key: 'text', label: '文本', icon: 'fa:Solid_Font', category: 'Text'},
    {key: 'clipboard', label: '剪贴板', icon: 'fa:Solid_Clipboard', category: 'Clipboard'},
    {key: 'files', label: '文件', icon: 'fa:Solid_Folder', category: 'Files'},
    {key: 'system', label: '系统', icon: 'fa:Solid_Desktop', category: 'System'},
    {key: 'compute', label: '计算', icon: 'fa:Solid_Calculator', category: 'Compute'},
    {key: 'flow', label: '流程', icon: 'fa:Solid_CodeBranch', category: 'Flow'},
  ];

const DEFAULT_STEPS = {
  steps: [
    {
      key: 'sys:getSelectedText',
      outputs: {output: 'selectedText', isSuccess: 'selectSuccess'},
    },
    {
      key: 'sys:if',
      inputs: {condition: '{selectSuccess}'},
      ifSteps: [
        {
          key: 'sys:openUrl',
          inputs: {url: '$$https://www.google.com/search?q={selectedText}'},
        },
      ],
      elseSteps: [
        {
          key: 'sys:openUrl',
          inputs: {url: 'https://www.google.com'},
        },
      ],
    },
  ],
};

export type ActionEditorPreviewProps = {
  /** Same as StepProgramView `data`. */
  data?: unknown;
  example?: string;
  caption?: ReactNode;
  /** Highlight one column for a local screenshot replacement. */
  focus?: EditorFocus;
  toolboxTab?: ToolboxTabKey;
  toolboxSearch?: string;
  toolboxSelected?: string;
  rightTab?: RightTab;
  varFilter?: string;
  selectedVar?: string;
  actionTitle?: string;
  actionDescription?: string;
  selectedIndexes?: readonly number[];
  variables?: readonly ProgramVar[];
  showRun?: boolean;
  className?: string;
};

function listModules(): CatalogModule[] {
  return (catalogJson as {modules: CatalogModule[]}).modules;
}

function ToolbarBtn({
  spec,
  title,
  tone,
}: {
  spec: string;
  title: string;
  tone?: 'run' | 'debug' | 'primary' | 'danger';
}): ReactNode {
  const extra =
    tone === 'run'
      ? ' x-program-editor-toolbar-run-btn x-program-editor-toolbar-run-btn--run'
      : tone === 'debug'
        ? ' x-program-editor-toolbar-run-btn x-program-editor-toolbar-run-btn--debug'
        : tone === 'primary'
          ? ' variable-toolbar-btn--primary'
          : tone === 'danger'
            ? ' variable-toolbar-btn--danger'
            : '';
  return (
    <span className={`variable-toolbar-btn${extra}`} title={title} aria-label={title}>
      <DocsStepIcon spec={spec} size={12} />
    </span>
  );
}

/**
 * Docs-only three-column action editor (toolbox + steps + variables).
 * Read-only; no drag / save / Host.
 */
export default function ActionEditorPreview({
  data,
  example,
  caption,
  focus = 'full',
  toolboxTab = 'all',
  toolboxSearch = '',
  toolboxSelected,
  rightTab = 'variables',
  varFilter = '',
  selectedVar,
  actionTitle = '谷歌搜索',
  actionDescription = '选中文字则搜索，否则打开首页',
  selectedIndexes,
  variables,
  showRun = true,
  className,
}: ActionEditorPreviewProps): ReactNode {
  const stepsData = data ?? (example ? undefined : DEFAULT_STEPS);
  const steps = normalizeStepList(stepsData ?? {steps: []});
  const programVars = useMemo(
    () => collectProgramVars(steps, variables),
    [steps, variables],
  );
  const tab = TOOLBOX_TABS.find((item) => item.key === toolboxTab) ?? TOOLBOX_TABS[0];
  const query = toolboxSearch.trim().toLowerCase();
  const modules = useMemo(() => {
    const all = listModules();
    const byTab = tab.category
      ? all.filter((item) => item.category === tab.category)
      : all;
    const filtered = query
      ? byTab.filter((item) => {
          const hay = `${item.name} ${item.key} ${item.description ?? ''}`.toLowerCase();
          return hay.includes(query);
        })
      : byTab;
    return filtered.slice(0, query ? 24 : 14);
  }, [tab.category, query]);

  const selectedKey = toolboxSelected ?? modules[0]?.key;
  const showAppearance = focus === 'appearance' || rightTab === 'appearance';

  return (
    <div
      className={[
        'qk-ad-editor',
        'qk-docs-preview',
        focus !== 'full' ? `qk-ad-editor--focus-${focus}` : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      aria-label="组合动作编辑器（只读示意）">
      {caption ? <div className="qk-ad-editor__caption">{caption}</div> : null}
      <div className="qk-ad-editor__body">
        <section
          className="qk-ad-editor__toolbox"
          aria-label="模块工具箱">
          <div className="toolbox-toolbar">
            <input
              className="filter-box"
              readOnly
              value={toolboxSearch}
              placeholder="搜索模块… (Ctrl+F)"
              aria-label="搜索模块"
            />
            <button type="button" className="toolbox-icon-btn" title="折叠全部" tabIndex={-1}>
              <DocsStepIcon spec="fa:Light_CompressAlt" size={14} />
            </button>
          </div>
          <div className="toolbox-body">
            <div className="toolbox-tabs" role="tablist" aria-label="模块分类">
              {TOOLBOX_TABS.map((item) => (
                <span
                  key={item.key}
                  className={`toolbox-tab${item.key === toolboxTab ? ' active' : ''}`}
                  title={item.label}
                  aria-label={item.label}
                  role="tab"
                  aria-selected={item.key === toolboxTab}>
                  <DocsStepIcon spec={item.icon} size={14} className="toolbox-tab-icon" />
                </span>
              ))}
            </div>
            <div className="toolbox-tree" role="tree">
              {modules.length === 0 ? (
                <div className="toolbox-tree-empty">无匹配模块</div>
              ) : (
                modules.map((mod) => {
                  const icon = STEP_CATALOG.runners?.[mod.key]?.icon;
                  const selected = mod.key === selectedKey;
                  return (
                    <div
                      key={mod.key}
                      className={`toolbox-node${selected ? ' selected' : ''}`}
                      role="treeitem"
                      aria-selected={selected}
                      title={mod.description ?? mod.name}>
                      <span className="toolbox-expand hidden" aria-hidden="true" />
                      <DocsStepIcon
                        className="toolbox-node-icon"
                        spec={icon}
                        size={13}
                        icons={STEP_CATALOG.icons}
                      />
                      <span className="toolbox-node-name">{mod.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <div className="x-program-editor qk-ad-editor__program">
          <div className="x-program-editor-toolbar" role="toolbar" aria-label="程序编辑">
            <ToolbarBtn spec="fa:Light_Undo" title="撤销 (Ctrl+Z)" />
            <ToolbarBtn spec="fa:Light_Redo" title="重做 (Ctrl+Y / Ctrl+Shift+Z)" />
            {showRun ? (
              <div className="x-program-editor-toolbar-run" role="group" aria-label="运行动作">
                <ToolbarBtn spec="fa:Light_Play:#39b54d" title="运行当前动作" tone="run" />
                <ToolbarBtn spec="fa:Light_Bug:#f5b042" title="调试当前动作" tone="debug" />
                <ToolbarBtn spec="fa:Light_Terminal:#39b54d" title="带参数运行" tone="run" />
              </div>
            ) : null}
            <span className="x-program-editor-toolbar-spacer" />
            <span className="x-program-editor-toolbar-save" title="保存到 Quicker (Ctrl+S)">
              <DocsStepIcon spec="fa:Solid_Save" size={12} />
              <span>保存</span>
            </span>
            <ToolbarBtn spec="fa:Light_Cog" title="动作设计器设置" />
            <ToolbarBtn spec="fa:Light_QuestionCircle" title="使用说明 (F1)" />
          </div>
          <div className="x-program-editor-steps">
            <StepProgramView
              className="qk-sr-program--embedded"
              data={stepsData}
              example={example}
              selectedIndexes={selectedIndexes}
              showVariables={false}
              stepPopup
              density="compact"
            />
          </div>
          <div className="x-program-editor-gutter workspace-gutter" aria-hidden />
          <div className="x-program-editor-variables">
            <div className="variable-editor">
              <div className="variable-toolbar">
                <div className="variable-toolbar-main" role="toolbar" aria-label="变量工具">
                  <div className="variable-toolbar-group">
                    <ToolbarBtn spec="fa:Light_Plus" title="添加变量" tone="primary" />
                    <ToolbarBtn spec="fa:Light_TrashAlt" title="删除变量" tone="danger" />
                  </div>
                  <div className="variable-toolbar-group">
                    <ToolbarBtn spec="fa:Light_Eraser" title="清理未使用的变量" />
                    <ToolbarBtn spec="fa:Light_SortAmountDown" title="排序" />
                  </div>
                  <div className="variable-filter-row">
                    <input
                      className="filter-box variable-filter-box"
                      readOnly
                      value={varFilter}
                      placeholder="筛选变量…"
                      aria-label="筛选变量"
                    />
                  </div>
                </div>
              </div>
              {showAppearance ? (
                <div className="qk-ad-editor__appearance" aria-label="动作外观">
                  <div className="qk-ad-editor__appearance-title">动作外观</div>
                  <div className="qk-ad-editor__appearance-hint">
                    未选中变量时可编辑标题与图标
                  </div>
                  <label className="qk-ad-editor__field">
                    <span>标题</span>
                    <span className="qk-ad-editor__field-value">{actionTitle}</span>
                  </label>
                  <label className="qk-ad-editor__field">
                    <span>说明</span>
                    <span className="qk-ad-editor__field-value qk-ad-editor__field-value--multi">
                      {actionDescription}
                    </span>
                  </label>
                </div>
              ) : (
                <VariableListPane variables={programVars} selected={selectedVar} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

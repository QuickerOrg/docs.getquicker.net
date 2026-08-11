import type {ReactNode} from 'react';
import {getModuleDef} from '@site/data/xaction/modules-index';
import {
  StepParamFormPreview,
  type StepParamFormModule,
} from './StepParamFormPreview';
import './stepParamForm.css';

export type ModuleParamPreviewProps = {
  moduleKey: string;
  /** Override input values (catalog defaults otherwise). */
  values?: Readonly<Record<string, string>>;
  /**
   * Input param key → variable name (whole-field bind).
   * Also accepts `values={{ x: '{posX}' }}` as shorthand.
   */
  inputVars?: Readonly<Record<string, string>>;
  /** Output param key → variable name. Empty shows “-”. */
  outputVars?: Readonly<Record<string, string>>;
  /** Show condition-hidden params (exePath when browser≠custom, …). */
  showHidden?: boolean;
  /**
   * Keep these input/output keys visible; collapse the rest into「其他参数」.
   * Use beside prose that discusses a subset of fields.
   */
  focusKeys?: readonly string[];
  /** Default true when focusKeys is set. */
  collapseOthers?: boolean;
  /** Header action icon; also an anchor for PreviewMap (`actionIcon`). */
  actionIcon?: string;
  /** Override section body scrolling. Default: scroll when the form is long. */
  scrollBody?: boolean;
  /** Step note shown in the footer. */
  note?: string;
  /** “停用此步骤” checkbox (read-only chrome). */
  stepDisabled?: boolean;
  /** Overlay chrome when opened from StepProgramView double-click. */
  dialog?: boolean;
  onClose?: () => void;
  className?: string;
};

/**
 * Docs entry for module parameter dialogs.
 * Implementation synced from Headless `@quicker/step-render` StepParamFormPreview
 * (class names + CSS from step-param-* / step-editor-*).
 */
export default function ModuleParamPreview({
  moduleKey,
  values,
  inputVars,
  outputVars,
  showHidden = false,
  focusKeys,
  collapseOthers,
  actionIcon,
  scrollBody,
  note,
  stepDisabled,
  dialog = false,
  onClose,
  className,
}: ModuleParamPreviewProps): ReactNode {
  const module = getModuleDef(moduleKey);
  if (!module) {
    return (
      <div
        className={[
          'qk-sr-param-form',
          dialog ? 'qk-sr-param-form--dialog' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        role={dialog ? 'dialog' : undefined}
        aria-modal={dialog || undefined}
        aria-labelledby={dialog ? 'step-editor-popup-title' : undefined}
      >
        {dialog ? (
          <div className="step-editor-popup-header">
            <h2 id="step-editor-popup-title">查看步骤</h2>
            {onClose ? (
              <button
                type="button"
                className="step-editor-popup-close"
                aria-label="关闭"
                onClick={onClose}
              >
                ×
              </button>
            ) : null}
          </div>
        ) : null}
        <p className="qk-sr-param-form__missing">
          未找到模块定义 <code>{moduleKey}</code>
        </p>
      </div>
    );
  }

  const formModule: StepParamFormModule = {
    key: module.key,
    name: module.name,
    description: module.description,
    inputs: module.inputs,
    outputs: module.outputs,
    selections: module.selections,
  };

  return (
    <StepParamFormPreview
      module={formModule}
      values={values}
      inputVars={inputVars}
      outputVars={outputVars}
      showHidden={showHidden}
      focusKeys={focusKeys}
      collapseOthers={collapseOthers}
      actionIcon={actionIcon}
      scrollBody={scrollBody}
      note={note}
      stepDisabled={stepDisabled}
      dialog={dialog}
      onClose={onClose}
      className={className}
    />
  );
}

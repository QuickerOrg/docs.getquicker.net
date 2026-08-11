/**
 * Docs overlay for double-clicking a StepProgramView row.
 * Chrome mirrors Headless StepEditorPopup (backdrop + dialog), body is
 * ModuleParamPreview (already sliced from the same popup).
 */
import {useEffect, useRef, type JSX} from 'react';
import {createPortal} from 'react-dom';
import ModuleParamPreview from '@site/src/components/ModuleParamPreview';
import '@site/src/components/ModuleParamPreview/stepParamForm.css';
import type {StepWire} from './types';

export type StepInspectPopupProps = {
  step: StepWire;
  actionIcon?: string;
  onClose: () => void;
};

export function StepInspectPopup({
  step,
  actionIcon,
  onClose,
}: StepInspectPopupProps): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }
      // Enum listbox also listens for Escape; let it close first.
      if (document.querySelector('.step-param-enum-popup--portal')) {
        return;
      }
      event.preventDefault();
      onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      prevFocus?.focus();
    };
  }, [onClose]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="qk-sr-param-form-backdrop qk-docs-preview"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModuleParamPreview
          moduleKey={step.key}
          values={step.inputs}
          outputVars={step.outputs}
          actionIcon={actionIcon}
          note={step.note}
          stepDisabled={step.disabled}
          dialog
          onClose={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}

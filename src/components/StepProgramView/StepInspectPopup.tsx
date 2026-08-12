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
    const doc = document.documentElement;
    const scrollbar = Math.max(0, window.innerWidth - doc.clientWidth);
    const prevFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // One class toggles overflow. Do not also pad .navbar: Infima navbar is
    // sticky, so body/html lock already keeps its width; extra padding makes
    // the right cluster (search / GitHub) jump.
    doc.style.setProperty('--qk-sr-popup-scrollbar', `${scrollbar}px`);
    doc.classList.add('qk-sr-popup-open');
    dialogRef.current?.focus({preventScroll: true});

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
      doc.classList.remove('qk-sr-popup-open');
      doc.style.removeProperty('--qk-sr-popup-scrollbar');
      document.removeEventListener('keydown', onKey);
      prevFocus?.focus({preventScroll: true});
    };
  }, [onClose]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="qk-sr-param-form-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="qk-sr-param-form-dialog"
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

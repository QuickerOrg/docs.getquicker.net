import {useEffect, useMemo, useState, type JSX} from 'react';

/** Aligns with Quicker KeyInputStepData (PascalCase JSON). */
type KeyInputStepData = {
  CtrlKeys: number[];
  Keys: number[];
};

const MODIFIER_VK = new Set([16, 17, 18, 91, 92, 160, 161, 162, 163, 164, 165]);

const VK_NAMES: Record<number, string> = {
  16: 'Shift',
  17: 'Ctrl',
  18: 'Alt',
  91: 'LeftWin',
  92: 'RightWin',
  160: 'LeftShift',
  161: 'RightShift',
  162: 'LeftCtrl',
  163: 'RightCtrl',
  164: 'LeftAlt',
  165: 'RightAlt',
};

function vkName(code: number): string {
  if (VK_NAMES[code]) {
    return VK_NAMES[code];
  }
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(code);
  }
  if (code >= 48 && code <= 57) {
    return String.fromCharCode(code);
  }
  return `Vk${code}`;
}

export function parseKeyInputValue(raw: string): KeyInputStepData {
  const text = raw.trim();
  if (!text) {
    return {CtrlKeys: [], Keys: []};
  }
  try {
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const ctrl = parsed.CtrlKeys ?? parsed.ctrlKeys ?? [];
    const keys = parsed.Keys ?? parsed.keys ?? [];
    return {
      CtrlKeys: Array.isArray(ctrl)
        ? ctrl.map((x) => Number(x)).filter((n) => Number.isFinite(n))
        : [],
      Keys: Array.isArray(keys)
        ? keys.map((x) => Number(x)).filter((n) => Number.isFinite(n))
        : [],
    };
  } catch {
    return {CtrlKeys: [], Keys: []};
  }
}

/** Matches WPF KeyInputItem / Headless formatKeyInputStepData. */
export function formatKeyInputValue(data: KeyInputStepData): string {
  const mods = data.CtrlKeys.map(vkName);
  const keys = data.Keys.map(vkName);
  if (mods.length === 0 && keys.length === 0) {
    return '（未设置按键）';
  }
  if (mods.length > 0) {
    const keyPart = keys.length > 0 ? keys.join(',') : '';
    return keyPart ? `${mods.join('+')}+ [ ${keyPart} ]` : mods.join('+');
  }
  return keys.join(',');
}

function serializeKeyInputValue(data: KeyInputStepData): string {
  return JSON.stringify({CtrlKeys: data.CtrlKeys, Keys: data.Keys});
}

/**
 * Read-only-looking keyboard row (WPF 录制 / …).
 * Recording updates the preview value; sliced from Headless KeyboardParamEditor.
 */
export function KeyboardParamControl({
  value,
  onChange,
  description,
}: {
  value: string;
  onChange: (next: string) => void;
  description?: string;
}): JSX.Element {
  const data = useMemo(() => parseKeyInputValue(value), [value]);
  const [recording, setRecording] = useState(false);
  const display = formatKeyInputValue(data);

  useEffect(() => {
    if (!recording) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'Escape') {
        setRecording(false);
        return;
      }
      const vk = event.keyCode || event.which;
      if (!vk || MODIFIER_VK.has(vk)) {
        return;
      }
      const ctrlKeys: number[] = [];
      if (event.ctrlKey) {
        ctrlKeys.push(17);
      }
      if (event.shiftKey) {
        ctrlKeys.push(16);
      }
      if (event.altKey) {
        ctrlKeys.push(18);
      }
      if (event.metaKey) {
        ctrlKeys.push(91);
      }
      onChange(serializeKeyInputValue({CtrlKeys: ctrlKeys, Keys: [vk]}));
      setRecording(false);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [recording, onChange]);

  return (
    <div className="keyboard-param-editor" title={description}>
      <div
        className={`keyboard-param-display${recording ? ' is-recording' : ''}`}
        aria-live="polite"
      >
        {recording ? '请按下快捷键…（Esc 取消）' : display}
      </div>
      <div className="keyboard-param-actions">
        <button
          type="button"
          className="qk-sr-param-form__btn qk-sr-param-form__btn--primary"
          disabled={recording}
          onClick={() => setRecording(true)}
        >
          {recording ? '录制中…' : '录制'}
        </button>
        <button
          type="button"
          className="qk-sr-param-form__btn"
          disabled
          title="选择按键组合"
        >
          …
        </button>
      </div>
    </div>
  );
}

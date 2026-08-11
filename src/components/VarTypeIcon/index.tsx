/**
 * Quicker variable-type icon (Headless `actionVariableIconStr` → IconControl).
 * Spec is `res:Var/{Name}.png`; assets live at `/img/quicker-var/`
 * (copied from Quicker `Assets/Var/*.png`).
 */
import useBaseUrl from '@docusaurus/useBaseUrl';
import type {JSX} from 'react';

export type VarTypeKind =
  | 'text'
  | 'integer'
  | 'number'
  | 'boolean'
  | 'image'
  | 'list'
  | 'datetime'
  | 'dict'
  | 'table'
  | 'keyboard'
  | 'object'
  | 'any';

/** Catalog / C# VarType name → `/img/quicker-var/{file}.png`. */
const VAR_ICON_FILE: Record<VarTypeKind, string> = {
  text: 'text.png',
  integer: 'integer.png',
  number: 'number.png',
  boolean: 'boolean.png',
  image: 'image.png',
  list: 'list.png',
  datetime: 'datetime.png',
  dict: 'dict.png',
  table: 'table.png',
  keyboard: 'keyboard.png',
  object: 'object.png',
  any: 'any.png',
};

/** Align with Headless `ACTION_VAR_TYPE_ZH_LABELS`. */
const VAR_TYPE_ZH: Record<VarTypeKind, string> = {
  text: '文本',
  image: '图片',
  boolean: '布尔',
  number: '数字(小数)',
  integer: '数字(整数)',
  datetime: '时间日期',
  list: '文本列表',
  dict: '词典',
  table: '表格',
  keyboard: '键盘',
  object: '对象',
  any: '动态对象',
};

export function normalizeVarType(raw: string | undefined): VarTypeKind {
  const t = (raw ?? '').trim().toLowerCase();
  if (t === 'int' || t === 'integer') return 'integer';
  if (t === 'number' || t === 'double' || t === 'float' || t === 'decimal') {
    return 'number';
  }
  if (t === 'bool' || t === 'boolean') return 'boolean';
  if (t === 'image' || t === 'bitmap' || t === 'img') return 'image';
  if (t === 'list' || t === 'stringlist') return 'list';
  if (t === 'datetime' || t === 'date' || t === 'time') return 'datetime';
  if (t === 'dict' || t === 'dictionary') return 'dict';
  if (t === 'table') return 'table';
  if (t === 'keyboard') return 'keyboard';
  if (t === 'object') return 'object';
  if (t === 'any' || t === 'dynamic' || t === 'na') return 'any';
  return 'text';
}

export function varTypeZhLabel(raw: string | undefined): string {
  return VAR_TYPE_ZH[normalizeVarType(raw)];
}

export function varTypeIconFile(raw: string | undefined): string {
  return VAR_ICON_FILE[normalizeVarType(raw)];
}

export type VarTypeIconProps = {
  type?: string;
  size?: number;
  className?: string;
  title?: string;
};

export function VarTypeIcon({
  type,
  size = 14,
  className,
  title,
}: VarTypeIconProps): JSX.Element {
  const kind = normalizeVarType(type);
  const src = useBaseUrl(`/img/quicker-var/${VAR_ICON_FILE[kind]}`);
  const label = title ?? (type?.trim() ? `${type.trim()} · ${VAR_TYPE_ZH[kind]}` : VAR_TYPE_ZH[kind]);
  return (
    <img
      className={className}
      src={src}
      width={size}
      height={size}
      alt=""
      title={label}
      draggable={false}
    />
  );
}

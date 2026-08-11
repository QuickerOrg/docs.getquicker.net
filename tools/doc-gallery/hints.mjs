/**
 * Section titles that look like a page skeleton, not a useful DocCard cover.
 * Shared by gallery build and DocCard (do not show these as fake form fields).
 */
export const STRUCTURAL_HINT_HEADINGS = new Set([
  '当前模块定义',
  '概述',
  '参数',
  '参数说明',
  '输入参数',
  '输出',
  '输出参数',
  '通用参数',
  '操作类型',
  '示例',
  '示例动作',
  '相关',
  '相关链接',
  '限制',
  '限制与排障',
  '注意事项',
  '说明',
  '使用场景',
  '应用场景',
  '快速操作',
  '常见问题',
  '更新历史',
  '更改历史',
]);

export function isStructuralHint(label) {
  return STRUCTURAL_HINT_HEADINGS.has(String(label ?? '').trim());
}

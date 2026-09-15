/**
 * Docs demo: interactive layout map of Quicker V2 新面板.
 * Hotspot captions cite menu paths / gestures from action-panel docs only.
 */
import Link from '@docusaurus/Link';
import {
  useCallback,
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import styles from './styles.module.css';

type HotspotId =
  | 'enable'
  | 'titleSearch'
  | 'moreMenu'
  | 'windowSize'
  | 'drafts'
  | 'sidebarButtons'
  | 'globalArea'
  | 'contextArea'
  | 'lock'
  | 'sceneTabs'
  | 'viewOptions'
  | 'createButton'
  | 'groupNav'
  | 'recentActions'
  | 'navBar';

type Hotspot = {
  id: HotspotId;
  label: string;
  title: string;
  body: string;
  settingPath: string;
  href?: string;
  hrefLabel?: string;
};

const HOTSPOTS: readonly Hotspot[] = [
  {
    id: 'enable',
    label: '启用',
    title: '启用新面板窗口',
    body: '登录账号后，可从旧面板右上角菜单选择「切换至新版主窗口」，或在设置中开启新版面板。关闭该设置可临时切回旧面板，不会删除动作。本机离线账号固定使用新面板。',
    settingPath: '设置 → 基础设置 → 新版面板窗口；或旧面板菜单 → 切换至新版主窗口',
    href: '/v2/features/action-panel/usage#启用新面板窗口',
    hrefLabel: '启用说明',
  },
  {
    id: 'titleSearch',
    label: '搜索',
    title: '标题栏搜索',
    body: '点击标题栏搜索入口会打开全局搜索窗口，适合跨场景和其它搜索来源查找。面板悬停时直接键入名称或拼音，则筛选当前动作区域中的动作。',
    settingPath: '标题栏搜索入口 → 全局搜索',
    href: '/v2/features/action-panel/usage#查找和运行动作',
    hrefLabel: '查找和运行',
  },
  {
    id: 'moreMenu',
    label: '更多',
    title: '标题栏更多菜单',
    body: '跨场景整理用「场景与动作」；按程序 / 动作页筛选用「动作管理」。还可打开最近动作错误、工具（如当前场景诊断）等入口。',
    settingPath: '标题栏更多菜单 → 场景与动作 / 动作管理 / 最近动作错误',
    href: '/v2/features/action-panel/usage#管理多个场景和大量动作',
    hrefLabel: '管理场景与动作',
  },
  {
    id: 'windowSize',
    label: '尺寸',
    title: '窗口尺寸预设',
    body: '窗口支持拖动和缩放。标题栏菜单中的「窗口尺寸」可保存和切换多个尺寸预设；双击标题栏也可恢复或切换尺寸。',
    settingPath: '标题栏菜单 → 窗口尺寸（亦可双击标题栏）',
    href: '/v2/features/action-panel/usage#窗口尺寸',
    hrefLabel: '窗口尺寸',
  },
  {
    id: 'drafts',
    label: '暂存区',
    title: '左侧暂存区',
    body: '暂存区保存尚未放入正式场景的本机动作。顶部可直接「新建动作」或「用 AI 写」；确认后再保留到场景。暂存内容不参与云同步。',
    settingPath: '新面板左侧导航 → 暂存区',
    href: '/v2/features/action-panel/action-drafts',
    hrefLabel: '本机动作暂存区',
  },
  {
    id: 'sidebarButtons',
    label: '快捷按钮',
    title: '侧边栏快捷按钮',
    body: '2.1.29 起可自定义。除默认「截图 Pro」外，还可放入设置、场景与动作管理、公共子程序管理，或添加常用动作并调整顺序。',
    settingPath: '快捷按钮设置（侧边栏相关入口）',
    href: '/v2/features/action-panel/usage#侧边栏快捷按钮',
    hrefLabel: '侧边栏说明',
  },
  {
    id: 'globalArea',
    label: '全局区',
    title: '全局区',
    body: '放置不依赖当前程序、希望随时使用的动作。可添加全局场景、通用场景或自定义场景标签。可用 Ctrl + 滚轮切换该区域场景标签。',
    settingPath: '视图选项 → 同时显示「全局 + 上下文区」或只显示其一',
    href: '/v2/features/action-panel/usage#全局区',
    hrefLabel: '全局区',
  },
  {
    id: 'contextArea',
    label: '上下文区',
    title: '上下文区',
    body: '随当前前台程序或网址变化，优先显示匹配场景；「通用」标签始终保留在末尾。「视图选项」可只显示上下文区或与全局区同显。',
    settingPath: '视图选项 → 布局（全局 + 上下文 / 仅其一）',
    href: '/v2/features/action-panel/usage#上下文区',
    hrefLabel: '上下文区',
  },
  {
    id: 'lock',
    label: '锁定',
    title: '上下文锁定',
    body: '点击上下文区右上角锁定按钮，可停止上下文自动切换；再次点击恢复。右键该按钮还可选择要加载并锁定的应用场景。',
    settingPath: '上下文区右上角「锁定」按钮（单击 / 右键）',
    href: '/v2/features/action-panel/usage#上下文区',
    hrefLabel: '上下文区',
  },
  {
    id: 'sceneTabs',
    label: '场景标签',
    title: '场景标签',
    body: '单击切换场景；双击在「场景与动作管理」中打开该场景；右键可新建 / 导入动作、从旧动作页引入，以及打开场景管理。全局区标签可拖动排序并自动保存。',
    settingPath: '全局区 / 上下文区场景标签条（单击 / 双击 / 右键）',
    href: '/v2/features/action-panel/usage#场景标签和分组',
    hrefLabel: '场景标签和分组',
  },
  {
    id: 'viewOptions',
    label: '视图选项',
    title: '视图选项',
    body: '控制全局与上下文的显示、磁贴 / 列表样式、分组模式、最近动作、创建按钮、执行后是否回到列表开头，以及动作排序方式等。',
    settingPath: '动作区右上角「视图选项」',
    href: '/v2/features/action-panel/usage#视图选项',
    hrefLabel: '视图选项',
  },
  {
    id: 'createButton',
    label: '创建',
    title: '创建动作入口',
    body: '区域右上角「+」、创建动作磁贴，或空白处右键，都可新建 / 粘贴 / 导入动作。是否显示创建动作按钮可在视图选项中开关。',
    settingPath: '动作区右上角「+」；视图选项 → 是否显示创建动作按钮',
    href: '/v2/features/action-panel/usage#新建粘贴和导入动作',
    hrefLabel: '新建与导入',
  },
  {
    id: 'groupNav',
    label: '分组导航',
    title: '右侧分组导航',
    body: '开启「显示分组」且连续显示全部分组时，右侧分组导航可快速定位；存在置顶动作时顶部还会出现带图钉的「置顶」分组。导航位置可在视图选项中调整。',
    settingPath: '视图选项 → 分组显示 / 分组快速滚动区域',
    href: '/v2/features/action-panel/usage#视图选项',
    hrefLabel: '视图选项',
  },
  {
    id: 'recentActions',
    label: '最近动作',
    title: '底部最近动作',
    body: '快速再次运行近期使用过的动作。是否显示该区域由视图选项控制。',
    settingPath: '视图选项 → 是否显示底部最近动作',
    href: '/v2/features/action-panel/usage#查找和运行动作',
    hrefLabel: '查找和运行',
  },
  {
    id: 'navBar',
    label: '导航栏',
    title: '导航栏显隐与宽窄',
    body: '2.2.10 起：双击面板内容空白处可显示或隐藏导航栏；双击导航栏空白处可在宽导航与窄导航之间切换。请点在空白处，避免点到标签或磁贴。',
    settingPath: '双击内容空白显隐；双击导航栏空白切换宽窄（2.2.10）',
    href: '/v2/features/action-panel/usage#双击导航栏',
    hrefLabel: '双击导航栏',
  },
];

const DEFAULT_ID: HotspotId = 'viewOptions';

const TILES_GLOBAL = ['剪贴板', '截图', '置顶窗', '计算器'] as const;
const TILES_CONTEXT = ['复制路径', '新建文件夹', '压缩', '打开终端', '属性'] as const;
const RECENT = ['剪贴板', '截图', '复制路径'] as const;

function hotspotById(id: HotspotId): Hotspot {
  return HOTSPOTS.find((h) => h.id === id) ?? HOTSPOTS[0]!;
}

function HotspotButton({
  hotspot,
  selected,
  onSelect,
  className,
  children,
}: {
  hotspot: Hotspot;
  selected: boolean;
  onSelect: (id: HotspotId) => void;
  className?: string;
  children?: ReactNode;
}): ReactNode {
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(hotspot.id);
      }
    },
    [hotspot.id, onSelect],
  );

  return (
    <button
      type="button"
      className={[
        styles.hotspot,
        selected ? styles.hotspotSelected : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-pressed={selected}
      aria-label={hotspot.title}
      title={hotspot.title}
      onClick={() => onSelect(hotspot.id)}
      onKeyDown={onKeyDown}
    >
      {children ?? <span className={styles.hotspotLabel}>{hotspot.label}</span>}
    </button>
  );
}

export type ActionPanelLayoutDemoProps = {
  /** Optional intro line above the stage. */
  caption?: ReactNode;
};

export default function ActionPanelLayoutDemo({
  caption,
}: ActionPanelLayoutDemoProps): ReactNode {
  const [selectedId, setSelectedId] = useState<HotspotId>(DEFAULT_ID);
  const selected = hotspotById(selectedId);
  const captionId = useId();
  const listId = useId();

  const onSelect = useCallback((id: HotspotId) => {
    setSelectedId(id);
  }, []);

  return (
    <div className={styles.root}>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
      <p className={styles.hint}>
        点击示意分区查看说明；也可用下方标签切换。完整步骤见
        <Link to="/v2/features/action-panel/usage">使用说明</Link>。
      </p>

      <div className={styles.layout}>
        <div
          className={styles.stage}
          role="group"
          aria-label="新面板布局示意"
          aria-describedby={captionId}
        >
          <div className={styles.panel}>
            <div className={styles.titleBar}>
              <HotspotButton
                hotspot={hotspotById('enable')}
                selected={selectedId === 'enable'}
                onSelect={onSelect}
                className={styles.hsBrand}
              >
                <span className={styles.brandMark} aria-hidden="true" />
                <span>Quicker</span>
              </HotspotButton>
              <HotspotButton
                hotspot={hotspotById('titleSearch')}
                selected={selectedId === 'titleSearch'}
                onSelect={onSelect}
                className={styles.hsSearch}
              >
                <span className={styles.searchIcon} aria-hidden="true">
                  ⌕
                </span>
                <span>搜索</span>
              </HotspotButton>
              <div className={styles.titleSpacer} />
              <HotspotButton
                hotspot={hotspotById('windowSize')}
                selected={selectedId === 'windowSize'}
                onSelect={onSelect}
                className={styles.hsChip}
              >
                窗口尺寸
              </HotspotButton>
              <HotspotButton
                hotspot={hotspotById('moreMenu')}
                selected={selectedId === 'moreMenu'}
                onSelect={onSelect}
                className={styles.hsChip}
              >
                更多 ▾
              </HotspotButton>
            </div>

            <div className={styles.body}>
              <aside className={styles.sidebar}>
                <HotspotButton
                  hotspot={hotspotById('drafts')}
                  selected={selectedId === 'drafts'}
                  onSelect={onSelect}
                  className={styles.hsSidebarItem}
                >
                  <span className={styles.sideIcon} aria-hidden="true">
                    ✎
                  </span>
                  暂存区
                </HotspotButton>
                <HotspotButton
                  hotspot={hotspotById('sidebarButtons')}
                  selected={selectedId === 'sidebarButtons'}
                  onSelect={onSelect}
                  className={styles.hsSidebarStack}
                >
                  <span className={styles.sideBtn}>截图</span>
                  <span className={styles.sideBtn}>设置</span>
                  <span className={styles.sideBtn}>场景</span>
                </HotspotButton>
                <HotspotButton
                  hotspot={hotspotById('navBar')}
                  selected={selectedId === 'navBar'}
                  onSelect={onSelect}
                  className={styles.hsNavHint}
                >
                  导航
                </HotspotButton>
              </aside>

              <div className={styles.main}>
                <section className={styles.area}>
                  <div className={styles.areaHeader}>
                    <HotspotButton
                      hotspot={hotspotById('sceneTabs')}
                      selected={selectedId === 'sceneTabs'}
                      onSelect={onSelect}
                      className={styles.hsTabs}
                    >
                      <span className={styles.tabActive}>全局</span>
                      <span className={styles.tab}>常用</span>
                      <span className={styles.tab}>工具</span>
                    </HotspotButton>
                    <span className={styles.areaTag}>全局区</span>
                  </div>
                  <HotspotButton
                    hotspot={hotspotById('globalArea')}
                    selected={selectedId === 'globalArea'}
                    onSelect={onSelect}
                    className={styles.hsTiles}
                  >
                    <div className={styles.tileGrid}>
                      {TILES_GLOBAL.map((name) => (
                        <span key={name} className={styles.tile}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </HotspotButton>
                </section>

                <section className={styles.area}>
                  <div className={styles.areaHeader}>
                    <HotspotButton
                      hotspot={hotspotById('sceneTabs')}
                      selected={selectedId === 'sceneTabs'}
                      onSelect={onSelect}
                      className={styles.hsTabs}
                    >
                      <span className={styles.tabActive}>资源管理器</span>
                      <span className={styles.tab}>通用</span>
                    </HotspotButton>
                    <div className={styles.areaTools}>
                      <HotspotButton
                        hotspot={hotspotById('lock')}
                        selected={selectedId === 'lock'}
                        onSelect={onSelect}
                        className={styles.hsIconBtn}
                      >
                        锁定
                      </HotspotButton>
                      <HotspotButton
                        hotspot={hotspotById('viewOptions')}
                        selected={selectedId === 'viewOptions'}
                        onSelect={onSelect}
                        className={styles.hsIconBtn}
                      >
                        视图选项
                      </HotspotButton>
                      <HotspotButton
                        hotspot={hotspotById('createButton')}
                        selected={selectedId === 'createButton'}
                        onSelect={onSelect}
                        className={styles.hsIconBtn}
                      >
                        +
                      </HotspotButton>
                    </div>
                    <span className={styles.areaTag}>上下文区</span>
                  </div>
                  <HotspotButton
                    hotspot={hotspotById('contextArea')}
                    selected={selectedId === 'contextArea'}
                    onSelect={onSelect}
                    className={styles.hsTiles}
                  >
                    <div className={styles.tileGrid}>
                      {TILES_CONTEXT.map((name) => (
                        <span key={name} className={styles.tile}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </HotspotButton>
                </section>
              </div>

              <HotspotButton
                hotspot={hotspotById('groupNav')}
                selected={selectedId === 'groupNav'}
                onSelect={onSelect}
                className={styles.hsGroupNav}
              >
                <span className={styles.groupItemActive}>常用</span>
                <span className={styles.groupItem}>文件</span>
                <span className={styles.groupItem}>窗口</span>
              </HotspotButton>
            </div>

            <HotspotButton
              hotspot={hotspotById('recentActions')}
              selected={selectedId === 'recentActions'}
              onSelect={onSelect}
              className={styles.hsRecent}
            >
              <span className={styles.recentLabel}>最近</span>
              {RECENT.map((name) => (
                <span key={name} className={styles.recentChip}>
                  {name}
                </span>
              ))}
            </HotspotButton>

            <HotspotButton
              hotspot={hotspotById('navBar')}
              selected={selectedId === 'navBar'}
              onSelect={onSelect}
              className={styles.hsBottomNav}
            >
              <span className={styles.bottomNavText}>
                导航栏 · 双击空白显隐 / 切换宽窄
              </span>
            </HotspotButton>
          </div>
        </div>

        <aside
          className={styles.info}
          id={captionId}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className={styles.infoEyebrow}>当前分区</p>
          <h3 className={styles.infoTitle}>{selected.title}</h3>
          <p className={styles.infoBody}>{selected.body}</p>
          <p className={styles.infoSetting}>
            <span className={styles.infoSettingLabel}>设置位置</span>
            <span className={styles.infoSettingPath}>{selected.settingPath}</span>
          </p>
          {selected.href ? (
            <p className={styles.infoLink}>
              <Link to={selected.href}>{selected.hrefLabel ?? '相关说明'}</Link>
            </p>
          ) : null}
        </aside>
      </div>

      <div
        className={styles.chipRow}
        role="listbox"
        aria-label="面板分区"
        id={listId}
      >
        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            type="button"
            role="option"
            aria-selected={selectedId === h.id}
            className={[
              styles.chip,
              selectedId === h.id ? styles.chipSelected : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(h.id)}
          >
            {h.label}
          </button>
        ))}
      </div>
    </div>
  );
}

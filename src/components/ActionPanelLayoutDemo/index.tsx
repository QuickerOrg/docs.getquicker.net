/**
 * Docs sketch of Quicker V2 新面板 chrome.
 * Source:
 *   QuickerPc/Quicker/Modules/MainWindow/NewMainWindow/QuickerMainWin.xaml
 *   QuickerPc/Quicker/Modules/MainWindow/NewMainWindow/ActionsPanel/ActionsPanelView.xaml
 * Prefer re-sync from those XAML files over hand-tuning.
 */
import Link from '@docusaurus/Link';
import {DocsStepIcon} from '@site/src/components/StepProgramView/DocsStepIcon';
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
    body: '登录账号后，可从旧面板右上角菜单选择「切换至新版主窗口」，或点标题栏齿轮打开设置后开启新版面板。关闭该设置可临时切回旧面板，不会删除动作。本机离线账号固定使用新面板。',
    settingPath: '标题栏齿轮 → 基础设置 → 新版面板窗口；或旧面板菜单 → 切换至新版主窗口',
    href: '/v2/features/action-panel/usage#启用新面板窗口',
    hrefLabel: '启用说明',
  },
  {
    id: 'titleSearch',
    label: '搜索',
    title: '标题栏搜索',
    body: '标题栏默认只显示搜索图标；点开后出现搜索框。点击会打开全局搜索窗口，适合跨场景查找。面板悬停时直接键入名称或拼音，则筛选当前动作区域中的动作。',
    settingPath: '标题栏右侧搜索图标 → 全局搜索',
    href: '/v2/features/action-panel/usage#查找和运行动作',
    hrefLabel: '查找和运行',
  },
  {
    id: 'moreMenu',
    label: '更多',
    title: '标题栏更多菜单',
    body: '省略号按钮打开更多菜单。跨场景整理用「场景与动作」；按程序 / 动作页筛选用「动作管理」。导航栏宽窄、快捷按钮和窗口尺寸都在「面板窗口」子菜单里。排查失败记录走「工具」→「动作运行与触发记录」。',
    settingPath: '标题栏「更多」→ 场景与动作 / 动作管理 / 面板窗口 / 工具',
    href: '/v2/features/action-panel/usage#管理多个场景和大量动作',
    hrefLabel: '管理场景与动作',
  },
  {
    id: 'windowSize',
    label: '尺寸',
    title: '窗口尺寸预设',
    body: '窗口支持拖动和缩放。「窗口尺寸」不在标题栏上单独成按钮，而在更多菜单的「面板窗口」里；双击标题栏也可恢复或切换尺寸。',
    settingPath: '标题栏「更多」→ 面板窗口 → 窗口尺寸（亦可双击标题栏）',
    href: '/v2/features/action-panel/usage#窗口尺寸',
    hrefLabel: '窗口尺寸',
  },
  {
    id: 'drafts',
    label: '暂存区',
    title: '左侧暂存区',
    body: '左侧导航里，「动作」和「暂存区」是两个图标按钮。点「暂存区」后，右侧内容换成暂存列表（不是再画一条带文字的侧栏）。顶部可「新建动作」或「用 AI 写」；确认后再保留到场景。暂存内容不参与云同步。',
    settingPath: '左侧导航「暂存区」图标（收件箱）',
    href: '/v2/features/action-panel/action-drafts',
    hrefLabel: '本机动作暂存区',
  },
  {
    id: 'sidebarButtons',
    label: '快捷按钮',
    title: '侧边栏快捷按钮',
    body: '导航栏底部默认只有「截图 Pro」。2.1.29 起可自定义，还可放入设置、场景与动作管理、公共子程序管理，或添加常用动作并调整顺序。',
    settingPath: '标题栏「更多」→ 面板窗口 → 快捷按钮设置…',
    href: '/v2/features/action-panel/usage#侧边栏快捷按钮',
    hrefLabel: '侧边栏说明',
  },
  {
    id: 'globalArea',
    label: '全局区',
    title: '全局区',
    body: '放置不依赖当前程序、希望随时使用的动作。可添加全局场景、通用场景或自定义场景标签。可用 Ctrl + 滚轮切换该区域场景标签。',
    settingPath: '视图选项 → 布局 → 「全局 + 上下文区」或只显示其一',
    href: '/v2/features/action-panel/usage#全局区',
    hrefLabel: '全局区',
  },
  {
    id: 'contextArea',
    label: '上下文区',
    title: '上下文区',
    body: '随当前前台程序或网址变化，优先显示匹配场景；「通用」标签始终保留在末尾。默认与全局区上下同显，中间可用分隔条调整高度。',
    settingPath: '视图选项 → 布局（全局 + 上下文 / 仅其一）',
    href: '/v2/features/action-panel/usage#上下文区',
    hrefLabel: '上下文区',
  },
  {
    id: 'lock',
    label: '锁定',
    title: '上下文锁定',
    body: '上下文区右上角是锁形图标（未锁定时为开锁）。单击停止上下文自动切换；再次点击恢复。右键还可选择要加载并锁定的应用场景。',
    settingPath: '上下文区右上角锁形按钮（单击 / 右键）',
    href: '/v2/features/action-panel/usage#上下文区',
    hrefLabel: '上下文区',
  },
  {
    id: 'sceneTabs',
    label: '场景标签',
    title: '场景标签',
    body: '单击切换场景；双击在「场景与动作管理」中打开该场景；右键可新建 / 导入动作、从旧动作页引入，以及打开场景管理。全局区标签可拖动排序并自动保存。',
    settingPath: '全局区 / 上下文区顶部场景标签条（单击 / 双击 / 右键）',
    href: '/v2/features/action-panel/usage#场景标签和分组',
    hrefLabel: '场景标签和分组',
  },
  {
    id: 'viewOptions',
    label: '视图选项',
    title: '视图选项',
    body: '上下文区右上角的滑块图标。默认「全局 + 上下文」时只出现在上下文区；仅显示全局区时改到全局区右上角。可切换布局、磁贴 / 列表、分组方式、底部最新动作和排序等。',
    settingPath: '上下文区右上角「视图选项」滑块图标',
    href: '/v2/features/action-panel/usage#视图选项',
    hrefLabel: '视图选项',
  },
  {
    id: 'createButton',
    label: '创建',
    title: '创建动作入口',
    body: '默认连续显示分组时，用分组里的「创建动作」磁贴；把指针移到分组标题旁也会出现 +。只有「每次单个分组（上）」时，加号才固定出现在标题行。是否显示创建磁贴可在视图选项中开关。',
    settingPath: '分组内创建动作磁贴；或视图选项 → 其它显示内容 → 创建动作磁贴',
    href: '/v2/features/action-panel/usage#新建粘贴和导入动作',
    hrefLabel: '新建与导入',
  },
  {
    id: 'groupNav',
    label: '分组导航',
    title: '分组导航',
    body: '连续显示分组时，导航是动作区左侧约 16 DIP 的圆点条（置顶分组略高），不是右侧文字列表。悬停圆点会弹出分组名。「每次单个分组（上）」时改到标题行；「每次单个分组（左）」时仍在左侧。',
    settingPath: '视图选项 → 分组显示（连续 / 单个左 / 单个上 / 不分组）',
    href: '/v2/features/action-panel/usage#视图选项',
    hrefLabel: '视图选项',
  },
  {
    id: 'recentActions',
    label: '最新动作',
    title: '底部最新动作',
    body: '窗口最底下一行只有图标、没有「最近」标题，用来再次运行刚用过的动作。是否显示由视图选项「底部最新动作」控制。',
    settingPath: '视图选项 → 布局 → 底部最新动作',
    href: '/v2/features/action-panel/usage#查找和运行动作',
    hrefLabel: '查找和运行',
  },
  {
    id: 'navBar',
    label: '导航栏',
    title: '左侧导航栏',
    body: '导航栏在窗口最左侧：上端是 Quicker 标志，中间是「动作」「暂存区」，底部是快捷按钮。标准宽度约 50 DIP，紧凑约 38 DIP。双击内容空白可显隐；双击导航栏空白可在标准与紧凑之间切换。',
    settingPath: '更多 → 面板窗口 → 左侧导航栏（标准 / 紧凑 / 关闭）；或双击空白处',
    href: '/v2/features/action-panel/usage#双击导航栏',
    hrefLabel: '双击导航栏',
  },
];

const DEFAULT_ID: HotspotId = 'viewOptions';

const TILES_GLOBAL = [
  {name: '剪贴板', color: '#2b7abf'},
  {name: '截图', color: '#39b54d'},
  {name: '置顶窗', color: '#ed6c02'},
  {name: '计算器', color: '#7b61ff', pinned: true},
] as const;

const TILES_CONTEXT = [
  {name: '复制路径', color: '#2b7abf'},
  {name: '新建文件夹', color: '#39b54d'},
  {name: '压缩', color: '#6aaded'},
  {name: '打开终端', color: '#303d48'},
] as const;

const RECENT = [
  {name: '剪贴板', color: '#2b7abf'},
  {name: '截图', color: '#39b54d'},
  {name: '复制路径', color: '#2b7abf'},
] as const;

const GROUPS = [
  {id: 'pin', pinned: true, active: false},
  {id: 'common', pinned: false, active: true},
  {id: 'file', pinned: false, active: false},
  {id: 'win', pinned: false, active: false},
] as const;

function hotspotById(id: HotspotId): Hotspot {
  return HOTSPOTS.find((item) => item.id === id) ?? HOTSPOTS[0]!;
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ');
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
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(hotspot.id);
      }
    },
    [hotspot.id, onSelect],
  );

  return (
    <button
      type="button"
      className={cx(styles.hotspot, selected && styles.hotspotSelected, className)}
      aria-pressed={selected}
      aria-label={hotspot.title}
      title={hotspot.title}
      onClick={() => onSelect(hotspot.id)}
      onKeyDown={onKeyDown}
    >
      {children !== undefined ? (
        children
      ) : (
        <span className={styles.hotspotLabel}>{hotspot.label}</span>
      )}
    </button>
  );
}

function QuickerLogo(): ReactNode {
  return (
    <svg
      className={styles.logo}
      viewBox="0 0 32 32"
      width="24"
      height="24"
      aria-hidden
    >
      <path
        className={styles.logoHighlight}
        d="M5.8,29.5 l8.4,-13 c0.2,-0.2 0.1,-0.6 -0.1,-0.7 l-8.2,-5.6 c-0.3,-0.2 -0.3,-0.6 0,-0.8 l10.8,-8.8 v0 l6,6.5 c0.2,0.3 0.2,0.7 -0.1,0.8 l-3.3,1.5 c-0.4,0.2 -0.4,0.7 -0.1,0.9 l7.8,5.3 c0.3,0.2 0.3,0.7 0,0.9 L6.5,30.2 C6,30.5 5.5,30 5.8,29.5 z"
      />
      <path
        className={styles.logoFill}
        d="M5.8,29.5 l8.4,-13 c0.2,-0.2 0.1,-0.6 -0.1,-0.7 l-8.2,-5.6 c-0.3,-0.2 -0.3,-0.6 0,-0.8 l10.8,-8.8 v0 l6,6.5 c0.2,0.3 0.2,0.7 -0.1,0.8 l-3.3,1.5 c-0.4,0.2 -0.4,0.7 -0.1,0.9 l7.8,5.3 c0.3,0.2 0.3,0.7 0,0.9 L6.5,30.2 C6,30.5 5.5,30 5.8,29.5 z"
      />
    </svg>
  );
}

type ChromeIconName =
  | 'cog'
  | 'search'
  | 'user'
  | 'pin'
  | 'close'
  | 'sliders'
  | 'unlock'
  | 'plus'
  | 'grid'
  | 'inbox';

const FA_CHROME: Partial<Record<ChromeIconName, string>> = {
  cog: 'fa:Light_Cog',
  search: 'fa:Light_Search',
  user: 'fa:Light_UserCircle',
  close: 'fa:Light_Times',
  plus: 'fa:Light_Plus',
};

function ChromeSvg({
  name,
  size,
}: {
  name: ChromeIconName;
  size: number;
}): ReactNode {
  const common = {
    className: styles.glyph,
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'none',
    'aria-hidden': true as const,
  };
  switch (name) {
    case 'grid':
      return (
        <svg {...common}>
          <rect x="1.75" y="1.75" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
          <rect x="5.95" y="1.75" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
          <rect x="10.15" y="1.75" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
          <rect x="1.75" y="5.95" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
          <rect x="5.95" y="5.95" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
          <rect x="10.15" y="5.95" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
          <rect x="1.75" y="10.15" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
          <rect x="5.95" y="10.15" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
          <rect x="10.15" y="10.15" width="4.1" height="4.1" rx="0.7" fill="currentColor" />
        </svg>
      );
    case 'inbox':
      return (
        <svg {...common}>
          <path
            d="M2.2 6.1 4 10.2h8L13.8 6.1H2.2Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M2.4 6.1V3.6h11.2v2.5M6.1 10.2v1.6h3.8V10.2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'sliders':
      return (
        <svg {...common}>
          <path
            d="M2 4h12M2 8h12M2 12h12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="11" cy="4" r="1.45" fill="currentColor" />
          <circle cx="5" cy="8" r="1.45" fill="currentColor" />
          <circle cx="9.2" cy="12" r="1.45" fill="currentColor" />
        </svg>
      );
    case 'unlock':
      return (
        <svg {...common}>
          <rect
            x="3.2"
            y="7.2"
            width="9.6"
            height="6.2"
            rx="1.3"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M5.4 7.2V4.9a2.6 2.6 0 0 1 5.2 0"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path
            d="M6.1 1.8h3.8l.7 3.4 1.8.9v1.3H3.6V6.1l1.8-.9.7-3.4Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path
            d="M8 7.4v6.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function IconGlyph({
  name,
  size = 16,
}: {
  name: ChromeIconName;
  size?: number;
}): ReactNode {
  const fa = FA_CHROME[name];
  if (fa) {
    return <DocsStepIcon spec={fa} size={size} fallback="" />;
  }
  return <ChromeSvg name={name} size={size} />;
}

function ActionTile({
  name,
  color,
  pinned,
  create,
}: {
  name: string;
  color?: string;
  pinned?: boolean;
  create?: boolean;
}): ReactNode {
  return (
    <span className={cx(styles.tile, create && styles.tileCreate)}>
      {pinned ? <span className={styles.tilePin} aria-hidden /> : null}
      <span
        className={styles.tileIcon}
        style={create ? undefined : {background: color}}
        aria-hidden
      >
        {create ? <IconGlyph name="plus" size={13} /> : name.slice(0, 1)}
      </span>
      <span className={styles.tileLabel}>{create ? '创建动作' : name}</span>
    </span>
  );
}

export type ActionPanelLayoutDemoProps = {
  caption?: ReactNode;
};

export default function ActionPanelLayoutDemo({
  caption,
}: ActionPanelLayoutDemoProps): ReactNode {
  const [selectedId, setSelectedId] = useState<HotspotId>(DEFAULT_ID);
  const selected = hotspotById(selectedId);
  const captionId = useId();
  const onSelect = useCallback((id: HotspotId) => {
    setSelectedId(id);
  }, []);

  const moreSelected = selectedId === 'moreMenu' || selectedId === 'windowSize';

  return (
    <div className={styles.root}>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
      <p className={styles.hint}>
        点击示意分区查看说明；也可用下方标签切换。完整步骤见
        <Link to="/v2/features/action-panel/usage">使用说明</Link>。
      </p>

      <div className={styles.layout}>
        <div
          className={cx(styles.stage, 'qk-docs-preview')}
          role="group"
          aria-label="新面板布局示意"
          aria-describedby={captionId}
        >
          <div className={styles.panel}>
            <aside
              className={cx(styles.nav, selectedId === 'navBar' && styles.navSelected)}
            >
              <HotspotButton
                hotspot={hotspotById('navBar')}
                selected={selectedId === 'navBar'}
                onSelect={onSelect}
                className={styles.logoWrap}
              >
                <QuickerLogo />
              </HotspotButton>
              <div className={styles.navMid}>
                <HotspotButton
                  hotspot={hotspotById('navBar')}
                  selected={selectedId === 'navBar'}
                  onSelect={onSelect}
                  className={cx(styles.navBtn, styles.navBtnActive)}
                >
                  <span className={styles.navMarker} aria-hidden />
                  <IconGlyph name="grid" size={20} />
                </HotspotButton>
                <HotspotButton
                  hotspot={hotspotById('drafts')}
                  selected={selectedId === 'drafts'}
                  onSelect={onSelect}
                  className={styles.navBtn}
                >
                  <IconGlyph name="inbox" size={20} />
                </HotspotButton>
              </div>
              <HotspotButton
                hotspot={hotspotById('navBar')}
                selected={selectedId === 'navBar'}
                onSelect={onSelect}
                className={styles.navGrow}
              >
                {null}
              </HotspotButton>
              <HotspotButton
                hotspot={hotspotById('sidebarButtons')}
                selected={selectedId === 'sidebarButtons'}
                onSelect={onSelect}
                className={styles.navBtn}
              >
                <DocsStepIcon spec="fa:Light_ExpandWide" size={16} fallback="截" />
              </HotspotButton>
            </aside>

            <div className={styles.content}>
              <div className={styles.titleBar}>
                <span className={styles.titleBrand}>Quicker</span>
                <HotspotButton
                  hotspot={hotspotById('enable')}
                  selected={selectedId === 'enable'}
                  onSelect={onSelect}
                  className={styles.iconBtn}
                >
                  <IconGlyph name="cog" size={16} />
                </HotspotButton>
                <HotspotButton
                  hotspot={hotspotById('moreMenu')}
                  selected={moreSelected}
                  onSelect={onSelect}
                  className={styles.iconBtn}
                >
                  <span className={styles.moreDots} aria-hidden>
                    ···
                  </span>
                </HotspotButton>
                <span className={styles.titleSpacer} />
                <HotspotButton
                  hotspot={hotspotById('titleSearch')}
                  selected={selectedId === 'titleSearch'}
                  onSelect={onSelect}
                  className={styles.iconBtn}
                >
                  <IconGlyph name="search" size={15} />
                </HotspotButton>
                <span className={styles.iconGhost} title="账号" aria-hidden>
                  <IconGlyph name="user" size={16} />
                </span>
                <span className={styles.iconGhost} title="钉住" aria-hidden>
                  <IconGlyph name="pin" size={16} />
                </span>
                <span className={styles.iconGhost} title="关闭" aria-hidden>
                  <IconGlyph name="close" size={16} />
                </span>
              </div>

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <HotspotButton
                    hotspot={hotspotById('sceneTabs')}
                    selected={selectedId === 'sceneTabs'}
                    onSelect={onSelect}
                    className={styles.tabs}
                  >
                    <span className={styles.tabActive}>全局</span>
                    <span className={styles.tab}>常用</span>
                    <span className={styles.tab}>工具</span>
                  </HotspotButton>
                </div>
                <HotspotButton
                  hotspot={hotspotById('globalArea')}
                  selected={selectedId === 'globalArea'}
                  onSelect={onSelect}
                  className={styles.tilesHotspot}
                >
                  <div className={styles.groupHead}>
                    <span className={styles.groupBar} aria-hidden />
                    <span>常用</span>
                  </div>
                  <div className={styles.tileGrid}>
                    {TILES_GLOBAL.map((tile) => (
                      <ActionTile key={tile.name} {...tile} />
                    ))}
                  </div>
                </HotspotButton>
              </section>

              <div className={styles.splitter} aria-hidden />

              <section className={cx(styles.section, styles.sectionContext)}>
                <div className={styles.sectionHeader}>
                  <HotspotButton
                    hotspot={hotspotById('sceneTabs')}
                    selected={selectedId === 'sceneTabs'}
                    onSelect={onSelect}
                    className={styles.tabs}
                  >
                    <span className={styles.tabActive}>资源管理器</span>
                    <span className={styles.tab}>通用</span>
                  </HotspotButton>
                  <span className={styles.headerTools}>
                    <HotspotButton
                      hotspot={hotspotById('viewOptions')}
                      selected={selectedId === 'viewOptions'}
                      onSelect={onSelect}
                      className={styles.iconBtn}
                    >
                      <IconGlyph name="sliders" size={16} />
                    </HotspotButton>
                    <HotspotButton
                      hotspot={hotspotById('lock')}
                      selected={selectedId === 'lock'}
                      onSelect={onSelect}
                      className={styles.iconBtn}
                    >
                      <IconGlyph name="unlock" size={16} />
                    </HotspotButton>
                  </span>
                </div>
                <div className={styles.contextBody}>
                  <HotspotButton
                    hotspot={hotspotById('groupNav')}
                    selected={selectedId === 'groupNav'}
                    onSelect={onSelect}
                    className={styles.groupNav}
                  >
                    {GROUPS.map((group) => (
                      <span
                        key={group.id}
                        className={cx(
                          styles.groupDot,
                          group.pinned && styles.groupDotPinned,
                          group.active && styles.groupDotActive,
                        )}
                      />
                    ))}
                    <span className={styles.groupAdd} aria-hidden>
                      +
                    </span>
                  </HotspotButton>
                  <div className={styles.tilesHotspot}>
                    <div className={styles.groupHead}>
                      <span className={styles.groupBar} aria-hidden />
                      <span>文件</span>
                    </div>
                    <div className={styles.tileGrid}>
                      <HotspotButton
                        hotspot={hotspotById('contextArea')}
                        selected={selectedId === 'contextArea'}
                        onSelect={onSelect}
                        className={styles.tilesCluster}
                      >
                        {TILES_CONTEXT.map((tile) => (
                          <ActionTile key={tile.name} {...tile} />
                        ))}
                      </HotspotButton>
                      <HotspotButton
                        hotspot={hotspotById('createButton')}
                        selected={selectedId === 'createButton'}
                        onSelect={onSelect}
                        className={styles.createWrap}
                      >
                        <ActionTile name="创建动作" create />
                      </HotspotButton>
                    </div>
                  </div>
                </div>
              </section>

              <HotspotButton
                hotspot={hotspotById('recentActions')}
                selected={selectedId === 'recentActions'}
                onSelect={onSelect}
                className={styles.recent}
              >
                {RECENT.map((item) => (
                  <span
                    key={item.name}
                    className={styles.recentIcon}
                    style={{background: item.color}}
                    title={item.name}
                  >
                    {item.name.slice(0, 1)}
                  </span>
                ))}
              </HotspotButton>
            </div>
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

      <div className={styles.chipRow} role="listbox" aria-label="面板分区">
        {HOTSPOTS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={selectedId === item.id}
            className={cx(styles.chip, selectedId === item.id && styles.chipSelected)}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

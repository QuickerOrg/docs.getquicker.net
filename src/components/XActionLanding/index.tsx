import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type XActionLandingCounts = Record<string, number>;

export type XActionLandingProps = {
  moduleCount: number;
  generatedAt?: string;
  counts: XActionLandingCounts;
};

type PathItem = {
  href: string;
  kicker: string;
  title: string;
  description: string;
};

type CategoryItem = {
  key: string;
  href: string;
  title: string;
  description: string;
};

type FeaturedItem = {
  href: string;
  title: string;
};

const PATHS: PathItem[] = [
  {
    href: '/v2/xaction/guides/how-to-learn',
    kicker: '动手',
    title: '组合动作入门',
    description: '三条动手课：弹出提示、处理选中文字、按条件打开搜索。',
  },
  {
    href: '/v2/xaction/concepts/xaction-intro',
    kicker: '概念',
    title: '组合动作基础',
    description: '步骤怎样按顺序执行，以及一个完整动作是怎么构成的。',
  },
  {
    href: '/v2/xaction/modules',
    kicker: '查阅',
    title: '模块参考',
    description: '按分类查看步骤的参数、输出和用法。知道名称时可用右上角搜索。',
  },
  {
    href: '/v2/xaction/guides',
    kicker: '实践',
    title: '教程与实践',
    description: '文本、网页、窗口和浏览器等专题练习。',
  },
];

const CATEGORIES: CategoryItem[] = [
  {
    key: 'Basic',
    href: '/v2/xaction/modules/category/basic',
    title: '基础',
    description: '运行程序、输入输出、通知、打开网址',
  },
  {
    key: 'Text',
    href: '/v2/xaction/modules/category/text',
    title: '文本处理',
    description: '格式化、替换、正则、JSON、编码',
  },
  {
    key: 'Image',
    href: '/v2/xaction/modules/category/image',
    title: '图片处理',
    description: '截图、录屏、图像处理、二维码',
  },
  {
    key: 'Clipboard',
    href: '/v2/xaction/modules/category/clipboard',
    title: '剪贴板操作',
    description: '读写文本、图片和文件',
  },
  {
    key: 'Flow',
    href: '/v2/xaction/modules/category/flow',
    title: '程序流程',
    description: '条件、循环、脚本、子程序',
  },
  {
    key: 'System',
    href: '/v2/xaction/modules/category/system',
    title: 'Windows 系统',
    description: '窗口、进程、资源管理器、音量',
  },
  {
    key: 'Files',
    href: '/v2/xaction/modules/category/files',
    title: '文件与系统操作',
    description: '读写文件、路径、压缩、搜索',
  },
  {
    key: 'Compute',
    href: '/v2/xaction/modules/category/compute',
    title: '计算与比较',
    description: '赋值、数值、列表、字典、表格',
  },
  {
    key: 'Network',
    href: '/v2/xaction/modules/category/network',
    title: '网络服务',
    description: 'HTTP、下载、云存储、OCR、AI',
  },
  {
    key: 'Ui',
    href: '/v2/xaction/modules/category/ui',
    title: '界面组件',
    description: '菜单、表单、选文件、自定义窗口',
  },
  {
    key: 'SoftInteraction',
    href: '/v2/xaction/modules/category/software',
    title: '第三方软件交互',
    description: 'Chrome、Excel、Office、UI 自动化',
  },
  {
    key: 'Input',
    href: '/v2/xaction/modules/category/input',
    title: '键鼠输入',
    description: '按键与鼠标输入脚本',
  },
];

const FEATURED: FeaturedItem[] = [
  {href: '/v2/xaction/modules/openurl', title: '打开网址'},
  {href: '/v2/xaction/modules/notify', title: '提示消息'},
  {href: '/v2/xaction/modules/get_selected_text', title: '获取选中的文本'},
  {href: '/v2/xaction/modules/if', title: '如果/否则'},
  {href: '/v2/xaction/modules/stringprocess', title: '文本处理'},
  {href: '/v2/xaction/modules/screen-capture-pro', title: '截图 Pro'},
];

function PathCard({item}: {item: PathItem}): ReactNode {
  return (
    <Link className={`${styles.card} ${styles.pathCard}`} href={item.href}>
      <span className={styles.kicker}>{item.kicker}</span>
      <span className={styles.title}>{item.title}</span>
      <span className={styles.description}>{item.description}</span>
    </Link>
  );
}

function CategoryCard({
  item,
  count,
}: {
  item: CategoryItem;
  count: number | undefined;
}): ReactNode {
  return (
    <Link className={styles.card} href={item.href}>
      <span className={styles.titleRow}>
        <span className={styles.title}>{item.title}</span>
        {typeof count === 'number' ? <span className={styles.count}>{count}</span> : null}
      </span>
      <span className={styles.description}>{item.description}</span>
    </Link>
  );
}

/** Hub for /v2/xaction: start paths, featured modules, and category tiles. */
export default function XActionLanding({
  moduleCount,
  generatedAt,
  counts,
}: XActionLandingProps): ReactNode {
  return (
    <div className={styles.root}>
      <div className={styles.sectionHead}>
        <h2>从哪里开始</h2>
      </div>
      <div className={styles.paths}>
        {PATHS.map((item) => (
          <PathCard key={item.href} item={item} />
        ))}
      </div>
      <Link className={styles.migrate} href="/v2/what's-new/actions/xaction-steps">
        <span className={styles.migrateLabel}>从 1.x 升级</span>
        <span className={styles.migrateTitle}>2.0 模块兼容与变化</span>
      </Link>

      <div className={styles.sectionHead}>
        <h2>按分类查找</h2>
        <Link className={styles.sectionLink} href="/v2/xaction/modules">
          全部 {moduleCount} 个模块
        </Link>
      </div>
      <p className={styles.sectionLead}>已经知道模块名称时，用右上角搜索通常更快。</p>
      <div className={styles.categories}>
        {CATEGORIES.map((item) => (
          <CategoryCard key={item.key} item={item} count={counts[item.key]} />
        ))}
      </div>

      <div className={styles.sectionHead}>
        <h2>常用步骤</h2>
      </div>
      <div className={styles.featured}>
        {FEATURED.map((item) => (
          <Link key={item.href} className={styles.chip} href={item.href}>
            {item.title}
          </Link>
        ))}
      </div>

      <p className={styles.note}>
        各模块页上方的参数表来自 Quicker 当前导出的定义
        {generatedAt ? `（${generatedAt}）` : ''}
        ；使用说明、示例和排障多数从 1.x 文档迁入，尚未复核的页面会标为待复核。
      </p>
    </div>
  );
}

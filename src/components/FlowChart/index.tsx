/**
 * Docs flowchart: card + arrow schematic (not Mermaid).
 * Teaching diagrams only — not a Quicker chrome slice.
 */
import {Fragment, type ReactNode} from 'react';
import styles from './styles.module.css';

export type FlowBranch = {
  label: string;
  steps: string[];
};

export type FlowChartProps =
  | {
      layout: 'row';
      steps: string[];
      caption?: ReactNode;
    }
  | {
      layout: 'branch';
      start?: string;
      end?: string;
      before?: string[];
      decision: string;
      yes: string[];
      no: string[];
      yesLabel?: string;
      noLabel?: string;
      caption?: ReactNode;
    }
  | {
      layout: 'funnel';
      start: string;
      decision: string;
      branches: FlowBranch[];
      merge: string;
      after?: string[];
      caption?: ReactNode;
    };

function ArrowDown(): ReactNode {
  return (
    <span className={styles.arrowDown} aria-hidden>
      <svg viewBox="0 0 12 20" width="12" height="20">
        <path
          d="M6 1v14M1.5 11.5 6 16.5 10.5 11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ArrowRight(): ReactNode {
  return (
    <span className={styles.arrowRight} aria-hidden>
      <svg viewBox="0 0 20 12" width="20" height="12">
        <path
          d="M1 6h14M11.5 1.5 16.5 6 11.5 10.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Node({
  children,
  kind = 'step',
}: {
  children: ReactNode;
  kind?: 'step' | 'terminal' | 'decision' | 'merge';
}): ReactNode {
  return <div className={[styles.node, styles[kind]].join(' ')}>{children}</div>;
}

function Stack({items, kind = 'step'}: {items: string[]; kind?: 'step'}): ReactNode {
  if (items.length === 0) return null;
  return (
    <div className={styles.stack}>
      {items.map((label, index) => (
        <Fragment key={`${label}-${index}`}>
          {index > 0 ? <ArrowDown /> : null}
          <Node kind={kind}>{label}</Node>
        </Fragment>
      ))}
    </div>
  );
}

function RowChart({steps}: {steps: string[]}): ReactNode {
  return (
    <div className={styles.row}>
      {steps.map((label, index) => (
        <Fragment key={`${label}-${index}`}>
          {index > 0 ? (
            <>
              <span className={styles.rowArrowDesktop}>
                <ArrowRight />
              </span>
              <span className={styles.rowArrowMobile}>
                <ArrowDown />
              </span>
            </>
          ) : null}
          <Node>{label}</Node>
        </Fragment>
      ))}
    </div>
  );
}

function BranchChart({
  start,
  end,
  before = [],
  decision,
  yes,
  no,
  yesLabel = '是',
  noLabel = '否',
}: Extract<FlowChartProps, {layout: 'branch'}>): ReactNode {
  return (
    <div className={styles.branch}>
      {start ? (
        <>
          <Node kind="terminal">{start}</Node>
          <ArrowDown />
        </>
      ) : null}
      <Stack items={before} />
      {before.length > 0 ? <ArrowDown /> : null}
      <Node kind="decision">{decision}</Node>
      <div className={styles.split}>
        <div className={styles.splitCol}>
          <span className={[styles.badge, styles.badgeYes].join(' ')}>{yesLabel}</span>
          <ArrowDown />
          <Stack items={yes} />
        </div>
        <div className={styles.splitCol}>
          <span className={[styles.badge, styles.badgeNo].join(' ')}>{noLabel}</span>
          <ArrowDown />
          <Stack items={no} />
        </div>
      </div>
      {end ? (
        <>
          <div className={styles.join} aria-hidden />
          <ArrowDown />
          <Node kind="terminal">{end}</Node>
        </>
      ) : null}
    </div>
  );
}

function FunnelChart({
  start,
  decision,
  branches,
  merge,
  after = [],
}: Extract<FlowChartProps, {layout: 'funnel'}>): ReactNode {
  return (
    <div className={styles.funnel}>
      <Node>{start}</Node>
      <ArrowDown />
      <Node kind="decision">{decision}</Node>
      <div
        className={styles.funnelSplit}
        style={{gridTemplateColumns: `repeat(${Math.min(branches.length, 3)}, minmax(0, 1fr))`}}>
        {branches.map((branch) => (
          <div key={branch.label} className={styles.splitCol}>
            <span className={[styles.badge, styles.badgePath].join(' ')}>{branch.label}</span>
            <ArrowDown />
            <Stack items={branch.steps} />
          </div>
        ))}
      </div>
      <div className={styles.join} aria-hidden />
      <ArrowDown />
      <Node kind="merge">{merge}</Node>
      {after.length > 0 ? (
        <>
          <ArrowDown />
          <Stack items={after} />
        </>
      ) : null}
    </div>
  );
}

export default function FlowChart(props: FlowChartProps): ReactNode {
  const caption = props.caption;
  return (
    <div className={[styles.root, 'qk-docs-preview'].join(' ')}>
      <div className={styles.canvas}>
        {props.layout === 'row' ? <RowChart steps={props.steps} /> : null}
        {props.layout === 'branch' ? <BranchChart {...props} /> : null}
        {props.layout === 'funnel' ? <FunnelChart {...props} /> : null}
      </div>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </div>
  );
}

/**
 * Docs sketch of an Android system notification sent by sys:mobileNotification.
 *
 * Runtime source (not Headless / WPF):
 * - QuickerAndroid/.../RemoteNotificationService.kt `buildRemoteNotification`
 * - RemoteNotificationPolicy.NOTIFICATION_TAP_ACTION_ID = `__notification_tap`
 * - Quicker.Remote RemoteMobileNotificationService statuses
 * - AndroidManifest application label: Quicker Remote
 * - Channel name: 电脑发来的通知
 * - Small icon: ic_quicker_remote_notification.xml (lightning)
 * - Theme accent: styles.xml android:colorAccent #FF845E
 *
 * This is system Notification.Builder UI, not Quicker chrome. Do not restyle
 * from screenshots or Infima.
 */
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {useAutoPlayDemo} from '@site/src/components/docs-demo/useAutoPlayDemo';
import styles from './styles.module.css';

/** Matches RemoteNotificationPolicy.NOTIFICATION_TAP_ACTION_ID. */
export const NOTIFICATION_TAP_ACTION_ID = '__notification_tap';

/** Demo id shaped like Guid.NewGuid().ToString("N"). */
const DEMO_NOTIFICATION_ID = 'c0ffee12ab34cd56ef7890ab12cd34ef';

const MAX_ACTIONS = 3;
const MAX_REPLY_LENGTH = 1024;

export type MobileNotificationPreviewProps = {
  title?: string;
  body?: string;
  /** Application label in the notification header. */
  appName?: string;
  timeLabel?: string;
  action1Id?: string;
  action1Title?: string;
  action1Reply?: boolean | string;
  action2Id?: string;
  action2Title?: string;
  action2Reply?: boolean | string;
  action3Id?: string;
  action3Title?: string;
  action3Reply?: boolean | string;
  /** Loop a tap on the first non-reply button. Default true. */
  autoPlay?: boolean;
  className?: string;
};

type BuiltAction = {
  id: string;
  title: string;
  allowsTextReply: boolean;
};

type StepOutputs = {
  notificationId: string;
  status: string;
  selectedActionId: string;
  replyText: string;
};

function asBool(value: boolean | string | undefined, fallback = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const raw = value.trim().toLowerCase();
    return raw === 'true' || raw === '1';
  }
  return fallback;
}

function addAction(
  list: BuiltAction[],
  id: string | undefined,
  title: string | undefined,
  reply: boolean | string | undefined,
): void {
  if (list.length >= MAX_ACTIONS) {
    return;
  }
  const trimmedTitle = title?.trim() ?? '';
  if (!trimmedTitle) {
    return;
  }
  list.push({
    id: (id ?? '').trim(),
    title: trimmedTitle,
    allowsTextReply: asBool(reply),
  });
}

function LightningIcon(): ReactNode {
  return (
    <svg
      className={styles.iconGlyph}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false">
      <path d="M13 2L4 14h7l-1 8 10-13h-7z" />
    </svg>
  );
}

function emptyWaitingOutputs(): StepOutputs {
  return {
    notificationId: DEMO_NOTIFICATION_ID,
    status: 'delivered',
    selectedActionId: '',
    replyText: '',
  };
}

/**
 * Interactive Android notification shade card for the mobile-notification
 * what's-new page. Clicking actions / the card body fills the step outputs.
 */
export default function MobileNotificationPreview({
  title = '要开始录屏吗？',
  body = '电脑端动作正在等待这台已授权手机确认。',
  appName = 'Quicker Remote',
  timeLabel = '现在',
  action1Id = 'confirm',
  action1Title = '确认',
  action1Reply = false,
  action2Id = 'cancel',
  action2Title = '取消',
  action2Reply = false,
  action3Id = 'reply',
  action3Title = '回复',
  action3Reply = true,
  autoPlay = true,
  className,
}: MobileNotificationPreviewProps): ReactNode {
  const stageRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const replyFieldId = useId();
  const {
    setIsPointerInside,
    clearAutoTimers,
    scheduleAuto,
    shouldAutoPlay,
  } = useAutoPlayDemo(stageRef);
  const [cycle, setCycle] = useState(0);
  const [outputs, setOutputs] = useState<StepOutputs>(emptyWaitingOutputs);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [replyActionId, setReplyActionId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');

  const actions = useMemo(() => {
    const list: BuiltAction[] = [];
    addAction(list, action1Id, action1Title, action1Reply);
    addAction(list, action2Id, action2Title, action2Reply);
    addAction(list, action3Id, action3Title, action3Reply);
    return list;
  }, [
    action1Id,
    action1Title,
    action1Reply,
    action2Id,
    action2Title,
    action2Reply,
    action3Id,
    action3Title,
    action3Reply,
  ]);

  const autoTarget = useMemo(
    () => actions.find((action) => !action.allowsTextReply) ?? null,
    [actions],
  );

  const resetWaiting = useCallback(() => {
    setOutputs(emptyWaitingOutputs());
    setHighlightId(null);
    setReplyActionId(null);
    setReplyDraft('');
  }, []);

  const applyResponse = useCallback((actionId: string, replyText?: string) => {
    const trimmed = replyText?.trim() ?? '';
    setHighlightId(actionId);
    setReplyActionId(null);
    setReplyDraft('');
    setOutputs({
      notificationId: DEMO_NOTIFICATION_ID,
      status: trimmed ? 'replied' : 'clicked',
      selectedActionId: actionId,
      replyText: trimmed,
    });
  }, []);

  useEffect(() => {
    if (!autoPlay || !shouldAutoPlay || !autoTarget) {
      clearAutoTimers();
      return undefined;
    }
    resetWaiting();
    scheduleAuto(() => setHighlightId(autoTarget.id), 900);
    scheduleAuto(() => applyResponse(autoTarget.id), 1700);
    scheduleAuto(() => setCycle((n) => n + 1), 4200);
    return () => clearAutoTimers();
  }, [
    autoPlay,
    shouldAutoPlay,
    autoTarget,
    cycle,
    applyResponse,
    resetWaiting,
    clearAutoTimers,
    scheduleAuto,
  ]);

  useEffect(() => {
    if (!replyActionId) {
      return;
    }
    replyInputRef.current?.focus();
  }, [replyActionId]);

  const submitReply = useCallback(
    (actionId: string) => {
      const trimmed = replyDraft.trim();
      if (!trimmed) {
        return;
      }
      applyResponse(actionId, trimmed.slice(0, MAX_REPLY_LENGTH));
    },
    [applyResponse, replyDraft],
  );

  const onActionClick = useCallback(
    (action: BuiltAction) => {
      clearAutoTimers();
      setIsPointerInside(true);
      if (action.allowsTextReply) {
        setHighlightId(action.id);
        setReplyActionId(action.id);
        setReplyDraft('');
        setOutputs(emptyWaitingOutputs());
        return;
      }
      applyResponse(action.id);
    },
    [applyResponse, clearAutoTimers, setIsPointerInside],
  );

  const onCardBodyClick = useCallback(() => {
    clearAutoTimers();
    setIsPointerInside(true);
    applyResponse(NOTIFICATION_TAP_ACTION_ID);
  }, [applyResponse, clearAutoTimers, setIsPointerInside]);

  const onReplySubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (replyActionId) {
        submitReply(replyActionId);
      }
    },
    [replyActionId, submitReply],
  );

  const replyAction = actions.find((action) => action.id === replyActionId);
  const terminal = outputs.status === 'clicked' || outputs.status === 'replied';

  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
      <p className={styles.caption}>
        Android 系统通知示意（渠道「电脑发来的通知」）。点按钮、点通知主体，或用「回复」输入文字，下方会填入动作输出。
      </p>
      <div
        ref={stageRef}
        className={styles.shade}
        onPointerEnter={() => setIsPointerInside(true)}
        onPointerLeave={() => setIsPointerInside(false)}>
        <div className={styles.shadeLabel}>通知栏</div>
        <article
          className={[styles.card, terminal ? styles.cardResponded : '']
            .filter(Boolean)
            .join(' ')}
          aria-label="电脑发来的通知">
          <button
            type="button"
            className={styles.cardHit}
            onClick={onCardBodyClick}
            aria-label="点击通知主体">
            <div className={styles.appRow}>
              <span className={styles.appIcon} aria-hidden="true">
                <LightningIcon />
              </span>
              <span className={styles.appName}>{appName}</span>
              <span className={styles.dot} aria-hidden="true">
                ·
              </span>
              <span className={styles.time}>{timeLabel}</span>
            </div>
            <h3 className={styles.title}>{title}</h3>
            {body.trim() ? <p className={styles.body}>{body}</p> : null}
          </button>
          {actions.length > 0 ? (
            <div className={styles.actions} role="group" aria-label="通知按钮">
              {actions.map((action) => (
                <button
                  key={`${action.id}:${action.title}`}
                  type="button"
                  className={[
                    styles.action,
                    highlightId === action.id ? styles.actionActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onActionClick(action)}>
                  {action.title}
                </button>
              ))}
            </div>
          ) : null}
          {replyAction ? (
            <form className={styles.replyRow} onSubmit={onReplySubmit}>
              <label className={styles.srOnly} htmlFor={replyFieldId}>
                {replyAction.title}
              </label>
              <input
                ref={replyInputRef}
                id={replyFieldId}
                className={styles.replyInput}
                type="text"
                maxLength={MAX_REPLY_LENGTH}
                placeholder={replyAction.title}
                value={replyDraft}
                onChange={(event) => setReplyDraft(event.target.value)}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === 'Escape') {
                    setReplyActionId(null);
                    setReplyDraft('');
                    setHighlightId(null);
                  }
                }}
              />
              <button className={styles.replySend} type="submit" disabled={!replyDraft.trim()}>
                发送
              </button>
            </form>
          ) : null}
        </article>
      </div>
      <table className={styles.outputs}>
        <caption>动作输出</caption>
        <tbody>
          <tr>
            <th scope="row">通知 ID</th>
            <td>
              <code title={outputs.notificationId}>
                {`${outputs.notificationId.slice(0, 8)}…${outputs.notificationId.slice(-8)}`}
              </code>
            </td>
          </tr>
          <tr>
            <th scope="row">状态</th>
            <td>
              <code>{outputs.status}</code>
            </td>
          </tr>
          <tr>
            <th scope="row">点击按钮 ID</th>
            <td>
              {outputs.selectedActionId ? (
                <code>{outputs.selectedActionId}</code>
              ) : (
                <span className={styles.empty}>（空）</span>
              )}
            </td>
          </tr>
          <tr>
            <th scope="row">回复文本</th>
            <td>
              {outputs.replyText ? (
                outputs.replyText
              ) : (
                <span className={styles.empty}>（空）</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

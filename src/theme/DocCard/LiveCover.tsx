import type {ReactNode} from 'react';
import ChoiceListPreview from '@site/src/components/ChoiceListPreview';
import MsgBoxPreview from '@site/src/components/MsgBoxPreview';
import NotifyToastPreview from '@site/src/components/NotifyToastPreview';
import UserInputPreview from '@site/src/components/UserInputPreview';
import WaitWinPreview from '@site/src/components/WaitWinPreview';
import type {DocGalleryLiveCover} from '@site/src/data/docGallery';

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function asBool(value: unknown): boolean {
  return value === true;
}

function LiveWidget({cover}: {cover: DocGalleryLiveCover}): ReactNode {
  const {name, props} = cover;
  switch (name) {
    case 'MsgBoxPreview':
      return (
        <MsgBoxPreview
          className="theme-doc-card__live-widget"
          title={asString(props.title, 'Quicker')}
          icon={asString(props.icon, 'question')}
          message={asString(props.message, '提示消息')}
          buttons={asStringList(props.buttons)}
          buttonDefs={asString(props.buttonDefs) || undefined}
        />
      );
    case 'NotifyToastPreview':
      return (
        <NotifyToastPreview
          className="theme-doc-card__live-widget"
          message={asString(props.message, '提示消息')}
          variant={
            asString(props.variant, 'info') as 'info' | 'success' | 'warning' | 'error'
          }
          styleVariant={asString(props.styleVariant, 'default') as 'default' | 'card'}
        />
      );
    case 'UserInputPreview':
      return (
        <UserInputPreview
          className="theme-doc-card__live-widget"
          title={asString(props.title, 'Quicker')}
          prompt={asString(props.prompt)}
          value={asString(props.value)}
          texttools={asString(props.texttools) || undefined}
          activeTool={asString(props.activeTool) || undefined}
          showHelp={asBool(props.showHelp)}
          showToolTooltip={false}
        />
      );
    case 'ChoiceListPreview':
      return (
        <ChoiceListPreview
          className="theme-doc-card__live-widget"
          title={asString(props.title, '请选择')}
          options={asStringList(props.options).slice(0, 5)}
          selectedIndex={typeof props.selectedIndex === 'number' ? props.selectedIndex : 0}
        />
      );
    case 'WaitWinPreview':
      return (
        <WaitWinPreview
          className="theme-doc-card__live-widget"
          title={asString(props.title, '完成后继续')}
          message={asString(props.message, '请稍候')}
          progress={asString(props.progress) || undefined}
          buttons={asStringList(props.buttons)}
        />
      );
    default:
      return null;
  }
}

export default function LiveCover({
  cover,
}: {
  cover: DocGalleryLiveCover;
}): ReactNode {
  const widget = <LiveWidget cover={cover} />;
  if (!widget) return null;
  return (
    <div
      className="theme-doc-card__cover theme-doc-card__cover--live"
      data-live-cover={cover.name}
      aria-hidden
    >
      <div className="theme-doc-card__live-stage">
        {widget}
      </div>
    </div>
  );
}

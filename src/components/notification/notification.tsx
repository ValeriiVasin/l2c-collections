import classNames from 'classnames/bind';
import type { PropsWithChildren } from 'react';
import styles from './notification.module.scss';
const cx = classNames.bind(styles);

export function Notification({ children }: PropsWithChildren<{}>) {
  return (
    <div data-testid="notification" className={cx('notification', 'warning')}>
      {children}
    </div>
  );
}

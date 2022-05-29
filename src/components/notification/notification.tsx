import classNames from 'classnames/bind';
import type { ReactNode } from 'react';
import styles from './notification.module.scss';
const cx = classNames.bind(styles);

export function Notification({ children }: { children?: ReactNode }) {
  return (
    <div data-testid="notification" className={cx('notification', 'warning')}>
      {children}
    </div>
  );
}

import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { searchParamsConfig } from '../../constants/search-params-config';
import { useAppSearchParams } from '../../hooks/use-app-search-params';
import styles from './navigation.module.scss';

const cx = classNames.bind(styles);

export function Navigation() {
  const {
    searchParams: { tab },
    url,
  } = useAppSearchParams(searchParamsConfig);

  return (
    <ul className={cx('nav')} data-testid="navigation">
      <li>
        <Link
          data-testid="nav-all"
          className={cx('nav-link', { 'is-selected': tab === 'all' })}
          to={url('/', { tab: 'all' })}
        >
          Все
        </Link>
      </li>
      <li>
        <Link
          data-testid="nav-attack"
          className={cx('nav-link', { 'is-selected': tab === 'attack' })}
          to={url('/', { tab: 'attack' })}
        >
          Атака
        </Link>
      </li>
      <li>
        <Link
          data-testid="nav-defense"
          className={cx('nav-link', { 'is-selected': tab === 'defense' })}
          to={url('/', { tab: 'defense' })}
        >
          Защита
        </Link>
      </li>
      <li>
        <Link
          data-testid="nav-support"
          className={cx('nav-link', { 'is-selected': tab === 'support' })}
          to={url('/', { tab: 'support' })}
        >
          Помощь в бою
        </Link>
      </li>
      <li>
        <Link
          data-testid="nav-special"
          className={cx('nav-link', { 'is-selected': tab === 'special' })}
          to={url('/', { tab: 'special' })}
        >
          Особый
        </Link>
      </li>
      <li>
        <Link
          data-testid="nav-stats"
          className={cx('nav-link', { 'is-selected': tab === 'stats' })}
          to={url('/', { tab: 'stats' })}
        >
          Характеристики
        </Link>
      </li>
      <li>
        <Link
          data-testid="nav-utility"
          className={cx('nav-link', { 'is-selected': tab === 'utility' })}
          to={url('/', { tab: 'utility' })}
        >
          Удобство
        </Link>
      </li>
      <li>
        <Link
          data-testid="nav-event"
          className={cx('nav-link', { 'is-selected': tab === 'event' })}
          to={url('/', { tab: 'event' })}
        >
          Ивент
        </Link>
      </li>
    </ul>
  );
}

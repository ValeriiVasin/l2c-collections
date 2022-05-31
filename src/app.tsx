import classNames from 'classnames/bind';
import { useCallback, useEffect, useRef } from 'react';
import styles from './app.module.scss';
import { CollectionsTable } from './components/collections-table/collections-table';
import { FilterInput } from './components/filter-input/filter-input';
import { Navigation } from './components/navigation/navigation';
import { Notification } from './components/notification/notification';
import { searchParamsConfig } from './constants/search-params-config';
import { useAppSearchParams } from './hooks/use-app-search-params';
import { useCollections } from './hooks/use-collections';

const cx = classNames.bind(styles);

function App() {
  const {
    searchParams: { tab, query },
    setSearchParams,
  } = useAppSearchParams(searchParamsConfig);

  const collections = useCollections({ tab, query });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);

  useEffect(() => {
    document.title = query ? `${query} - L2 Classic Collections` : 'L2 Classic Collections';
  }, [query]);

  const inputRef = useRef<HTMLInputElement>(null);

  const inputFocusHandler = useCallback((event: KeyboardEvent) => {
    const isInputFocused = document.activeElement === inputRef.current;

    if (isInputFocused && event.code === 'Escape') {
      inputRef.current?.blur();
      return;
    }

    if (!isInputFocused && event.code === 'Slash') {
      // prevent "/" from being typed inside of input
      event.preventDefault();
      inputRef.current?.focus();
      return;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', inputFocusHandler);

    return () => {
      window.removeEventListener('keydown', inputFocusHandler);
    };
  }, [inputFocusHandler]);

  return (
    <div className={cx('content')} data-testid="content">
      <div className={cx('header')}>
        <div className={cx('filter')}>
          <FilterInput ref={inputRef} value={query} onChange={(query) => setSearchParams({ query })} />
        </div>
        <div className={cx('navigation')}>
          <Navigation />
        </div>
      </div>
      {collections.length > 0 ? (
        <CollectionsTable collections={collections} />
      ) : (
        <Notification>Ничего не найдено</Notification>
      )}
    </div>
  );
}

export default App;

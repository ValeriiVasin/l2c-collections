import classNames from 'classnames/bind';
import { useEffect } from 'react';
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

  return (
    <div className={cx('content')}>
      <div className={cx('header')}>
        <div className={cx('filter')}>
          <FilterInput value={query} onChange={(query) => setSearchParams({ query })} />
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

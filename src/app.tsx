import classNames from 'classnames/bind';
import type { Collection } from '../types';
import styles from './app.module.scss';
import { CollectionItem } from './components/collection-item/collection-item';
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

  return (
    <div className={cx('content')}>
      <div className={cx('filter')}>
        <FilterInput value={query} onChange={(query) => setSearchParams({ query })} />
      </div>
      <Navigation />
      {collections.length === 0 && <Notification>Ничего не найдено</Notification>}
      {collections.length > 0 && (
        <table className={cx('table')}>
          <thead>
            <tr>
              <td>Название</td>
              <td>Предметы</td>
              <td>Эффект коллекции</td>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr data-testid="collection" key={collection.name} className={cx('collection')}>
                <td className={cx('collection-name')}>{collection.name}</td>
                <td className={cx('collection-items')}>
                  <CollectionItemsUi collection={collection} />
                </td>
                <td className={cx('collection-effect')}>{collection.effects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function CollectionItemsUi({ collection }: { collection: Collection }) {
  return (
    <div className={cx('collection-items-wrapper')}>
      {collection.items.map((item, index) => (
        <CollectionItem key={`${collection.name}/${index}`} item={item} />
      ))}
    </div>
  );
}

export default App;

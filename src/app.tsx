import classNames from 'classnames/bind';
import type { Collection, CollectionItem, EnchantedItem } from '../types';
import styles from './app.module.scss';
import { FilterInput } from './components/filter-input/filter-input';
import { Navigation } from './components/navigation/navigation';
import { itemsMap } from './constants/items-map';
import { searchParamsConfig } from './constants/search-params-config';
import imagesJSON from './data/images.json';
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
      {collections.length === 0 && (
        <div data-testid="notification" className={cx('notification', 'warning')}>
          Ничего не найдено
        </div>
      )}
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
        <CollectionItemUi key={`${collection.name}/${index}`} item={item} />
      ))}
    </div>
  );
}

function getTitle({ name, enchant, count }: { name: string; enchant?: number; count?: number }): string {
  let result = name;

  if (enchant) {
    result = `+${enchant} ${result}`;
  }

  return `${result} - ${count ?? 1}шт.`;
}

function CollectionItemUi({ item }: { item: CollectionItem }) {
  const singleItem: EnchantedItem = Array.isArray(item) ? item[0] : item;
  const base64Image: string = imagesJSON[singleItem.id.toString() as keyof typeof imagesJSON];

  const title = getTitle({
    name: itemsMap.get(singleItem.id)?.name ?? '',
    enchant: singleItem.enchant,
    count: singleItem.count,
  });

  return (
    <div className={cx('collection-item')} title={title}>
      {singleItem.enchant && <div className={cx('collection-item-enchant')}>{singleItem.enchant}</div>}
      {singleItem.count && singleItem.count > 1 && (
        <div className={cx('collection-item-count')}>{singleItem.count}</div>
      )}
      <img
        className={cx('collection-item-image')}
        src={`data:image/gif;base64,${base64Image}`}
        alt={String(singleItem.id)}
      />
    </div>
  );
}

export default App;

import classNames from 'classnames/bind';
import fuzzysort from 'fuzzysort';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Collection, CollectionItem, EnchantedItem, Item, Tag } from '../types';
import styles from './app.module.scss';
import { Navigation } from './components/navigation/navigation';
import { searchParamsConfig } from './constants/search-params-config';
import collectionsJSON from './data/collections.json';
import imagesJSON from './data/images.json';
import itemsJSON from './data/items.json';
import tagsJSON from './data/tags.json';
import { useAppSearchParams } from './hooks/use-app-search-params';

const itemsMap = new Map<number, Item>(itemsJSON.map((item) => [item.id, item]));
const tagsMap = new Map<Tag, Set<string>>(
  Object.entries(tagsJSON).map(([tag, collectionNames]) => [tag as Tag, new Set(collectionNames)]),
);

const cx = classNames.bind(styles);

interface PreparedCollectionResult {
  prepared: Fuzzysort.Prepared;
  collection: Collection;
}

function prepare(collections: Array<Collection>, items: Map<number, Item>): Array<PreparedCollectionResult> {
  const result: Array<PreparedCollectionResult> = [];

  for (const collection of collections) {
    result.push({ prepared: fuzzysort.prepare(collection.name), collection });
    result.push({ prepared: fuzzysort.prepare(collection.effects), collection });

    for (const collectionItem of collection.items) {
      // only first item for now
      const singleItem = Array.isArray(collectionItem) ? collectionItem[0] : collectionItem;
      const item = items.get(singleItem.id);

      if (!item) {
        continue;
      }

      result.push({ prepared: fuzzysort.prepare(item.name), collection });
    }
  }

  return result;
}

const searchItems = prepare(collectionsJSON, itemsMap);

function App() {
  const {
    searchParams: { tab, query },
    setSearchParams,
  } = useAppSearchParams(searchParamsConfig);
  const debouncedRef = useRef<null | DebouncedFunc<(q: string) => void>>(null);
  const [filterText, setFilterText] = useState(query);
  const filteredCollections: Array<Collection> = useMemo(
    () =>
      query
        ? uniq(fuzzysort.go(query, searchItems, { key: 'prepared', threshold: -1000 }).map((r) => r.obj.collection))
        : collectionsJSON,
    [query],
  );
  const collections = useMemo(
    () =>
      tab === 'all'
        ? filteredCollections
        : filteredCollections.filter((collection) => tagsMap.get(tab)?.has(collection.name)),
    [tab, filteredCollections],
  );

  debouncedRef.current = useMemo(() => {
    if (debouncedRef.current) {
      debouncedRef.current.cancel();
    }

    return debounce((query: string) => setSearchParams({ query }), 500);
  }, [setSearchParams]);

  useEffect(() => {
    debouncedRef.current?.(filterText);
  }, [filterText]);

  return (
    <div className={cx('content')}>
      <div className={cx('filter')}>
        <input
          type="search"
          className={cx('filter-input')}
          value={filterText}
          data-testid="filter"
          onChange={({ currentTarget }) => setFilterText(currentTarget.value)}
        />
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

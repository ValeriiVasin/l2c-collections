import classNames from 'classnames/bind';
import fuzzysort from 'fuzzysort';
import type { DebouncedFunc } from 'lodash';
import debounce from 'lodash/debounce';
import uniq from 'lodash/uniq';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Collection, CollectionItem, EnchantedItem, Item, Tag } from '../types';
import styles from './app.module.scss';
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

type TagsWithAll = Tag | 'all';

function App() {
  const {
    searchParams: { tab },
    setSearchParams,
    url,
  } = useAppSearchParams<{ tab: TagsWithAll }>({ tab: 'all' });
  const debouncedRef = useRef<null | DebouncedFunc<(q: string) => void>>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const filteredCollections: Array<Collection> = useMemo(
    () =>
      filter
        ? uniq(fuzzysort.go(filter, searchItems, { key: 'prepared', threshold: -1000 }).map((r) => r.obj.collection))
        : collectionsJSON,
    [filter],
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

    return debounce(setFilter, 1000);
  }, [setFilter]);

  useEffect(() => {
    debouncedRef.current?.(query);
  }, [query]);

  return (
    <div className={cx('content')}>
      <div className={cx('filter')}>
        <input
          type="search"
          className={cx('filter-input')}
          value={query}
          onChange={({ currentTarget }) => setQuery(currentTarget.value)}
        />
      </div>
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
      {collections.length === 0 && <div className={cx('notification', 'warning')}>Ничего не найдено</div>}
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

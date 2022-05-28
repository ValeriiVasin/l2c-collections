import classNames from 'classnames/bind';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import type { Collection, CollectionItem, EnchantedItem, Item, Tag } from '../types';
import styles from './app.module.scss';
import collectionsJSON from './data/collections.json';
import imagesJSON from './data/images.json';
import itemsJSON from './data/items.json';
import tagsJSON from './data/tags.json';

const itemsMap = new Map<number, Item>(itemsJSON.map((item) => [item.id, item]));
const tagsMap = new Map<Tag, Set<string>>(
  Object.entries(tagsJSON).map(([tag, collectionNames]) => [tag as Tag, new Set(collectionNames)]),
);

const cx = classNames.bind(styles);

type TagsWithAll = Tag | 'all';

function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [tag, setTag] = useState<TagsWithAll>('all');
  const taggedCollections =
    tag === 'all' ? collectionsJSON : collectionsJSON.filter((collection) => tagsMap.get(tag)?.has(collection.name));
  const fuse = new Fuse(taggedCollections, { keys: ['name', 'effects'], ignoreLocation: true, threshold: 0.3 });
  const collections = filter ? fuse.search(filter).map((result) => result.item) : taggedCollections;
  const debouncedSetFilter = debounce(setFilter, 1000);

  useEffect(() => {
    debouncedSetFilter(query);
  }, [debouncedSetFilter, query]);

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
      <ul className={cx('nav')}>
        <li className={cx('nav-item', { 'is-selected': tag === 'all' })} onClick={() => setTag('all')}>
          Все
        </li>
        <li className={cx('nav-item', { 'is-selected': tag === 'attack' })} onClick={() => setTag('attack')}>
          Атака
        </li>
        <li className={cx('nav-item', { 'is-selected': tag === 'defense' })} onClick={() => setTag('defense')}>
          Защита
        </li>
        <li className={cx('nav-item', { 'is-selected': tag === 'support' })} onClick={() => setTag('support')}>
          Помощь в бою
        </li>
        <li className={cx('nav-item', { 'is-selected': tag === 'special' })} onClick={() => setTag('special')}>
          Особый
        </li>
        <li className={cx('nav-item', { 'is-selected': tag === 'stats' })} onClick={() => setTag('stats')}>
          Характеристики
        </li>
        <li className={cx('nav-item', { 'is-selected': tag === 'utility' })} onClick={() => setTag('utility')}>
          Удобство
        </li>
        <li className={cx('nav-item', { 'is-selected': tag === 'event' })} onClick={() => setTag('event')}>
          Ивент
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
              <tr key={collection.name} className={cx('collection')}>
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

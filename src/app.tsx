import classNames from 'classnames/bind';
import { useState } from 'react';
import type { Collection, CollectionItem, EnchantedItem, Item, Tag } from '../types';
import styles from './app.module.scss';
import collectionsJSON from './data/collections.json';
import imagesJSON from './data/images.json';
import itemsJSON from './data/items.json';

const itemsMap = new Map<number, Item>(itemsJSON.map((item) => [item.id, item]));

const cx = classNames.bind(styles);

type TagsWithAll = Tag | 'all';

function App() {
  const [tag, setTag] = useState<TagsWithAll>('all');

  return (
    <div className={cx('content')}>
      <div className={cx('filter')}>
        <input type="search" className={cx('filter-input')} />
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
      <table className={cx('table')}>
        <thead>
          <tr>
            <td>Название</td>
            <td>Предметы</td>
            <td>Эффект коллекции</td>
          </tr>
        </thead>
        <tbody>
          {collectionsJSON.map((collection) => (
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

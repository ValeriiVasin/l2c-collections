import classNames from 'classnames/bind';
import type { Collection, CollectionItem, EnchantedItem, Item } from '../types';
import styles from './app.module.scss';
import collectionsJSON from './data/collections.json';
import imagesJSON from './data/images.json';
import itemsJSON from './data/items.json';

const itemsMap = new Map<number, Item>(itemsJSON.map((item) => [item.id, item]));

const cx = classNames.bind(styles);

function App() {
  return (
    <div className={cx('content')}>
      <div className={cx('filter')}>
        <input type="search" className={cx('filter-input')} />
      </div>
      <ul className={cx('nav')}>
        <li className={cx('nav-item')}>Атака</li>
        <li className={cx('nav-item')}>Защита</li>
        <li className={cx('nav-item')}>Помощь в бою</li>
        <li className={cx('nav-item')}>Особый</li>
        <li className={cx('nav-item')}>Характеристики</li>
        <li className={cx('nav-item')}>Удобство</li>
        <li className={cx('nav-item')}>Ивент</li>
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

function CollectionItemUi({ item }: { item: CollectionItem }) {
  const singleItem: EnchantedItem = Array.isArray(item) ? item[0] : item;
  const base64Image: string = imagesJSON[singleItem.id.toString() as keyof typeof imagesJSON];

  return (
    <div className={cx('collection-item')} title={itemsMap.get(singleItem.id)?.name}>
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

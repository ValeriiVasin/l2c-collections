import classNames from 'classnames/bind';
import type { Collection } from '../../../types';
import { CollectionItem } from '../collection-item/collection-item';
import styles from './collections-table.module.scss';
const cx = classNames.bind(styles);

export function CollectionsTable({ collections }: { collections: Array<Collection> }) {
  return (
    <table className={cx('collections-table')}>
      <thead>
        <tr>
          <td className={cx('header-cell')}>Название</td>
          <td className={cx('header-cell')}>Предметы</td>
          <td className={cx('header-cell')}>Эффект коллекции</td>
        </tr>
      </thead>
      <tbody>
        {collections.map((collection) => (
          <tr data-testid="collection" key={collection.name} className={cx('row')}>
            <td className={cx('table-cell', 'name')}>{collection.name}</td>
            <td className={cx('table-cell', 'items')}>
              <div className={cx('items-list')}>
                {collection.items.map((item, index) => (
                  <CollectionItem key={`${collection.name}/${index}`} item={item} />
                ))}
              </div>
            </td>
            <td className={cx('table-cell', 'effects')}>{collection.effects}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import 'tippy.js/dist/tippy.css'; // optional
import type { CollectionItem as ICollectionItem, EnchantedItem } from '../../../types';
import { itemsMap } from '../../constants/items-map';
import imagesJSON from '../../data/images.json';
import styles from './collection-item.module.scss';
import { getTitle } from './helpers/get-title';
const cx = classNames.bind(styles);

export function CollectionItem({ item }: { item: ICollectionItem }) {
  const singleItem: EnchantedItem = Array.isArray(item) ? item[0] : item;
  const base64Image: string = imagesJSON[singleItem.id.toString() as keyof typeof imagesJSON];

  const title = getTitle({
    name: itemsMap.get(singleItem.id)?.name ?? '',
    enchant: singleItem.enchant,
    count: singleItem.count,
  });

  return (
    <Tippy content={title} maxWidth={500}>
      <div className={cx('collection-item')}>
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
    </Tippy>
  );
}

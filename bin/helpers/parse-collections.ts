import { JSDOM } from 'jsdom';
import { Collection, CollectionItem, EnchantedItem } from '../../types';
import { parseItemId } from './parse-item-id';

export function parseCollections(content: string): Array<Collection> {
  const { document } = new JSDOM(content).window;
  const rows = [...document.querySelectorAll('.collections-list .list-row:not(.head-row)')];

  return rows.map(row => {
    const name = row.querySelector('.name-col')?.textContent ?? '';
    const effects = row.querySelector('.effect-col')?.textContent ?? '';
    const items = row.querySelectorAll('.items-col .item:not(.empty)');

    return {
      name,
      items: [...items].map(parseCollectionItem),
      effects,
    }
  });
}

function parseCollectionItem(item: Element): CollectionItem {
  const links = item.querySelectorAll<HTMLAnchorElement>('a.slot-item');
  const result: Array<EnchantedItem> = [];

  for (const link of links) {
    const id = parseItemId(link.href);

    if (Number.isNaN(id)) {
      continue;
    }

    const enchantNode = link.querySelector('.enchant');

    if (!enchantNode || !enchantNode.textContent) {
      result.push({ id });
      continue;
    }

    const enchant = Number(enchantNode.textContent.replace(/\D/g, ''));
    result.push({ id, enchant });
  }

  return result.length === 1 ? result[0] : result;
}

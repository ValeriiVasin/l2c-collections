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
    const item: EnchantedItem = { id };

    const enchant = parseEnchant(link);
    if (enchant) {
      item.enchant = enchant;
    }

    const count = parseCount(link);
    if (count && count > 1) {
      item.count = count;
    }

    result.push(item);
  }

  return result.length === 1 ? result[0] : result;
}

function parseEnchant(link: HTMLAnchorElement): number | undefined {
  const enchantNode = link.querySelector('.enchant');

  if (!enchantNode || !enchantNode.textContent) {
    return;
  }

  return Number(enchantNode.textContent.replace(/\D/g, ''));
}

function parseCount(link: HTMLAnchorElement): number | undefined {
  // top-level node or the one inside
  const nodes = [link, link.querySelector('[data-count]')];

  for (const nodeWithCount of nodes) {
    if (!nodeWithCount) {
      continue;
    }

    const countAttrValue = nodeWithCount.getAttribute('data-count');
    if (!countAttrValue) {
      continue;
    }

    return Number(countAttrValue);
  }
}

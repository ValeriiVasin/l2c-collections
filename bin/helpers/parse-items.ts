import { JSDOM } from 'jsdom';
import type { Item } from '../../types';
import { parseItemId } from './parse-item-id';
import { parseTitle } from './parse-title';

export function parseItems(content: string): Map<number, Item> {
  const { document } = new JSDOM(content).window;
  const items = new Map<number, Item>();

  for (const link of document.querySelectorAll<HTMLAnchorElement>('a.slot-item')) {
    const id = parseItemId(link.href);

    if (Number.isNaN(id)) {
      continue;
    }

    const item: Item = { id, name: parseName(link) };
    const sealed = isSealed(link);

    if (sealed) {
      item.sealed = sealed;
    }

    items.set(id, item);
  }

  return items;
}

function parseName(link: HTMLAnchorElement): string {
  const title = link.getAttribute('data-title');
  // single
  if (title) {
    return parseTitle(title).name;
  }

  // inside the list

  // order of nodes inside of a div:
  // - <Optional> enchant level
  // - item name
  // - <Optional> sealed title
  const nameNodeOrder = link.querySelector('.enchant') ? 2 : 1;
  return parseTitle(link.querySelector(`div > span:nth-child(${nameNodeOrder})`)?.textContent ?? '').name;
}

function isSealed(link: HTMLAnchorElement): boolean {
  return link.textContent?.includes('Запечатано') ?? false;
}

import { JSDOM } from 'jsdom';
import type { Item } from '../../types';
import { cleanName } from './clean-name';
import { parseItemId } from './parse-item-id';

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
  // single
  if (link.hasAttribute('data-title')) {
    return cleanName(link.getAttribute('data-title') ?? '');
  }

  // inside the list
  return cleanName(link.querySelector('div > span:nth-child(2)')?.textContent ?? '');
}

function isSealed(link: HTMLAnchorElement): boolean {
  return link.textContent?.includes('Запечатано') ?? false;
}

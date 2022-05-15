import { JSDOM } from 'jsdom';
import { parseItemId } from './parse-item-id';

const regexp = /\/items\/(?<id>\d+)\.html$/;
export function parseItems(content: string): Set<number> {
  const { document } = new JSDOM(content).window;
  const items = new Set<number>();

  for (const link of document.querySelectorAll('a')) {
    const id = parseItemId(link.href);

    if (Number.isNaN(id)) {
      continue;
    }

    items.add(id);
  }

  return items;
}

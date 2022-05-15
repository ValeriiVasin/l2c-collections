import { JSDOM } from 'jsdom';

const regexp = /\/items\/(?<id>\d+)\.html$/;
export function parseItems(content: string): Set<number> {
  const { document } = new JSDOM(content).window;
  const items = new Set<number>();

  for (const link of document.querySelectorAll('a')) {
      const href = link.href;
      const match = href.match(regexp)

      if (!match || !match.groups || !match.groups.id) {
          continue;
      }

      items.add(Number(match.groups.id));
  }

  return items;
}

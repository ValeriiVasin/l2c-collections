import type { Collection, Item } from '../../types';
import { pagedUrls } from './paged-urls';
import { parseCollectionsPage } from './parse-collections-page';

export async function parseCollectionsPages({
  baseUrl,
  pages,
}: {
  baseUrl: string;
  pages: number;
}): Promise<{ items: Map<number, Item>; collections: Array<Collection> }> {
  const urls = pagedUrls(baseUrl, pages);
  const resultCollections: Collection[] = [];
  const resultItems: Map<number, Item> = new Map();

  for (const url of urls) {
    const { items, collections } = await parseCollectionsPage(url);
    resultCollections.push(...collections);
    mergeMap(resultItems, items);
  }

  return { items: resultItems, collections: resultCollections };
}

function mergeMap<K, V>(target: Map<K, V>, source: Map<K, V>): void {
  for (const [k, v] of source.entries()) {
    target.set(k, v);
  }
}

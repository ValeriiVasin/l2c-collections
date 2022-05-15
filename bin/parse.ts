import fs from 'fs';
import path from 'path';
import { Collection, Item } from '../types';
import { pagedUrls } from './helpers/paged-urls';
import { parseCollectionsPage } from './helpers/parse-collections-page';

const itemsFile = path.resolve(__dirname, '../data/items.json');
const collectionsFile = path.resolve(__dirname, '../data/collections.json');

async function main() {
  const urls = pagedUrls('https://l2central.info/classic/items/collections/', 2);
  const resultCollections: Collection[] = [];
  const resultItems: Map<number, Item> = new Map();

  for (const url of urls) {
    const { items, collections } = await parseCollectionsPage(url);
    resultCollections.push(...collections);
    mergeMap(resultItems, items);
  }

  const itemsContent: string = JSON.stringify(Object.fromEntries(resultItems.entries()), null, 2);
  const collectionsContent: string = JSON.stringify(resultCollections, null, 2);

  fs.writeFileSync(itemsFile, itemsContent, 'utf-8');
  fs.writeFileSync(collectionsFile, collectionsContent, 'utf-8');
}

function mergeMap<K, V>(target: Map<K, V>, source: Map<K, V>): void {
  for (const [k, v] of source.entries()) {
    target.set(k, v);
  }
}

main();

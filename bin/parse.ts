import fs from 'fs';
import path from 'path';
import { parseCollectionsPages } from './helpers/parse-collections-pages';

const itemsFile = path.resolve(__dirname, '../data/items.json');
const collectionsFile = path.resolve(__dirname, '../data/collections.json');

async function main() {
  const { items, collections } = await parseCollectionsPages({
    baseUrl: 'https://l2central.info/classic/items/collections/',
    pages: 15,
  });

  const itemsContent: string = JSON.stringify(Array.from(items.values()));
  const collectionsContent: string = JSON.stringify(collections);

  fs.writeFileSync(itemsFile, itemsContent, 'utf-8');
  fs.writeFileSync(collectionsFile, collectionsContent, 'utf-8');
}

main();

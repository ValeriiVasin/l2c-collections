import fs from 'fs';
import path from 'path';
import type { Collection, Tag, TaggedCollections } from '../types';
import { parseCollectionsPages } from './helpers/parse-collections-pages';

const tagsFile = path.resolve(__dirname, '../data/tags.json');

const config: Record<Tag, { baseUrl: string; pages: number }> = {
  attack: { baseUrl: 'https://l2central.info/classic/items/collections/attack/', pages: 4 },
  defense: { baseUrl: 'https://l2central.info/classic/items/collections/defense/', pages: 5 },
  support: { baseUrl: 'https://l2central.info/classic/items/collections/support/', pages: 4 },
  special: { baseUrl: 'https://l2central.info/classic/items/collections/special/', pages: 2 },
  stats: { baseUrl: 'https://l2central.info/classic/items/collections/stats/', pages: 1 },
  utility: { baseUrl: 'https://l2central.info/classic/items/collections/utility/', pages: 2 },
  event: { baseUrl: 'https://l2central.info/classic/items/collections/evt/', pages: 1 },
};

const collectionNames = ({ collections }: { collections: Array<Collection> }): string[] =>
  collections.map((collection) => collection.name);

async function main() {
  const result: TaggedCollections = {
    attack: collectionNames(await parseCollectionsPages(config.attack)),
    defense: collectionNames(await parseCollectionsPages(config.defense)),
    support: collectionNames(await parseCollectionsPages(config.support)),
    special: collectionNames(await parseCollectionsPages(config.special)),
    stats: collectionNames(await parseCollectionsPages(config.stats)),
    utility: collectionNames(await parseCollectionsPages(config.utility)),
    event: collectionNames(await parseCollectionsPages(config.event)),
  };

  fs.writeFileSync(tagsFile, JSON.stringify(result), 'utf-8');
}

main();

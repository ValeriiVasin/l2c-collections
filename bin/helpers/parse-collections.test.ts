import { describe, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { Collection } from '../../types';
import { parseCollections } from './parse-collections';

const mainCollectionsPage = fs.readFileSync(path.resolve(__dirname, './fixtures/main-collections-page.html'), 'utf8');

describe('parse collections', () => {
  test('parses correct amount of collections', () => {
    expect(parseCollections(mainCollectionsPage)).toHaveLength(20);
  });

  test('contains exact collection', () => {
    const collection: Collection = {
      name: 'Касание леса',
      items: [[{id: 312, enchant: 5},{id: 95046, enchant: 5}], {id: 272}, {id: 9}],
      effects: 'Физ. Защ. +24',
    };

    expect(parseCollections(mainCollectionsPage)).toContainEqual(collection)
  });
});

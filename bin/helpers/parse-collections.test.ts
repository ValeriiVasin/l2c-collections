import { describe, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { parseCollections } from './parse-collections';

const mainCollectionsPage = fs.readFileSync(path.resolve(__dirname, './fixtures/main-collections-page.html'), 'utf8');

describe('parse collections', () => {
  test('parses correct amount of collections', () => {
    expect(parseCollections(mainCollectionsPage)).toHaveLength(20);
  });

  test.todo('contains exact collection');
});

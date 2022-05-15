import { describe, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { parseItems } from './parse-items';

const mainCollectionsPage = fs.readFileSync(path.resolve(__dirname, './fixtures/main-collections-page.html'), 'utf8');

describe('parse items', () => {
  test('real collections page', () => {
    const items = parseItems(mainCollectionsPage);

    expect(items.has(25)).toBe(true);
    expect(items.has(87)).toBe(true);
    expect(items.size).toBe(84);
  })
});

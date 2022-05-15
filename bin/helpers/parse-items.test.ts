import { describe, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { Item } from '../../types';
import { parseItems } from './parse-items';

const mainCollectionsPage = fs.readFileSync(path.resolve(__dirname, './fixtures/main-collections-page.html'), 'utf8');

describe('parse items', () => {
  let items: Map<number, Item>;

  beforeEach(() => {
    items = parseItems(mainCollectionsPage);
  });

  test('items size is correct', () => {
    expect(items.size).toBe(84);
  });

  describe('parses item names from a single item', () => {
    test('not enchanted', () => {
      expect(items.get(25)).toEqual({id: 25, name: 'Составная Костяная Кираса'});
    });

    test.todo('enchanted');
  });

  describe('parses item names from the list', () => {
    test.todo('not enchanted');

    test('enchanted', () => {
      expect(items.get(280)).toEqual({ id: 280, name: 'Легкий Лук'});
    });

    test('enchanted sealed', () => {
      expect(items.get(95028)).toEqual({ id: 95028, name: 'Легкий Лук', sealed: true });
    });
  });

  test('all ids has names', () => {
    expect([...items.values()].every(item => item.name.length > 0)).toBe(true);
  });
});

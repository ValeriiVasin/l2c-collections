import { describe, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import type { Item } from '../../types';
import { parseItems } from './parse-items';

const mainCollectionsPage = fs.readFileSync(path.resolve(__dirname, './fixtures/main-collections-page.html'), 'utf8');
const mainCollectionsPageTwo = fs.readFileSync(
  path.resolve(__dirname, './fixtures/main-collections-page-two.html'),
  'utf8',
);
const utilityPage = fs.readFileSync(path.resolve(__dirname, './fixtures/utility-collections-page.html'), 'utf8');

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
      expect(items.get(25)).toEqual({ id: 25, name: 'Составная Костяная Кираса' });
    });

    test('enchanted', () => {
      items = parseItems(mainCollectionsPageTwo);
      expect(items.get(847)).toEqual({ id: 847, name: 'Серьга Багрового Полумесяца' });
    });
  });

  describe('parses item names from the list', () => {
    describe('enchanted', () => {
      test('sealed', () => {
        expect(items.get(95028)).toEqual({ id: 95028, name: 'Легкий Лук', sealed: true });
      });

      test('not sealed', () => {
        expect(items.get(280)).toEqual({ id: 280, name: 'Легкий Лук' });
      });
    });

    describe('not enchanted', () => {
      test('sealed', () => {
        items = parseItems(mainCollectionsPageTwo);
        expect(items.get(94927)).toEqual({ id: 94927, name: 'Крылатое Копье', sealed: true });
      });

      test('not sealed', () => {
        items = parseItems(mainCollectionsPageTwo);
        expect(items.get(93)).toEqual({ id: 93, name: 'Крылатое Копье' });
      });
    });
  });

  test('all ids has names', () => {
    const findNodeWithoutName = (items: Map<number, Item>) => {
      return [...items.values()].find((item) => item.name.length === 0);
    };

    expect(findNodeWithoutName(items)).toBeUndefined();
  });

  describe('parses items with level', () => {
    test('rune', () => {
      items = parseItems(utilityPage);
      expect(items.get(94788)).toEqual({ id: 94788, name: 'Руна Развития Ур. 8' });
    });

    test.todo('doll');
  });
});

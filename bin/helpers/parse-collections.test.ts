import { describe, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import type { Collection } from '../../types';
import { parseCollections } from './parse-collections';

const mainCollectionsPage = fs.readFileSync(path.resolve(__dirname, './fixtures/main-collections-page.html'), 'utf8');
const mainCollectionsPageTwo = fs.readFileSync(
  path.resolve(__dirname, './fixtures/main-collections-page-two.html'),
  'utf8',
);
const utilityCollectionsPage = fs.readFileSync(
  path.resolve(__dirname, './fixtures/utility-collections-page.html'),
  'utf8',
);

describe('parse collections', () => {
  test('parses correct amount of collections', () => {
    expect(parseCollections(mainCollectionsPage)).toHaveLength(20);
  });

  test('contains exact collection', () => {
    const collection: Collection = {
      name: 'Касание леса',
      items: [
        [
          { id: 312, enchant: 5 },
          { id: 95046, enchant: 5 },
        ],
        { id: 272 },
        { id: 9 },
      ],
      effects: 'Физ. Защ. +24',
    };

    expect(parseCollections(mainCollectionsPage)).toContainEqual(collection);
  });

  test('contains collection with the count more than 1', () => {
    const collection: Collection = {
      name: 'Коллекция Рун Развития I',
      items: [{ id: 94781 }, { id: 94781 }, { id: 94781 }, { id: 94780, count: 5 }, { id: 94780 }],
      effects: 'Бонус опыта и SP +1%',
    };

    expect(parseCollections(utilityCollectionsPage)).toContainEqual(collection);
  });

  describe('parse items inside of the collection', () => {
    describe('enchant', () => {
      test('single enchanted item', () => {
        expect(parseCollections(mainCollectionsPageTwo)).toContainEqual(
          expect.objectContaining({
            name: 'Стремление к моде',
            items: expect.arrayContaining([{ id: 847, enchant: 4 }]),
          }),
        );
      });
      test.todo('item from the list');
    });

    describe('count', () => {
      test.todo('single item');
      test.todo('item from the list');
    });
  });
});

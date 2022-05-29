import { describe, test } from '@jest/globals';
import { useMemo } from 'react';
import { useCollections } from './use-collections';

jest.mock('react');
const mockedUseMemo = jest.mocked(useMemo);

describe('use collections', () => {
  beforeEach(() => {
    mockedUseMemo.mockImplementation((factory, _deps) => factory());
  });
  afterEach(() => mockedUseMemo.mockClear());

  test('long collection name', () => {
    expect(
      useCollections({ query: 'Комплект двуручного дробящего оружия среднего качества', tab: 'all' }),
    ).toContainEqual(expect.objectContaining({ name: 'Комплект двуручного дробящего оружия среднего качества I' }));
  });

  test('long effect name', () => {
    expect(useCollections({ query: 'Бонус опыта и SP', tab: 'all' })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Победа Ⅰ' }),
        expect.objectContaining({ name: 'Победа Ⅱ' }),
        expect.objectContaining({ name: 'Победа Ⅲ' }),
      ]),
    );
  });
});

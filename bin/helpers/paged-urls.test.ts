import { describe, test } from '@jest/globals';
import { pagedUrls } from './paged-urls';

describe('paged urls', () => {
  test('generates paged urls', () => {
    expect(pagedUrls('https://l2central.info/classic/items/collections/', 2)).toEqual([
      'https://l2central.info/classic/items/collections/',
      'https://l2central.info/classic/items/collections/?page=2',
    ]);
  });
});

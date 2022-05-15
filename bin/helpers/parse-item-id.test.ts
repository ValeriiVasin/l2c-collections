import { describe, test } from '@jest/globals';
import { parseItemId } from './parse-item-id';

describe('parse item id', () => {
  test('parses id from relative link', () => {
    expect(parseItemId('/items/123.html')).toBe(123);
  });

  test('parses id from absolute link', () => {
    expect(parseItemId('https://l2central.info/classic/items/7896.html')).toBe(7896);
  });

  test('returns NaN if id can not be parsed', () => {
    expect(parseItemId('google.com')).toBeNaN();
  });
});

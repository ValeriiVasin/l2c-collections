import { describe, test } from '@jest/globals';
import { parseTitle } from './parse-title';

describe('parse title', () => {
  test('returns empty string as a name if can not be parsed', () => {
    expect(parseTitle('')).toEqual({ name: '' });
  });

  test('title without count and enchant', () => {
    expect(parseTitle('Составная Костяная Кираса')).toEqual({ name: 'Составная Костяная Кираса' });
  });

  test('does not return count if its less than 2', () => {
    expect(parseTitle('Составная Костяная Кираса(1)')).toEqual({ name: 'Составная Костяная Кираса' });
  });

  test('name with the count', () => {
    expect(parseTitle('Составная Костяная Кираса(2)')).toEqual({ name: 'Составная Костяная Кираса', count: 2 });
  });

  test('enchant', () => {
    expect(parseTitle('+4 Серьга Багрового Полумесяца(1)')).toEqual({
      name: 'Серьга Багрового Полумесяца',
      enchant: 4,
    });
  });

  test('enchant and count', () => {
    expect(parseTitle('+3 Серьга Багрового Полумесяца(2)')).toEqual({
      name: 'Серьга Багрового Полумесяца',
      enchant: 3,
      count: 2,
    });
  });

  test('item name with the level', () => {
    expect(parseTitle('Руна Развития Ур. 8(1)')).toEqual({ name: 'Руна Развития Ур. 8' });
    expect(parseTitle('Руна Развития Ур. 8(2)')).toEqual({ name: 'Руна Развития Ур. 8', count: 2 });
  });
});

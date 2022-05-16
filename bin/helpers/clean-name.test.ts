import { describe, test } from '@jest/globals';
import { cleanName } from './clean-name';

describe('clean name', () => {
  test('removes amount informantion', () => {
    expect(cleanName('Составная Костяная Кираса(1)')).toBe('Составная Костяная Кираса');
  });

  test('trims content', () => {
    expect(cleanName('Легкий Лук ')).toBe('Легкий Лук');
  });
});

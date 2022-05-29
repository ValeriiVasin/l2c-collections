import type { Item } from '../../types';
import itemsJSON from '../data/items.json';

export const itemsMap = new Map<number, Item>(itemsJSON.map((item) => [item.id, item]));

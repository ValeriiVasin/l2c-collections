interface EnchantedItem {
  id: number;
  enchant?: number;
}

export interface Collection {
  name: string;
  items: Array<EnchantedItem | EnchantedItem[]>;
  effects: string;
}

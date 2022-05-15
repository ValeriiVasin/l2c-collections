export interface EnchantedItem {
  id: number;
  enchant?: number;
}

export type CollectionItem = EnchantedItem | Array<EnchantedItem>;

export interface Collection {
  name: string;
  items: Array<CollectionItem>;
  effects: string;
}

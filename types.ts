export interface Item {
  id: number;
  name: string;
  sealed?: boolean;
}

export interface EnchantedItem {
  id: number;
  enchant?: number;
  count?: number;
}

export type CollectionItem = EnchantedItem | Array<EnchantedItem>;

export interface Collection {
  name: string;
  items: Array<CollectionItem>;
  effects: string;
}

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

export type Tag = 'attack' | 'defense' | 'support' | 'special' | 'stats' | 'utility' | 'event';
export type TaggedCollections = Record<Tag, Array<string>>;

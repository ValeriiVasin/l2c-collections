import fuzzysort from 'fuzzysort';
import uniq from 'lodash/uniq';
import { useMemo } from 'react';
import type { Collection, Item, Tag } from '../../types';
import { itemsMap } from '../constants/items-map';
import { searchParamsConfig } from '../constants/search-params-config';
import collectionsJSON from '../data/collections.json';
import tagsJSON from '../data/tags.json';
import { useAppSearchParams } from './use-app-search-params';

const tagsMap = new Map<Tag, Set<string>>(
  Object.entries(tagsJSON).map(([tag, collectionNames]) => [tag as Tag, new Set(collectionNames)]),
);

interface PreparedCollectionResult {
  prepared: Fuzzysort.Prepared;
  collection: Collection;
}

function prepare(collections: Array<Collection>, items: Map<number, Item>): Array<PreparedCollectionResult> {
  const result: Array<PreparedCollectionResult> = [];

  for (const collection of collections) {
    result.push({ prepared: fuzzysort.prepare(collection.name), collection });
    result.push({ prepared: fuzzysort.prepare(collection.effects), collection });

    for (const collectionItem of collection.items) {
      // only first item for now
      const singleItem = Array.isArray(collectionItem) ? collectionItem[0] : collectionItem;
      const item = items.get(singleItem.id);

      if (!item) {
        continue;
      }

      result.push({ prepared: fuzzysort.prepare(item.name), collection });
    }
  }

  return result;
}

const searchItems = prepare(collectionsJSON, itemsMap);

export function useCollections(): Array<Collection> {
  const {
    searchParams: { tab, query },
  } = useAppSearchParams(searchParamsConfig);

  const filteredCollections: Array<Collection> = useMemo(
    () =>
      query
        ? uniq(fuzzysort.go(query, searchItems, { key: 'prepared', threshold: -1000 }).map((r) => r.obj.collection))
        : collectionsJSON,
    [query],
  );

  return useMemo(
    () =>
      tab === 'all'
        ? filteredCollections
        : filteredCollections.filter((collection) => tagsMap.get(tab)?.has(collection.name)),
    [tab, filteredCollections],
  );
}

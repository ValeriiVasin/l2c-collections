import { JSDOM } from 'jsdom';
import { Collection, Item } from '../../types';
import { parseCollections } from './parse-collections';
import { parseItems } from './parse-items';

export async function parseCollectionsPage(url: string): Promise<{ items: Map<number, Item>, collections: Array<Collection>}> {
  const dom = await JSDOM.fromURL(url);

  const content = dom.window.document.querySelector('#content')?.outerHTML;

  if (!content) {
    throw new Error('Can not find content');
  }

  const items = parseItems(content);
  const collections = parseCollections(content);

  return { items, collections };
}

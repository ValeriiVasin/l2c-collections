import fs from 'fs';
import imageToBase64 from 'image-to-base64';
import path from 'path';
import items from '../src/data/items.json';

const imageConfigFile = path.resolve(__dirname, '../src/data/images.json');

(async function main() {
  const result: Record<number, string> = await fetchImages(items.map((item) => item.id));

  fs.writeFileSync(imageConfigFile, JSON.stringify(result), 'utf-8');
})();

async function fetchImages(ids: number[], result: Record<number, string> = {}): Promise<Record<number, string>> {
  const retry: number[] = [];

  for (const id of ids) {
    try {
      result[id] = await imageToBase64(`https://l2central.info/api/classic/icon/?item=${id}`);
    } catch {
      retry.push(id);
    }
  }

  return retry.length > 0 ? fetchImages(retry, result) : result;
}

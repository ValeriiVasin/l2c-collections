const regexp = /^(\+(?<enchant>\d+))?\s?(?<name>.*?)(\((?<count>\d+)\))?$/;

interface ParseTitleResult {
  name: string;
  count?: number;
  enchant?: number;
}

export function parseTitle(title: string): ParseTitleResult {
  const match = title.match(regexp);

  if (!match || !match.groups) {
    return { name: '' };
  }

  const count = match.groups.count;
  const enchant = match.groups.enchant;

  const result: ParseTitleResult = { name: match.groups.name };

  if (count && Number(count) > 1) {
    result.count = Number(count);
  }

  if (enchant && Number(enchant) > 1) {
    result.enchant = Number(enchant);
  }

  return result;
}

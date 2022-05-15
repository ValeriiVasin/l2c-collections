const regexp = /\/items\/(?<id>\d+)\.html$/;

export function parseItemId(href: string): number {
  const match = href.match(regexp)

  if (!match || !match.groups || !match.groups.id) {
    return Number.NaN;
  }

  return Number(match.groups.id);
}

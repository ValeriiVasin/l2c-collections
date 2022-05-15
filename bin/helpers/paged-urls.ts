export function pagedUrls(baseUrl: string, pages: number): string[] {
  const results: string[] = [baseUrl];

  for (let page = 2; page <= pages; page++) {
    results.push(`${baseUrl}?page=${page}`);
  }

  return results;
}

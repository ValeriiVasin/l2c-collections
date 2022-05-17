export function cleanName(name: string): string {
  return name.replace(/[^а-яА-Я ]/g, '').trim();
}

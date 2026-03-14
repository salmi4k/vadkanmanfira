export function joinWithAnd(items: string[]): string {
  if (items.length <= 1) {
    return items[0] ?? '';
  }

  if (items.length === 2) {
    return `${items[0]} och ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')} och ${items[items.length - 1]}`;
}

export function normalizeLabel(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function includesAny(value: string, needles: string[]): boolean {
  return needles.some((needle) => value.includes(needle));
}

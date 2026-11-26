export function byId<Item extends { id: string }>(items: readonly Item[]): Record<string, Item> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

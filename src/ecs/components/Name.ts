export const Name = new Map<number, string>();

export function setName(id: number, name: string) {
  Name.set(id, name);
}
export function getName(entityId: number): string | undefined {
  return Name.get(entityId);
}
export const Name = new Map<number, string>();

export function setName(id: number, name: string) {
  Name.set(id, name);
}

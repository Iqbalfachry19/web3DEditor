// ecs/Entity.ts
let nextEntityId = 0;
export const allEntities = new Set<number>();
export type Entity = number; // atau jenis lain jika kamu punya ID lebih kompleks

export function createEntity(): number {
  const id = nextEntityId++;
  allEntities.add(id);
  return id;
}

export function deleteEntity(id: number) {
  allEntities.delete(id);
  // Remove components if needed
}

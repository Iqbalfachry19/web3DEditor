// src/ecs/EntityRegistry.ts
export const EntityRegistry = new Set<number>();

export function registerEntity(id: number) {
  EntityRegistry.add(id);
}

export function unregisterEntity(id: number) {
  EntityRegistry.delete(id);
}

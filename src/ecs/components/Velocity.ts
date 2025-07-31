import type { Entity } from "../Entity";

export const Velocity = new Map<Entity, { x: number; y: number; z: number }>();

export const addVelocity = (entity: Entity, x = 0, y = 0, z = 0) => {
  Velocity.set(entity, { x, y, z });
};

// Velocity.ts
export function setVelocity(id: number, x: number, y: number, z: number) {
  Velocity.set(id, { x, y, z });
}

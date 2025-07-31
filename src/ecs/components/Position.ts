// Position.ts
import type { Entity } from "../Entity";

export const Position = new Map<Entity, { x: number; y: number; z: number }>();

export const addPosition = (entity: Entity, x = 0, y = 0, z = 0) => {
  Position.set(entity, { x, y, z });
};

export function setPosition(
  id: Entity,
  x: number | { x: number; y: number; z: number },
  y?: number,
  z?: number
) {
  if (typeof x === "object") {
    Position.set(id, x);
  } else {
    Position.set(id, { x, y: y!, z: z! });
  }
}

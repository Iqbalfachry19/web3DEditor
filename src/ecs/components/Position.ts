import * as THREE from "three";
import type { Entity } from "../Entity";

export const Position = new Map<Entity, THREE.Vector3>();

export const addPosition = (entity: Entity, x = 0, y = 0, z = 0) => {
  Position.set(entity, new THREE.Vector3(x, y, z));
};

export function setPosition(
  id: Entity,
  x: number | THREE.Vector3 | { x: number; y: number; z: number },
  y?: number,
  z?: number
) {
  if (x instanceof THREE.Vector3) {
    Position.set(id, x.clone());
  } else if (typeof x === "object") {
    Position.set(id, new THREE.Vector3(x.x, x.y, x.z));
  } else {
    Position.set(id, new THREE.Vector3(x, y!, z!));
  }
}

import type { Entity } from "../Entity";

export type MeshData = {
  geometry: "box" | "sphere"; // extendable
  color: string;
};

export const MeshComponent = new Map<Entity, MeshData>();

export const addMesh = (
  entity: Entity,
  geometry: "box" | "sphere" = "box",
  color = "hotpink"
) => {
  MeshComponent.set(entity, { geometry, color });
};

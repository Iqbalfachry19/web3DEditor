// Mesh.ts
import type { Entity } from "../Entity";

export type MeshData = {
  geometry: "box" | "sphere" | "camera";
  color: string;
  texture?: string;
};

export const MeshComponent = new Map<Entity, MeshData>();

export const addMesh = (
  entity: Entity,
  geometry: "box" | "sphere" | "camera" = "box",
  color = "hotpink",
  texture?: string
) => {
  MeshComponent.set(entity, { geometry, color, texture });
};

// ✅ Tambahkan fungsi ini agar bisa digunakan dari luar
export const setMesh = (entity: Entity, meshData: MeshData) => {
  MeshComponent.set(entity, meshData);
};

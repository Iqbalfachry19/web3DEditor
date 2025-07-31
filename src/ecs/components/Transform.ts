export interface TransformData {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

const Transform = new Map<number, TransformData>();

export function addTransform(
  id: number,
  position = { x: 0, y: 0, z: 0 },
  rotation = { x: 0, y: 0, z: 0 },
  scale = { x: 1, y: 1, z: 1 }
) {
  Transform.set(id, { position, rotation, scale });
}

export function getTransform(id: number): TransformData | undefined {
  return Transform.get(id);
}

export function setTransform(id: number, transform: TransformData) {
  Transform.set(id, transform);
}

export function removeTransform(id: number) {
  Transform.delete(id);
}

export function clearTransform() {
  Transform.clear();
}

export { Transform };

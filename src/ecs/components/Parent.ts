// src/ecs/components/Parent.ts
export const Parent = new Map<number, number>(); // childId -> parentId

export function setParent(childId: number, parentId: number) {
  Parent.set(childId, parentId);
}

export function getChildren(parentId: number): number[] {
  const children: number[] = [];
  for (const [child, parent] of Parent.entries()) {
    if (parent === parentId) children.push(child);
  }
  return children;
}

// Collision component for handling collision events
export interface CollisionData {
    destroyOnCollision: boolean;
    collisionTag?: string; // Optional tag to specify what to collide with
}

export const Collision = new Map<number, CollisionData>();

export function addCollision(
    entityId: number,
    destroyOnCollision: boolean = false,
    collisionTag?: string
) {
    Collision.set(entityId, { destroyOnCollision, collisionTag });
}
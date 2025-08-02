import { Transform } from "../components/Transform";
import { Velocity } from "../components/Velocity";

export const MovementSystem = (delta: number) => {
  for (const [entity, velocity] of Velocity.entries()) {
    const position = Transform.get(entity)?.position;
    if (!position) continue;

    position.x += velocity.x * delta;
    position.y += velocity.y * delta;
    position.z += velocity.z * delta;

    // debug log
    console.log(`Entity ${entity} moved to`, position);
  }
};

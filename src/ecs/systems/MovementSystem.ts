import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";

export const MovementSystem = (delta: number) => {
  for (const [entity, velocity] of Velocity.entries()) {
    const position = Position.get(entity);
    if (position) {
      position.x += velocity.x * delta;
      position.y += velocity.y * delta;
      position.z += velocity.z * delta;
    }
    
  }
};

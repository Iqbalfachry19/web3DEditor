import { MovementSystem } from "./systems/MovementSystem";

let lastTime = performance.now();

export const worldTick = () => {
  const now = performance.now();
  const delta = (now - lastTime) / 1000;

  MovementSystem(delta);

  lastTime = now;
  requestAnimationFrame(worldTick);
};

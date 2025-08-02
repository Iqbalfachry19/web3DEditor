// world.ts
import {  PlayerInputSystem } from "./systems/PlayerInputSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { runScripts } from "./systems/Scripting";

export const worldTick = (delta: number) => {
  PlayerInputSystem();
  MovementSystem(delta);
  runScripts(delta);
};

// Optional: start loop manually outside React
let lastTime = performance.now();
export const startWorldLoop = () => {
  const loop = () => {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    worldTick(delta);
    requestAnimationFrame(loop);
  };
  loop();
};

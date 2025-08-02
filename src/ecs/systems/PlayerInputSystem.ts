import { PlayerControlled } from "../components/PlayerControlled";
import { Velocity } from "../components/Velocity";

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

window.addEventListener("keydown", (e) => {

  if (e.code === "KeyW") keys.forward = true;
  if (e.code === "KeyS") keys.backward = true;
  if (e.code === "KeyA") keys.left = true;
  if (e.code === "KeyD") keys.right = true;
});

window.addEventListener("keyup", (e) => {
  if (e.code === "KeyW") keys.forward = false;
  if (e.code === "KeyS") keys.backward = false;
  if (e.code === "KeyA") keys.left = false;
  if (e.code === "KeyD") keys.right = false;
});

export function PlayerInputSystem() {
  const speed = 5;

  for (const entity of PlayerControlled) {
    const vel = Velocity.get(entity);
    if (!vel) continue;

    vel.x = 0;
    vel.z = 0;

    if (keys.forward) vel.z -= speed;
    if (keys.backward) vel.z += speed;
    if (keys.left) vel.x -= speed;
    if (keys.right) vel.x += speed;
  }
}

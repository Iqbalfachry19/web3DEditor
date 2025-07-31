// ecs/systems/Scripting.ts
import { ScriptComponent } from "../components/Script";
import { Transform } from "../components/Transform";

export function runScripts(delta: number) {
  for (const [id, code] of ScriptComponent.entries()) {
    try {
      const fn = new Function("entityId", "delta", "Transform", code);
      fn(id, delta, Transform);
    } catch (err) {
      console.warn(`Script error on entity ${id}:`, err);
    }
  }
}

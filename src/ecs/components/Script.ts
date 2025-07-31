// ecs/components/Script.ts
const scripts = new Map<number, string>();

export const ScriptComponent = {
  get: (id: number) => scripts.get(id),
  set: (id: number, script: string) => scripts.set(id, script),
  remove: (id: number) => scripts.delete(id),
  clear: () => scripts.clear(),
  entries: () => scripts.entries(),
};

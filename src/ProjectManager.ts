// ProjectManager.ts
import { Position } from "./ecs/components/Position";
import { Name } from "./ecs/components/Name";
import { MeshComponent } from "./ecs/components/Mesh";
import { Vector3 } from "three";

export function createNewProject() {
  Position.clear();
  Name.clear();
  MeshComponent.clear();

  const id = Date.now();
  Position.set(id, new Vector3(0, 0, 0));
  Name.set(id, "Cube");
  MeshComponent.set(id, {
    geometry: "box",
    color: "hotpink" ,
  });
}

export async function loadProjectFromLocal() {
  const file = await selectJsonFile();
  const content = await file.text();
  const project = JSON.parse(content);

  Position.clear();
  Name.clear();
  MeshComponent.clear();

  for (const entity of project.entities) {
    const id = entity.id;
    if (entity.components.position) Position.set(id, entity.components.position);
    if (entity.components.name) Name.set(id, entity.components.name);
    if (entity.components.mesh) MeshComponent.set(id, entity.components.mesh);
  }
}

export function saveProjectToLocal() {
  const entities = new Set([
    ...Position.keys(),
    ...Name.keys(),
    ...MeshComponent.keys(),
  ]);

  const project = {
    entities: Array.from(entities).map((id) => ({
      id,
      components: {
        position: Position.get(id),
        name: Name.get(id),
        mesh: MeshComponent.get(id),
      },
    })),
  };

  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "web3d-project.json";
  a.click();
}

async function selectJsonFile(): Promise<File> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      if (input.files && input.files[0]) resolve(input.files[0]);
    };
    input.click();
  });
}

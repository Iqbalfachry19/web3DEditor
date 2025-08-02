import { Position } from "./ecs/components/Position";
import { Name } from "./ecs/components/Name";
import { MeshComponent, type MeshData } from "./ecs/components/Mesh";
import { Vector3 } from "three";

const LOCAL_PROJECTS_KEY = "web3d-projects";

export type ProjectEntity = {
  id: number;
  components: {
    position?: { x: number; y: number; z: number };
    name?: string;
    mesh?: MeshData;
  };
};

export type ProjectData = {
  id: string;
  name: string;
  updatedAt: number;
  entities: ProjectEntity[];
};

export type ProjectMeta = {
  id: string;
  name: string;
  updatedAt: number;
};

export function createNewProject() {
  Position.clear();
  Name.clear();
  MeshComponent.clear();

  const id = Date.now();
  Position.set(id, new Vector3(0, 0, 0));
  Name.set(id, "Cube");
  MeshComponent.set(id, {
    geometry: "box",
    color: "hotpink",
  });
}

export async function loadProjectFromLocal() {
  const file = await selectJsonFile();
  const content = await file.text();
  const project: ProjectData = JSON.parse(content);
  loadProjectData(project);
}

export function saveProjectToLocal(name = "My Project") {
  const entities = new Set([
    ...Position.keys(),
    ...Name.keys(),
    ...MeshComponent.keys(),
  ]);

  const project: ProjectData = {
    id: Date.now().toString(),
    name,
    updatedAt: Date.now(),
    entities: Array.from(entities).map((id) => ({
      id,
      components: {
        position: Position.get(id)
          ? { ...Position.get(id)! }
          : undefined,
        name: Name.get(id),
        mesh: MeshComponent.get(id),
      },
    })),
  };

  const existing = getAllSavedProjects();
  const updated = [project, ...existing.filter((p) => p.id !== project.id)];
  localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(updated));

  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: "application/json",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "web3d-project.json";
  a.click();
}

export function getSavedProjects(): ProjectMeta[] {
  const saved = getAllSavedProjects();
  return saved.map(({ id, name, updatedAt }) => ({ id, name, updatedAt }));
}

export function loadProjectById(id: string): boolean {
  const projects = getAllSavedProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return false;

  loadProjectData(project);
  return true;
}

function loadProjectData(project: ProjectData) {
  Position.clear();
  Name.clear();
  MeshComponent.clear();

  for (const entity of project.entities) {
    const id = entity.id;
    const { position, name, mesh } = entity.components;

    if (position) {
      Position.set(id, new Vector3(position.x, position.y, position.z));
    }
    if (name) {
      Name.set(id, name);
    }
    if (mesh) {
      MeshComponent.set(id, mesh);
    }
  }
}

function getAllSavedProjects(): ProjectData[] {
  try {
    const raw = localStorage.getItem(LOCAL_PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ProjectData[];
  } catch {
    return [];
  }
}

function selectJsonFile(): Promise<File> {
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

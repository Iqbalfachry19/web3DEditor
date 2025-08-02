import { useEffect, useState } from "react";
import {
  createNewProject,
  loadProjectFromLocal,
  getSavedProjects,
  loadProjectById,
} from "../ProjectManager";
import "./MainMenu.css";

type ProjectMeta = {
  id: string;
  name: string;
  updatedAt: number;
};

export function MainMenu({ onProjectLoaded }: { onProjectLoaded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectMeta[]>([]);

  useEffect(() => {
    const saved = getSavedProjects();
    const sorted = saved.sort((a, b) => b.updatedAt - a.updatedAt);
    setProjects(sorted);
  }, []);

  const handleNewProject = () => {
    createNewProject();
    onProjectLoaded();
  };

  const handleLoadProject = async () => {
    setLoading(true);
    await loadProjectFromLocal();
    onProjectLoaded();
  };

  const handleLoadSavedProject = (id: string) => {
    loadProjectById(id);
    onProjectLoaded();
  };

  return (
    <div className="main-menu-container">
      <div className="main-menu-card">
        <h1 className="main-title">Web3D Editor</h1>
        <p className="main-subtitle">Design your 3D world in the browser.</p>

        <div className="button-group">
          <button onClick={handleNewProject} className="btn primary">
            🆕 New Project
          </button>

          <button
            onClick={handleLoadProject}
            className="btn secondary"
            disabled={loading}
          >
            📂 Load from File
          </button>
        </div>

        {projects.length > 0 && (
          <>
            <h2 className="recent-projects-title">Recent Projects</h2>
            <ul className="project-list">
              {projects.map((proj) => (
                <li key={proj.id} className="project-item">
                  <button
                    onClick={() => handleLoadSavedProject(proj.id)}
                    className="btn project-btn"
                  >
                    📁 {proj.name}{" "}
                    <span className="date">
                      {new Date(proj.updatedAt).toLocaleString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

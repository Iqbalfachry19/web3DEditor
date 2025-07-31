import { useState } from "react";
import { createNewProject, loadProjectFromLocal } from "./ProjectManager";
import "./MainMenu.css"; // <-- Import your CSS file

export function MainMenu({ onProjectLoaded }: { onProjectLoaded: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleNewProject = () => {
    createNewProject();
    onProjectLoaded();
  };

  const handleLoadProject = async () => {
    setLoading(true);
    await loadProjectFromLocal();
    onProjectLoaded();
  };

  return (
    <div className="main-menu">
      <h1 className="title">Web3D Editor</h1>

      <button onClick={handleNewProject} className="button new-project">
        🆕 New Project
      </button>

      <button
        onClick={handleLoadProject}
        className="button load-project"
        disabled={loading}
      >
        📂 Load Project
      </button>
    </div>
  );
}

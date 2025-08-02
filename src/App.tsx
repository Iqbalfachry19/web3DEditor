import { useState } from "react";
import { MainMenu } from "./routes/MainMenu";
import { Editor } from "./routes/Editor"; // your actual 3D editor
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Project } from "./routes/Project";
import { LandingPage } from "./routes/LandingPage";
import { DocsPage } from "./routes/Docs";
export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {started ? (
          <Route path="/main-menu" element={<Editor />} />
        ) : (
          <Route
            path="/main-menu"
            element={<MainMenu onProjectLoaded={() => setStarted(true)} />}
          />
        )}
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useState } from "react";
import { MainMenu } from "./routes/MainMenu";
import { Editor } from "./routes/Editor"; // your actual 3D editor
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Project } from "./routes/Project";
export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {started ? (
          <Route path="/" element={<Editor />} />
        ) : (
          <Route
            path="/"
            element={<MainMenu onProjectLoaded={() => setStarted(true)} />}
          />
        )}
        <Route path="/project" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}

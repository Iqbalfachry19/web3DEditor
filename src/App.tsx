import { useState } from "react";
import { MainMenu } from "./MainMenu";
import { Editor } from "./Editor"; // your actual 3D editor
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
        <Route path="/project" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

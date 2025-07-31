import { useState } from "react";
import { MainMenu } from "./MainMenu";
import { Editor } from "./Editor"; // your actual 3D editor

export default function App() {
  const [started, setStarted] = useState(false);

  return started ? (
    <Editor />
  ) : (
    <MainMenu onProjectLoaded={() => setStarted(true)} />
  );
}

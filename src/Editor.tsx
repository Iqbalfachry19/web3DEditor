import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, TransformControls } from "@react-three/drei";
import { useEffect, useState, useRef, type JSX } from "react";
import { saveProjectToLocal } from "./ProjectManager";
import * as THREE from "three";
import { createEntity } from "./ecs/Entity";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { worldTick } from "./ecs/world";
import {
  addTransform,
  getTransform,
  setTransform,
  Transform,
} from "./ecs/components/Transform";
import { Move, Rotate3D, Scaling } from "lucide-react";
import { HierarchyPanel } from "./HierarchyPanel";
import { AssetManagerPanel } from "./AssetManagerPanel";
import { InspectorPanel } from "./InspectorPanel";
import { addMesh, MeshComponent } from "./ecs/components/Mesh";

function EntityRenderer({
  id,
  onSelect,
  isPlaying,
  selectedEntityId,
  selectedRef,
}: {
  id: number;
  onSelect: (id: number) => void;
  isPlaying: boolean;
  selectedEntityId: number | null;
  selectedRef: React.MutableRefObject<THREE.Mesh | null>;
}) {
  useFrame(() => {
    if (isPlaying) {
      worldTick();
    }
  });
  const transform = getTransform(id);
  const meshData = MeshComponent.get(id);

  if (!transform || !meshData) return null;

  let geometry: JSX.Element;

  switch (meshData.geometry) {
    case "sphere":
      geometry = <sphereGeometry args={[0.5, 32, 32]} />;
      break;
    case "box":
    default:
      geometry = <boxGeometry args={[1, 1, 1]} />;
      break;
  }

  return (
    <mesh
      key={id}
      ref={id === selectedEntityId ? selectedRef : undefined}
      position={[
        transform.position.x,
        transform.position.y,
        transform.position.z,
      ]}
      rotation={[
        transform.rotation.x,
        transform.rotation.y,
        transform.rotation.z,
      ]}
      scale={[transform.scale.x, transform.scale.y, transform.scale.z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {geometry}
      <meshStandardMaterial color={meshData.color} />
    </mesh>
  );
}

export function Editor() {
  const initialized = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, forceUpdate] = useState(0);
  const [entities, setEntities] = useState<number[]>([]);
  const [newEntityShape, setNewEntityShape] = useState<"box" | "sphere">("box");

  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const selectedRef = useRef<THREE.Mesh | null>(null);
  const orbitRef = useRef<OrbitControlsImpl>(null);
  const lastPositionRef = useRef<{ x: number; y: number; z: number }>({
    x: -2,
    y: 0,
    z: 0,
  });
  const [transformMode, setTransformMode] = useState<
    "translate" | "rotate" | "scale"
  >("translate");

  useEffect(() => {
    Transform.clear();
    // Leave this empty to avoid creating entities at start
    initialized.current = true;
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🔼 Top File Menu */}
      <div
        style={{
          height: "40px",
          backgroundColor: "#111",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          fontSize: "14px",
          borderBottom: "1px solid #333",
        }}
      >
        <div style={{ marginRight: "20px", fontWeight: "bold" }}>
          Web3D Editor
        </div>
        <div style={{ marginRight: "15px", cursor: "pointer" }}>File</div>
        <div style={{ marginRight: "15px", cursor: "pointer" }}>Edit</div>
        <div style={{ marginRight: "15px", cursor: "pointer" }}>Entity</div>
        <div style={{ marginRight: "15px", cursor: "pointer" }}>Window</div>
        <div style={{ marginRight: "15px", cursor: "pointer" }}>Help</div>
        <div
          style={{ marginRight: "15px", cursor: "pointer" }}
          onClick={saveProjectToLocal}
        >
          💾 Save Project
        </div>
        <div
          style={{ marginRight: "15px", cursor: "pointer" }}
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? "⏹ Stop" : "▶️ Play"}
        </div>
      </div>

      {/* 🔽 Main Layout */}
      <div style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
        {/* 📂 Hierarchy */}
        <div
          style={{
            width: "250px",
            background: "#1e1e1e",
            color: "#fff",
            padding: "10px",
            borderRight: "1px solid #333",
          }}
        >
          <h3>Hierarchy</h3>
          <HierarchyPanel
            selectedId={selectedEntityId}
            onSelect={(id) => setSelectedEntityId(id)}
          />
        </div>

        {/* 🎥 Scene View */}
        <div style={{ flexGrow: 1, position: "relative", background: "#111" }}>
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
            {/* Pencahayaan */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={1.5}
              castShadow
            />

            {/* Sky seperti Unity */}
            <Sky
              distance={450000} // Besar cakupan
              sunPosition={[10, 10, 10]} // Arah matahari
              inclination={0.49} // Ketinggian matahari
              azimuth={0.25} // Arah matahari
              mieCoefficient={0.005}
              mieDirectionalG={0.8}
              rayleigh={1}
              turbidity={10}
            />
            <mesh
              receiveShadow
              position={[0, -1, 0]} // Sesuaikan agar cube berada di bawah
            >
              <boxGeometry args={[100, 1, 100]} />{" "}
              {/* Lebar x Tinggi x Kedalaman */}
              <meshStandardMaterial color="#555" />
            </mesh>

            {/* Kontrol kamera */}
            <OrbitControls ref={orbitRef} />

            {/* Transform Gizmo */}
            {selectedEntityId !== null && Transform.has(selectedEntityId) && (
              <TransformControls
                key={selectedEntityId} // 🔑 this ensures remount
                object={selectedRef.current!}
                mode={transformMode}
                onMouseDown={() => {
                  if (orbitRef.current) orbitRef.current.enabled = false;
                }}
                onMouseUp={() => {
                  if (orbitRef.current) orbitRef.current.enabled = true;
                }}
                onObjectChange={() => {
                  const obj = selectedRef.current;
                  if (!obj) return;

                  const transform = Transform.get(selectedEntityId);
                  if (transform) {
                    transform.position = {
                      x: obj.position.x,
                      y: obj.position.y,
                      z: obj.position.z,
                    };
                    transform.rotation = {
                      x: obj.rotation.x,
                      y: obj.rotation.y,
                      z: obj.rotation.z,
                    };
                    transform.scale = {
                      x: obj.scale.x,
                      y: obj.scale.y,
                      z: obj.scale.z,
                    };

                    setTransform(selectedEntityId, transform);
                    forceUpdate((n) => n + 1);
                  }
                }}
              />
            )}

            {/* Objek lainnya */}
            {entities.map((id) => (
              <EntityRenderer
                key={id}
                id={id}
                onSelect={(id) => setSelectedEntityId(id)}
                selectedEntityId={selectedEntityId}
                selectedRef={selectedRef}
                isPlaying={isPlaying}
              />
            ))}
          </Canvas>

          {/* ➕ Add Entity Button */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* Shape selection dropdown */}
            <select
              value={newEntityShape}
              onChange={(e) =>
                setNewEntityShape(e.target.value as "box" | "sphere")
              }
              style={{
                padding: "6px 10px",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              <option value="box">Box</option>
              <option value="sphere">Sphere</option>
            </select>

            {/* Add Entity Button */}
            <button
              style={{
                background: "#333",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "14px",
                borderRadius: "4px",
              }}
              onClick={() => {
                const id = createEntity();

                // Compute a new position offset from the last position
                const lastPos = lastPositionRef.current;
                const newPos = {
                  x: lastPos.x + 2,
                  y: 0,
                  z: lastPos.z,
                };
                lastPositionRef.current = newPos;

                // Add the entity with the chosen transform and shape
                addTransform(id, newPos);
                addMesh(id, newEntityShape, "white"); // Use newEntityShape

                // Update the entities array for rendering
                setEntities((prev) => [...prev, id]);
                forceUpdate((n) => n + 1);
              }}
            >
              + Add Entity
            </button>

            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                onClick={() => setTransformMode("translate")}
                style={{
                  padding: "6px",
                  background: transformMode === "translate" ? "#666" : "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                title="Move"
              >
                <Move size={20} />
              </button>

              <button
                onClick={() => setTransformMode("rotate")}
                style={{
                  padding: "6px",
                  background: transformMode === "rotate" ? "#666" : "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                title="Rotate"
              >
                <Rotate3D size={20} />
              </button>

              <button
                onClick={() => setTransformMode("scale")}
                style={{
                  padding: "6px",
                  background: transformMode === "scale" ? "#666" : "#333",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
                title="Scale"
              >
                <Scaling size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 🛠 Inspector */}
        <div
          style={{
            width: "300px",
            background: "#2d2d2d",
            color: "#fff",
            padding: "10px",
            borderLeft: "1px solid #333",
          }}
        >
          <h3>Inspector</h3>
          <InspectorPanel selectedEntityId={selectedEntityId} />
        </div>
      </div>
      <div style={{ height: "140px" }}>
        <AssetManagerPanel />
      </div>
    </div>
  );
}

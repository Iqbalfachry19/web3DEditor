import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Sky, TransformControls } from "@react-three/drei";
import { useEffect, useState, useRef, type JSX } from "react";
import { saveProjectToLocal } from "../ProjectManager";
import * as THREE from "three";
import { allEntities, createEntity } from "../ecs/Entity";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { worldTick } from "../ecs/world";
import {
  addTransform,
  getTransform,
  setTransform,
  Transform,
} from "../ecs/components/Transform";

import { Move, Rotate3D, Scaling } from "lucide-react";
import { HierarchyPanel } from "../HierarchyPanel";
import { AssetManagerPanel } from "../AssetManagerPanel";
import { InspectorPanel } from "../InspectorPanel";
import { addMesh, MeshComponent } from "../ecs/components/Mesh";
import { Name } from "../ecs/components/Name";
import { TextureLoader } from "three";

import { Velocity } from "../ecs/components/Velocity";
import { PlayerControlled } from "../ecs/components/PlayerControlled";
import PerspectiveGizmo from "../ecs/components/PerspectiveGizmo";

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
  const [, forceUpdate] = useState(0);
  useFrame((_, delta) => {
    if (isPlaying) {
      worldTick(delta);
      forceUpdate((v) => v + 1);
    }
  });

  const transform = getTransform(id);
  const meshData = MeshComponent.get(id);
  const TRANSPARENT_PNG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==";
  const textureUrl = meshData?.texture ?? TRANSPARENT_PNG;
  const texture = useLoader(TextureLoader, textureUrl);

  if (!transform || !meshData) return null;

  let geometry: JSX.Element;

  switch (meshData.geometry) {
    case "sphere":
      geometry = (
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={meshData.color} map={texture} />
        </mesh>
      );
      break;
    case "camera":
      geometry = (
        <group>
          <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <boxGeometry args={[0.4, 0.25, 0.25]} />
            <meshStandardMaterial color={meshData.color} map={texture} />
          </mesh>
          <mesh position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.1, 0.2, 8]} />
            <meshStandardMaterial color="black" map={texture} />
          </mesh>
        </group>
      );
      break;

    case "box":
    default:
      geometry = (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={meshData.color} map={texture} />
        </mesh>
      );
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
function EntityCamera({ entityId }: { entityId: number }) {
  const { set, camera, size } = useThree();

  useEffect(() => {
    const newCam = new THREE.PerspectiveCamera(
      50,
      size.width / size.height,
      0.4,
      1000
    );
    set({ camera: newCam });
  }, [entityId, set, size]);

  useFrame(() => {
    const transform = Transform.get(entityId);
    if (!transform) return;

    camera.position.set(
      transform.position.x,
      transform.position.y,
      transform.position.z
    );
    camera.rotation.set(
      transform.rotation.x,
      transform.rotation.y,
      transform.rotation.z
    );
  });

  return null;
}

export function Editor() {
  const initialized = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, forceUpdate] = useState(0);
  const [controlledEntities, setControlledEntities] = useState<Set<number>>(
    new Set()
  );

  const [cameraEntity, setCameraEntity] = useState<number | null>(null);
  const [entities, setEntities] = useState<number[]>([]);
  const [newEntityShape, setNewEntityShape] = useState<
    "box" | "sphere" | "camera"
  >("box");

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
  function handleAxisClick(axis: "x" | "y" | "z") {
    const camera = orbitRef.current?.object;
    if (!camera) return;

    const distance = 10;

    switch (axis) {
      case "x":
        camera.position.set(distance, 0, 0);
        break;
      case "y":
        camera.position.set(0, distance, 0);
        break;
      case "z":
        camera.position.set(0, 0, distance);
        break;
    }
    orbitRef.current?.update();
  }

  useEffect(() => {
    const cam = Array.from(allEntities).find(
      (id) => MeshComponent.get(id)?.geometry === "camera"
    );
    setCameraEntity(cam ?? null);
  }, [entities, isPlaying]);
  useEffect(() => {
    Transform.clear();
    // Leave this empty to avoid creating entities at start
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (isPlaying && selectedEntityId !== null) {
      if (!Velocity.has(selectedEntityId)) {
        Velocity.set(selectedEntityId, { x: 0, y: 0, z: 0 });
      }

      if (!Transform.has(selectedEntityId)) {
        addTransform(selectedEntityId, { x: 0, y: 0, z: 0 });
      }

      if (controlledEntities.has(selectedEntityId)) {
        PlayerControlled.add(selectedEntityId);
      } else {
        PlayerControlled.delete(selectedEntityId);
      }
    }
  }, [isPlaying, selectedEntityId, controlledEntities]);

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
          onClick={() => saveProjectToLocal()}
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
          <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
            {/* Lighting & Sky */}
            <ambientLight intensity={0.5} />

            <directionalLight
              position={[5, 10, 5]}
              intensity={1.5}
              castShadow
            />
            <Sky
              sunPosition={[10, 10, 10]}
              distance={450000}
              turbidity={10}
              rayleigh={1}
              mieCoefficient={0.005}
              mieDirectionalG={0.8}
              inclination={0.49}
              azimuth={0.25}
            />

            {/* Ground */}
            <mesh receiveShadow position={[0, -1, 0]}>
              <boxGeometry args={[100, 1, 100]} />
              <meshStandardMaterial color="#555" />
            </mesh>

            {/* 🚀 Use entity camera in play mode */}
            {isPlaying && cameraEntity && Transform.has(cameraEntity) && (
              <EntityCamera entityId={cameraEntity} />
            )}

            {/* 🎮 Orbit controls for editor */}
            {!isPlaying && <OrbitControls ref={orbitRef} />}

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
          {/* 🧭 Perspective Gizmo Overlay */}
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: "100px",
              height: "100px",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <Canvas
              orthographic
              camera={{ zoom: 80, position: [2, 2, 2], near: 0.1, far: 10 }}
              style={{ background: "rgba(0,0,0,0)", pointerEvents: "auto" }}
            >
              <ambientLight />
              <PerspectiveGizmo onClickAxis={handleAxisClick} />
            </Canvas>
          </div>

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
                setNewEntityShape(e.target.value as "box" | "sphere" | "camera")
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
              <option value="camera">Camera</option>
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
                Name.set(id, newEntityShape);
                // Add the entity with the chosen transform and shape
                addTransform(id, newPos);
                addMesh(id, newEntityShape, "white"); // Use newEntityShape
                Velocity.set(id, { x: 0, y: 0, z: 0 });

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
          <InspectorPanel
            selectedEntityId={selectedEntityId}
            onToggleControl={(enabled) => {
              setControlledEntities((prev) => {
                const updated = new Set(prev);
                if (selectedEntityId !== null) {
                  if (enabled) updated.add(selectedEntityId);
                  else updated.delete(selectedEntityId);
                }
                return updated;
              });
            }}
          />
        </div>
      </div>
      <div style={{ height: "140px" }}>
        <AssetManagerPanel />
      </div>
    </div>
  );
}

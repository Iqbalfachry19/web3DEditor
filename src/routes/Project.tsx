import { Canvas, useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { useEffect, useRef, useState, type JSX } from "react";

import * as THREE from "three";

import { worldTick } from "../ecs/world";
import { getTransform, Transform } from "../ecs/components/Transform";

import { MeshComponent } from "../ecs/components/Mesh";

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
  useFrame((_, delta) => {
    if (isPlaying) {
      worldTick(delta);
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

export function Project() {
  const initialized = useRef(false);
  const [entities] = useState<number[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const selectedRef = useRef<THREE.Mesh | null>(null);
  const [isPlaying] = useState(false);
  useEffect(() => {
    Transform.clear();
    // Leave this empty to avoid creating entities at start
    initialized.current = true;
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#111",
        zIndex: 0,
      }}
    >
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        {/* Pencahayaan */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

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
    </div>
  );
}

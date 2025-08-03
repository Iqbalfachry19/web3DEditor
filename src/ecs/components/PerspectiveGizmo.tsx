import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

type Axis = "x" | "y" | "z";

interface PerspectiveGizmoProps {
  onClickAxis?: (axis: Axis) => void;
}

export default function PerspectiveGizmo({
  onClickAxis,
}: PerspectiveGizmoProps) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!group.current) return;
    group.current.quaternion.copy(camera.quaternion).invert();
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={0.5}>
      {/* X Axis */}
      <group>
        <mesh
          position={[1.2, 0, 0]}
          rotation={[0, 0, -Math.PI / 2]}
          onClick={() => onClickAxis?.("x")}
        >
          <coneGeometry args={[0.05, 0.2, 12]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <mesh
          position={[0.6, 0, 0]}
          rotation={[0, 0, -Math.PI / 2]}
          onClick={() => onClickAxis?.("x")}
        >
          <cylinderGeometry args={[0.01, 0.01, 1.2, 8]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>

      {/* Y Axis */}
      <group>
        <mesh position={[0, 1.2, 0]} onClick={() => onClickAxis?.("y")}>
          <coneGeometry args={[0.05, 0.2, 12]} />
          <meshBasicMaterial color="green" />
        </mesh>
        <mesh position={[0, 0.6, 0]} onClick={() => onClickAxis?.("y")}>
          <cylinderGeometry args={[0.01, 0.01, 1.2, 8]} />
          <meshBasicMaterial color="green" />
        </mesh>
      </group>

      {/* Z Axis */}
      <group>
        <mesh
          position={[0, 0, 1.2]}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={() => onClickAxis?.("z")}
        >
          <coneGeometry args={[0.05, 0.2, 12]} />
          <meshBasicMaterial color="blue" />
        </mesh>
        <mesh
          position={[0, 0, 0.6]}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={() => onClickAxis?.("z")}
        >
          <cylinderGeometry args={[0.01, 0.01, 1.2, 8]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </group>
    </group>
  );
}

import { useEffect, useState } from "react";
import { Vector3 } from "three";

import { Transform } from "./ecs/components/Transform";
import { MeshComponent, setMesh } from "./ecs/components/Mesh";

interface Props {
  selectedEntityId: number | null;
}

const styles = {
  panel: {
    width: "280px",
    backgroundColor: "#1e1e1e",
    color: "white",
    fontFamily: "sans-serif",
    fontSize: "14px",
    borderLeft: "1px solid #444",
    display: "flex",
    flexDirection: "column" as const,
    height: "100%",
  },
  scrollContainer: {
    overflowY: "auto" as const,
    padding: "16px",
    flex: 1,
    // or any number you want
  },

  section: {
    marginBottom: "20px",
  },
  sectionLabel: {
    fontWeight: "bold" as const,
    marginBottom: "8px",
  },
  label: {
    display: "block",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "4px",
    fontSize: "14px",
    backgroundColor: "#2b2b2b",
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
  },
  divider: {
    margin: "16px 0",
    borderTop: "1px solid #444",
  },
};

export function InspectorPanel({ selectedEntityId }: Props) {
  const [position, setPosition] = useState<Vector3>(new Vector3());
  const [rotation, setRotation] = useState<Vector3>(new Vector3());
  const [scale, setScale] = useState<Vector3>(new Vector3(1, 1, 1));
  const [meshData, setMeshData] = useState<ReturnType<
    typeof MeshComponent.get
  > | null>(null);

  useEffect(() => {
    if (selectedEntityId === null) return;

    const transform = Transform.get(selectedEntityId);
    if (transform) {
      setPosition(
        new Vector3(
          transform.position.x,
          transform.position.y,
          transform.position.z
        )
      );
      setRotation(
        new Vector3(
          transform.rotation.x,
          transform.rotation.y,
          transform.rotation.z
        )
      );
      setScale(
        new Vector3(transform.scale.x, transform.scale.y, transform.scale.z)
      );
    }

    const mesh = MeshComponent.get(selectedEntityId);
    if (mesh) {
      setMeshData({ ...mesh });
    }
  }, [selectedEntityId]);

  const handleVectorChange =
    (setter: (v: Vector3) => void, current: Vector3, key: "x" | "y" | "z") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      const updated = current.clone();
      updated[key] = isNaN(val) ? 0 : val;
      setter(updated);
      if (selectedEntityId !== null) {
        Transform.set(selectedEntityId, {
          position,
          rotation,
          scale,
        });
      }
    };

  const handleTextureChange = (texturePath: string) => {
    if (selectedEntityId === null || !meshData) return;
    const updated = { ...meshData, texture: texturePath };
    setMesh(selectedEntityId, updated);
    setMeshData(updated);
  };

  return (
    <div style={styles.panel}>
      <div style={styles.scrollContainer}>
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Transform</div>

          {[
            { label: "Position", value: position, setter: setPosition },
            { label: "Rotation", value: rotation, setter: setRotation },
            { label: "Scale", value: scale, setter: setScale },
          ].map(({ label, value, setter }) => (
            <div key={label} style={{ marginBottom: "12px" }}>
              <div style={{ marginBottom: "4px" }}>{label}</div>
              <div style={{ display: "flex", gap: "4px" }}>
                {(["x", "y", "z"] as const).map((axis) => (
                  <div
                    key={axis}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ fontSize: "12px", color: "#ccc" }}>
                      {axis.toUpperCase()}
                    </label>
                    <input
                      type="number"
                      value={value[axis]}
                      onChange={handleVectorChange(setter, value, axis)}
                      style={{
                        width: "60px",
                        padding: "4px",
                        fontSize: "13px",
                        backgroundColor: "#2b2b2b",
                        color: "white",
                        border: "1px solid #555",
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {meshData && (
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Texture</div>
            <select
              value={meshData.texture ?? ""}
              onChange={(e) => handleTextureChange(e.target.value)}
              style={{
                ...styles.input,
                width: "100%",
                padding: "6px",
              }}
            >
              <option value="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==">
                None
              </option>
              <option value="/textures/wood.png">Wood</option>
              <option value="/textures/metal.png">Metal</option>
              <option value="/textures/marble.png">Marble</option>
            </select>

            {meshData.texture && (
              <div style={{ marginTop: "8px", textAlign: "center" }}>
                <img
                  src={meshData.texture}
                  alt="Texture preview"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "1px solid #333",
                  }}
                />
              </div>
            )}

            <div style={styles.divider} />
          </div>
        )}
      </div>
    </div>
  );
}

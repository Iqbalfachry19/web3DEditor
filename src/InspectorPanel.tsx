import { useEffect, useState } from "react";
import { Vector3 } from "three";

import { Transform } from "./ecs/components/Transform";
import { MeshComponent, setMesh } from "./ecs/components/Mesh";
import { ScriptComponent } from "./ecs/components/Script";
import { PlayerControlled } from "./ecs/components/PlayerControlled";
import { Collision } from "./ecs/components/Collision";

interface Props {
  selectedEntityId: number | null;
  onToggleControl: (enabled: boolean) => void;
  onForceUpdate?: () => void;
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
  },
  section: {
    marginBottom: "20px",
  },
  sectionLabel: {
    fontWeight: "bold" as const,
    marginBottom: "8px",
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

export function InspectorPanel({ selectedEntityId, onToggleControl, onForceUpdate }: Props) {
  const [position, setPosition] = useState(new Vector3());
  const [rotation, setRotation] = useState(new Vector3());
  const [scale, setScale] = useState(new Vector3(1, 1, 1));
  const [meshData, setMeshData] = useState<ReturnType<
    typeof MeshComponent.get
  > | null>(null);
  const [scriptCode, setScriptCode] = useState("");
  const [isControlled, setIsControlled] = useState(false);
  const [destroyOnCollision, setDestroyOnCollision] = useState(false);
  const [collisionTag, setCollisionTag] = useState("");

  useEffect(() => {
    if (selectedEntityId !== null) {
      const code = ScriptComponent.get(selectedEntityId) || "";
      setScriptCode(code);
      setIsControlled(PlayerControlled.has(selectedEntityId));

      const collision = Collision.get(selectedEntityId);
      setDestroyOnCollision(collision?.destroyOnCollision || false);
      setCollisionTag(collision?.collisionTag || "");
    }
  }, [selectedEntityId]);

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
    // Force re-render of EntityRenderer
    onForceUpdate?.();
  };

  const handleToggleControl = (checked: boolean) => {
    if (selectedEntityId === null) return;
    if (checked) {
      PlayerControlled.add(selectedEntityId);
    } else {
      PlayerControlled.delete(selectedEntityId);
    }
    setIsControlled(checked);
    onToggleControl(checked);
  };

  const handleCollisionChange = (destroy: boolean, tag: string) => {
    if (selectedEntityId === null) return;

    if (destroy || tag) {
      Collision.set(selectedEntityId, {
        destroyOnCollision: destroy,
        collisionTag: tag || undefined,
      });
    } else {
      Collision.delete(selectedEntityId);
    }

    setDestroyOnCollision(destroy);
    setCollisionTag(tag);
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
              style={{ ...styles.input }}
            >
              <option value="">None</option>
              <option value="/textures/wood.png">Wood</option>
              <option value="/textures/metal.png">Metal</option>
              <option value="/textures/marble.png">Marble</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = reader.result as string;
                  handleTextureChange(base64);
                };
                reader.readAsDataURL(file);
              }}
              style={{ marginTop: "10px", color: "white" }}
            />
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

        <div style={styles.section}>
          <div style={styles.sectionLabel}>Collision</div>
          <label style={{ display: "block", marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={destroyOnCollision}
              onChange={(e) => handleCollisionChange(e.target.checked, collisionTag)}
            />{" "}
            Destroy on Collision
          </label>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Collision Tag (optional):
            </label>
            <input
              type="text"
              value={collisionTag}
              onChange={(e) => handleCollisionChange(destroyOnCollision, e.target.value)}
              placeholder="e.g., enemy, projectile"
              style={styles.input}
            />
          </div>
          <div style={styles.divider} />
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>Custom Script (JS)</div>
          <input
            type="file"
            accept=".js"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file || selectedEntityId === null) return;
              const text = await file.text();
              setScriptCode(text);
              ScriptComponent.set(selectedEntityId, text);
            }}
          />
          <textarea
            value={scriptCode}
            onChange={(e) => {
              const val = e.target.value;
              setScriptCode(val);
              if (selectedEntityId !== null) {
                ScriptComponent.set(selectedEntityId, val);
              }
            }}
            placeholder="Paste or edit JS code here..."
            style={{ width: "100%", height: 120, marginTop: 8 }}
          />
          <label
            style={{
              marginTop: "10px",
              marginBottom: "100px",
              display: "block",
            }}
          >
            <input
              type="checkbox"
              checked={isControlled}
              onChange={(e) => handleToggleControl(e.target.checked)}
            />{" "}
            Enable Input Control
          </label>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { getName } from "./ecs/components/Name";
import { getTransform, setTransform } from "./ecs/components/Transform";

interface InspectorPanelProps {
  selectedEntityId: number | null;
}

export function InspectorPanel({ selectedEntityId }: InspectorPanelProps) {
  const initialTransform = useMemo(() => {
    return selectedEntityId !== null ? getTransform(selectedEntityId) : null;
  }, [selectedEntityId]);

  const [localTransform, setLocalTransform] = useState(initialTransform);

  useEffect(() => {
    if (selectedEntityId !== null) {
      setLocalTransform(getTransform(selectedEntityId));
    }
  }, [selectedEntityId]);

  const handleChange = (
    type: "position" | "rotation" | "scale",
    axis: "x" | "y" | "z",
    value: number
  ) => {
    if (!localTransform) return;

    const updated = {
      ...localTransform,
      [type]: {
        ...localTransform[type],
        [axis]: value,
      },
    };

    setLocalTransform(updated);
    if (selectedEntityId !== null) {
      setTransform(selectedEntityId, updated);
    }
  };

  if (selectedEntityId === null) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>Inspector</div>
        <div style={styles.empty}>No entity selected</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>Inspector</div>
      <div style={styles.header}>
        {getName(selectedEntityId) ?? `Entity ${selectedEntityId}`}
      </div>

      {localTransform &&
        (["position", "rotation", "scale"] as const).map((type) => (
          <div key={type} style={styles.section}>
            <div style={styles.sectionLabel}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            <div style={styles.row}>
              {(["x", "y", "z"] as const).map((axis) => (
                <div key={axis} style={styles.inputRow}>
                  <label style={styles.inputLabel}>{axis.toUpperCase()}</label>
                  <input
                    type="number"
                    value={localTransform[type][axis]}
                    onChange={(e) =>
                      handleChange(type, axis, parseFloat(e.target.value) || 0)
                    }
                    style={styles.input}
                  />
                </div>
              ))}
            </div>
            <div style={styles.divider} />
          </div>
        ))}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#1e1e1e",
    color: "#f0f0f0",
    padding: "12px",
    width: "300px",
    minWidth: "300px",
    fontFamily: "sans-serif",
    borderRadius: "6px",
    fontSize: "13px",
    border: "1px solid #333",
  },
  title: {
    fontSize: "15px",
    fontWeight: 600,
    marginBottom: "10px",
    color: "#fff",
  },
  header: {
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#ccc",
    borderBottom: "1px solid #444",
    paddingBottom: "6px",
  },
  section: {
    marginBottom: "12px",
  },
  sectionLabel: {
    fontWeight: 600,
    fontSize: "13px",
    marginBottom: "6px",
    color: "#aaa",
  },
  row: {
    display: "flex",
    gap: "6px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flex: 1,
  },
  inputLabel: {
    width: "14px",
    color: "#bbb",
    fontWeight: "bold",
  },
  input: {
    width: "50px", // Ubah dari flex: 1 ke width tetap
    padding: "2px 6px",
    fontSize: "13px",
    backgroundColor: "#2b2b2b",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "3px",
    outline: "none",
  },

  divider: {
    height: "1px",
    backgroundColor: "#333",
    marginTop: "8px",
  },
  empty: {
    fontStyle: "italic",
    color: "#888",
    paddingTop: "6px",
  },
} as const;

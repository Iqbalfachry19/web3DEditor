import { getTransform, setTransform } from "./ecs/components/Transform";

interface InspectorPanelProps {
  selectedEntityId: number | null;
}

export function InspectorPanel({ selectedEntityId }: InspectorPanelProps) {
  if (selectedEntityId === null) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>Inspector</div>
        <em style={{ color: "#aaa" }}>No entity selected</em>
      </div>
    );
  }

  const transform = getTransform(selectedEntityId);

  const handleChange = (
    type: "position" | "rotation" | "scale",
    axis: "x" | "y" | "z",
    value: number
  ) => {
    if (transform) {
      const updated = {
        ...transform,
        [type]: {
          ...transform[type],
          [axis]: value,
        },
      };
      setTransform(selectedEntityId, updated);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Inspector</div>
      <div style={styles.sectionTitle}>Entity {selectedEntityId}</div>

      {transform && (
        <>
          {(["position", "rotation", "scale"] as const).map((type) => (
            <div key={type} style={styles.section}>
              <div style={styles.sectionTitle}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
              <div style={styles.row}>
                {(["x", "y", "z"] as const).map((axis) => (
                  <div key={axis} style={styles.inputGroup}>
                    <label style={styles.label}>{axis.toUpperCase()}</label>
                    <input
                      type="number"
                      value={transform[type][axis]}
                      onChange={(e) =>
                        handleChange(
                          type,
                          axis,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      style={styles.input}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#2d2d2d",
    color: "#f0f0f0",
    padding: "16px",
    width: "100%",
    boxSizing: "border-box" as const,
    fontFamily: "Segoe UI, sans-serif",
    borderRadius: "4px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#fff",
  },
  section: {
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#dcdcdc",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: "12px",
    marginBottom: "4px",
    color: "#ccc",
  },
  input: {
    width: "100%",
    padding: "4px 6px",
    fontSize: "13px",
    backgroundColor: "#3a3a3a",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "3px",
    outline: "none",
  },
};

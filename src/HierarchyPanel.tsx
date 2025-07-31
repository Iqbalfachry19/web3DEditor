import { allEntities } from "./ecs/Entity";
import { Name } from "./ecs/components/Name";

interface HierarchyPanelProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function HierarchyPanel({ selectedId, onSelect }: HierarchyPanelProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#1e1e1e",
        color: "#fff",
        borderRight: "1px solid #333",
        fontFamily: "sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#2d2d2d",
          padding: "6px 10px",
          borderBottom: "1px solid #333",
          fontSize: "14px",
        }}
      >
        <strong>Hierarchy</strong>
      </div>

      {/* Entity list */}
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "6px 0",
        }}
      >
        {Array.from(allEntities).map((id, index) => {
          const name = Name.get(id) ?? `Entity ${id}`;
          return (
            <div
              key={id}
              onClick={() => onSelect(id)}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                background: selectedId === id ? "#444" : "transparent",
                color: selectedId === id ? "#fff" : "#ccc",
                fontSize: "13px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  selectedId === id ? "#444" : "#2a2a2a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  selectedId === id ? "#444" : "transparent")
              }
            >
              🧱 {index + 1}. {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

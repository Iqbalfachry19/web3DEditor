import { useState } from "react";
import { allEntities } from "./ecs/Entity";
import { Name } from "./ecs/components/Name";

interface HierarchyPanelProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

export function HierarchyPanel({ selectedId, onSelect, onDelete }: HierarchyPanelProps) {
  const [contextMenu, setContextMenu] = useState<{
    entityId: number;
    x: number;
    y: number;
  } | null>(null);

  const handleRightClick = (e: React.MouseEvent, entityId: number) => {
    e.preventDefault();
    setContextMenu({
      entityId,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDelete = (entityId: number) => {
    onDelete(entityId);
    setContextMenu(null);
  };

  const handleClickOutside = () => {
    setContextMenu(null);
  };

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
        position: "relative",
      }}
      onClick={handleClickOutside}
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
              onClick={(e) => {
                e.stopPropagation();
                onSelect(id);
              }}
              onContextMenu={(e) => handleRightClick(e, id)}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                background: selectedId === id ? "#444" : "transparent",
                color: selectedId === id ? "#fff" : "#ccc",
                fontSize: "13px",
                transition: "background 0.2s",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
              <span>🧱 {index + 1}. {name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(id);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#ff6b6b";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#ff6b6b";
                  e.currentTarget.style.opacity = "0.7";
                }}
                title="Delete Entity"
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            background: "#2d2d2d",
            border: "1px solid #555",
            borderRadius: "4px",
            padding: "4px 0",
            zIndex: 1000,
            minWidth: "120px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <button
            onClick={() => handleDelete(contextMenu.entityId)}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              color: "#ff6b6b",
              padding: "8px 12px",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "13px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ff6b6b";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ff6b6b";
            }}
          >
            🗑️ Delete Entity
          </button>
        </div>
      )}
    </div>
  );
}

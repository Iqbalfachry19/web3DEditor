// AssetManagerPanel.tsx
import { useState } from "react";

export function AssetManagerPanel() {
  const [activeTab, setActiveTab] = useState<"assets" | "console">("assets");

  const assetFolders = ["Models", "Textures", "Audio"];
  const dummyAssets = [
    { name: "CubeModel.glb", type: "Model", folder: "Models" },
    { name: "PlayerTexture.png", type: "Texture", folder: "Textures" },
    { name: "ExplosionSound.mp3", type: "Audio", folder: "Audio" },
  ];

  return (
    <div
      style={{
        height: "100%",
        background: "#181818",
        borderTop: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        fontSize: "13px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Tab Switcher */}
      <div
        style={{
          padding: "6px 12px",
          borderBottom: "1px solid #333",
          background: "#222",
          display: "flex",
          gap: "12px",
        }}
      >
        <strong
          style={{
            cursor: "pointer",
            color: activeTab === "assets" ? "#fff" : "#888",
          }}
          onClick={() => setActiveTab("assets")}
        >
          Assets
        </strong>
        <strong
          style={{
            cursor: "pointer",
            color: activeTab === "console" ? "#fff" : "#888",
          }}
          onClick={() => setActiveTab("console")}
        >
          Console
        </strong>
      </div>

      {activeTab === "assets" && (
        <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          {/* Folder list */}
          <div
            style={{
              width: "120px",
              borderRight: "1px solid #333",
              background: "#1f1f1f",
              padding: "8px",
              overflowY: "auto",
            }}
          >
            <strong style={{ display: "block", marginBottom: "8px" }}>
              Folders
            </strong>
            {assetFolders.map((folder, i) => (
              <div key={i} style={{ marginBottom: "6px", cursor: "pointer" }}>
                📁 {folder}
              </div>
            ))}
          </div>

          {/* Assets display */}
          <div
            style={{
              flexGrow: 1,
              padding: "8px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              overflowY: "auto",
            }}
          >
            {dummyAssets.map((asset, index) => (
              <div
                key={index}
                style={{
                  background: "#2a2a2a",
                  padding: "8px",
                  borderRadius: "4px",
                  minWidth: "100px",
                  textAlign: "center",
                  border: "1px solid #444",
                }}
              >
                📦 {asset.name}
                <div style={{ fontSize: "11px", color: "#999" }}>
                  {asset.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "console" && (
        <div
          style={{
            flexGrow: 1,
            background: "#111",
            padding: "6px 12px",
            fontSize: "12px",
            color: "#0f0",
            overflowY: "auto",
          }}
        >
          <div>[Console] Asset Manager initialized.</div>
          <div>[Console] 3 assets loaded.</div>
        </div>
      )}
    </div>
  );
}

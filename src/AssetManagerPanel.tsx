// AssetManagerPanel.tsx
export function AssetManagerPanel() {
  const dummyAssets = [
    { name: "CubeModel.glb", type: "Model" },
    { name: "PlayerTexture.png", type: "Texture" },
    { name: "ExplosionSound.mp3", type: "Audio" },
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
      <div
        style={{
          padding: "6px 12px",
          borderBottom: "1px solid #333",
          background: "#222",
        }}
      >
        <strong>Assets</strong>
      </div>

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
            <div style={{ fontSize: "11px", color: "#999" }}>{asset.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

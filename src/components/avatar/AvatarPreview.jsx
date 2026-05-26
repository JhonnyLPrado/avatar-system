export default function AvatarPreview({ avatarUrl, seed, style, onExport, onSave, onAuto, exportMsg, activeTab }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
      <div style={{ width: "200px", height: "200px", margin: "0 auto 20px", borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(167,139,250,0.4)", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%" }} />
      </div>

      <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "4px" }}>Estilo: <span style={{ color: "#a78bfa" }}>{style}</span></p>
      <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "20px" }}>Seed: <span style={{ color: "#60a5fa" }}>{seed}</span></p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={onSave} style={{
          padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
          fontWeight: "600", fontSize: "14px"
        }}>
          💾 Guardar Avatar
        </button>

        <button onClick={onExport} style={{
          padding: "10px", borderRadius: "8px", border: "1px solid rgba(167,139,250,0.3)",
          cursor: "pointer", background: "transparent", color: "#a78bfa",
          fontWeight: "600", fontSize: "14px"
        }}>
          {exportMsg || "⬇️ Exportar SVG"}
        </button>

        {activeTab === "auto" && (
          <button onClick={onAuto} style={{
            padding: "10px", borderRadius: "8px", border: "1px solid rgba(96,165,250,0.3)",
            cursor: "pointer", background: "transparent", color: "#60a5fa",
            fontWeight: "600", fontSize: "14px"
          }}>
            🎲 Generar otro
          </button>
        )}
      </div>
    </div>
  )
}

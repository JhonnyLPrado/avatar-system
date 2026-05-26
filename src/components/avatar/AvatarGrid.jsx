export default function AvatarGrid({ avatars, onLoad, onDelete, onTabChange }) {
  if (avatars.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>🖼️</p>
        <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "24px" }}>No tienes avatares guardados aún</p>
        <button onClick={() => onTabChange("manual")} style={{
          padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", fontWeight: "600"
        }}>
          Crear mi primer avatar
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>
          🖼️ Galería ({avatars.length})
        </h2>
        <button onClick={() => onTabChange("manual")} style={{
          padding: "8px 16px", borderRadius: "8px", border: "1px solid rgba(167,139,250,0.3)",
          cursor: "pointer", background: "transparent", color: "#a78bfa", fontSize: "13px", fontWeight: "600"
        }}>
          + Crear nuevo
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
        {avatars.map(av => (
          <div key={av.id} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "16px", textAlign: "center",
            transition: "border-color 0.2s", cursor: "pointer"
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            <div style={{ width: "80px", height: "80px", margin: "0 auto 12px", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(167,139,250,0.3)" }}>
              <img src={av.url} alt="avatar" style={{ width: "100%", height: "100%" }} />
            </div>
            <p style={{ color: "#a78bfa", fontSize: "11px", marginBottom: "2px" }}>{av.style}</p>
            <p style={{ color: "#6b7280", fontSize: "10px", marginBottom: "12px" }}>{av.seed}</p>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => onLoad(av)} style={{
                flex: 1, padding: "6px", borderRadius: "6px", border: "none", cursor: "pointer",
                background: "rgba(124,58,237,0.3)", color: "#a78bfa", fontSize: "11px", fontWeight: "600"
              }}>Editar</button>
              <button onClick={() => onDelete(av.id)} style={{
                padding: "6px 10px", borderRadius: "6px", border: "none", cursor: "pointer",
                background: "rgba(239,68,68,0.2)", color: "#f87171", fontSize: "11px"
              }}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const card = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  padding: "24px",
}

const label = {
  display: "block",
  color: "#9ca3af",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "8px",
}

const input = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(0,0,0,0.3)",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
}

export default function AvatarControls({ style, setStyle, seed, setSeed, bg, setBg, styles, activeTab, onAuto }) {
  return (
    <div style={card}>
      <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>
        {activeTab === "manual" ? "✏️ Editar Avatar" : "🎲 Generación Automática"}
      </h2>

      {activeTab === "auto" ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "15px" }}>
            Genera avatares aleatorios con estilo, seed y color únicos cada vez.
          </p>
          <button onClick={onAuto} style={{
            padding: "14px 32px", borderRadius: "12px", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff",
            fontWeight: "700", fontSize: "16px", letterSpacing: "0.05em"
          }}>
            🎲 GENERAR ALEATORIO
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          <div>
            <label style={label}>Estilo de Avatar</label>
            <select value={style} onChange={e => setStyle(e.target.value)} style={input}>
              {styles.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={label}>Seed (nombre o texto)</label>
            <input
              type="text"
              value={seed}
              onChange={e => setSeed(e.target.value)}
              placeholder="Escribe algo..."
              style={input}
            />
            <p style={{ color: "#4b5563", fontSize: "11px", marginTop: "6px" }}>
              El mismo seed siempre genera el mismo avatar
            </p>
          </div>

          <div>
            <label style={label}>Color de Fondo</label>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input type="color" value={bg} onChange={e => setBg(e.target.value)}
                style={{ width: "48px", height: "40px", borderRadius: "8px", border: "none", cursor: "pointer", background: "transparent" }}
              />
              <input type="text" value={bg} onChange={e => setBg(e.target.value)} style={{ ...input, flex: 1 }} />
            </div>
          </div>

          <div>
            <label style={label}>Vista previa URL</label>
            <div style={{ ...input, fontSize: "11px", color: "#4b5563", wordBreak: "break-all", cursor: "default" }}>
              {`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

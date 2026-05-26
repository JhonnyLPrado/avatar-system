import { useState, useRef } from "react"
import Avatar3DViewer from "./Avatar3DViewer.jsx"

const SUBDOMAIN = "demo"

export default function ReadyPlayerMe() {
  const [step, setStep] = useState("editor")
  const [avatarUrl, setAvatarUrl] = useState(null)
  const iframeRef = useRef(null)

  const iframeSrc = `https://${SUBDOMAIN}.readyplayer.me/avatar?frameApi&clearCache`

  const handleMessage = (e) => {
    const json = parse(e.data)
    if (!json) return
    if (json.source !== "readyplayerme") return

    if (json.eventName === "v1.avatar.exported") {
      const url = json.data.url + "?morphTargets=ARKit&textureAtlas=1024"
      setAvatarUrl(url)
      setStep("viewer")
      // setLoading(false)
    }
    if (json.eventName === "v1.frame.ready") {
      iframeRef.current?.contentWindow.postMessage(
        JSON.stringify({ target: "readyplayerme", type: "subscribe", eventName: "v1.avatar.exported" }),
        "*"
      )
    }
  }

  function parse(s) {
    try { return JSON.parse(s) } catch { return null }
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700" }}>🧍 Avatar 3D</h2>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Powered by Ready Player Me</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["editor", "viewer"].map(s => (
            <button key={s} onClick={() => setStep(s)} style={{
              padding: "6px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
              fontSize: "12px", fontWeight: "600",
              background: step === s ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "rgba(255,255,255,0.05)",
              color: step === s ? "#fff" : "#9ca3af"
            }}>
              {s === "editor" ? "🎨 Editor" : "👁️ Ver 3D"}
            </button>
          ))}
        </div>
      </div>

      {step === "editor" && (
        <div>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "12px" }}>
            Personaliza tu avatar 3D y haz clic en <strong style={{ color: "#a78bfa" }}>Save</strong> para cargarlo.
          </p>
          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(167,139,250,0.2)" }}>
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              style={{ width: "100%", height: "500px", border: "none", display: "block" }}
              allow="camera *; microphone *; clipboard-write"
              onLoad={() => window.addEventListener("message", handleMessage)}
            />
          </div>
        </div>
      )}

      {step === "viewer" && (
        <div>
          {avatarUrl ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1, background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "10px 14px" }}>
                  <p style={{ color: "#4b5563", fontSize: "10px", marginBottom: "2px" }}>URL del modelo GLB</p>
                  <p style={{ color: "#a78bfa", fontSize: "11px", wordBreak: "break-all" }}>{avatarUrl.split("?")[0]}</p>
                </div>
                <button onClick={() => {
                  const a = document.createElement("a")
                  a.href = avatarUrl
                  a.download = "avatar.glb"
                  a.click()
                }} style={{
                  padding: "10px 16px", borderRadius: "8px", border: "1px solid rgba(167,139,250,0.3)",
                  cursor: "pointer", background: "transparent", color: "#a78bfa", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap"
                }}>
                  ⬇️ GLB
                </button>
              </div>
              <Avatar3DViewer avatarUrl={avatarUrl} />
              <p style={{ color: "#4b5563", fontSize: "11px", textAlign: "center", marginTop: "8px" }}>
                Arrastra para rotar · Scroll para zoom
              </p>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: "40px", marginBottom: "12px" }}>🧍</p>
              <p style={{ color: "#6b7280", marginBottom: "20px" }}>Aún no has creado un avatar 3D</p>
              <button onClick={() => setStep("editor")} style={{
                padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed, #2563eb)", color: "#fff", fontWeight: "600"
              }}>
                Ir al editor
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

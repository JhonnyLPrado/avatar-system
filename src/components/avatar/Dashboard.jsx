import { useState, useCallback } from "react"
import AvatarPreview from "./AvatarPreview.jsx"
import AvatarControls from "./AvatarControls.jsx"
import AvatarGrid from "./AvatarGrid.jsx"
import ReadyPlayerMe from "./ReadyPlayerMe.jsx"
import Background3D from "../layout/Background3D.jsx"

const STYLES = [
  { id: "adventurer", label: "Adventurer" },
  { id: "avataaars", label: "Avataaars" },
  { id: "bottts", label: "Robots" },
  { id: "fun-emoji", label: "Emoji" },
  { id: "lorelei", label: "Lorelei" },
  { id: "micah", label: "Micah" },
  { id: "pixel-art", label: "Pixel Art" },
]

function randomSeed() {
  return Math.random().toString(36).substring(2, 10)
}

export default function Dashboard() {
  const [style, setStyle] = useState("avataaars")
  const [seed, setSeed] = useState("jhonn")
  const [bg, setBg] = useState("#1a1a2e")
  const [savedAvatars, setSavedAvatars] = useState([])
  const [activeTab, setActiveTab] = useState("manual")
  const [exportMsg, setExportMsg] = useState("")

  const avatarUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=${bg.replace("#", "")}`

  const handleAutoGenerate = useCallback(() => {
    setSeed(randomSeed())
    setStyle(STYLES[Math.floor(Math.random() * STYLES.length)].id)
    setBg("#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"))
  }, [])

  const handleSave = () => {
    const newAvatar = { id: Date.now(), style, seed, bg, url: avatarUrl }
    setSavedAvatars(prev => [newAvatar, ...prev])
  }

  const handleExport = async () => {
    try {
      const res = await fetch(avatarUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `avatar-${seed}.svg`
      a.click()
      URL.revokeObjectURL(url)
      setExportMsg("Exportado!")
      setTimeout(() => setExportMsg(""), 2000)
    } catch {
      setExportMsg("Error al exportar")
    }
  }

  const handleLoadSaved = (av) => {
    setStyle(av.style)
    setSeed(av.seed)
    setBg(av.bg)
    setActiveTab("manual")
  }

  const handleDeleteSaved = (id) => {
    setSavedAvatars(prev => prev.filter(a => a.id !== id))
  }

  const tabs = [
    { id: "manual", label: "✏️ Manual" },
    { id: "auto",   label: "🎲 Auto" },
    { id: "galeria",label: "🖼️ Galeria" },
    { id: "3d",     label: "🧍 3D" },
  ]

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <Background3D />
      <div style={{ position: "relative", zIndex: 1, padding: "24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Avatar System
            </h1>
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "2px" }}>DiceBear API + Ready Player Me</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: "600",
                background: activeTab === tab.id ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "rgba(255,255,255,0.05)",
                color: activeTab === tab.id ? "#fff" : "#9ca3af", transition: "all 0.2s"
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        {activeTab === "3d" ? (
          <ReadyPlayerMe />
        ) : activeTab === "galeria" ? (
          <AvatarGrid avatars={savedAvatars} onLoad={handleLoadSaved} onDelete={handleDeleteSaved} onTabChange={setActiveTab} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "24px", alignItems: "start" }}>
            <AvatarPreview avatarUrl={avatarUrl} seed={seed} style={style} onExport={handleExport} onSave={handleSave} onAuto={handleAutoGenerate} exportMsg={exportMsg} activeTab={activeTab} />
            <AvatarControls style={style} setStyle={setStyle} seed={seed} setSeed={setSeed} bg={bg} setBg={setBg} styles={STYLES} activeTab={activeTab} onAuto={handleAutoGenerate} />
          </div>
        )}

      </div>
    </div>
  )
}

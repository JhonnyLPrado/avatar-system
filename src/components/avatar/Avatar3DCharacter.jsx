import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { ALL_MODELS } from "./models.js"

export default function Avatar3DCharacter() {
  const mountRef    = useRef(null)
  const rendRef     = useRef(null)
  const sceneRef    = useRef(null)
  const cameraRef   = useRef(null)
  const ctrlRef     = useRef(null)
  const mixerRef    = useRef(null)
  const modelRef    = useRef(null)
  const clockRef    = useRef(new THREE.Clock())
  const frameRef    = useRef(null)
  const loaderRef   = useRef(new GLTFLoader())

  const [selected,   setSelected]   = useState(ALL_MODELS[0])
  const [loading,    setLoading]    = useState(false)
  const [loadErr,    setLoadErr]    = useState("")
  const [animNames,  setAnimNames]  = useState([])
  const [activeAnim, setActiveAnim] = useState(0)
  const actionsRef = useRef([])

  const [search,    setSearch]    = useState("")
  const [setFiltered]  = useState(ALL_MODELS)

  // Filter models by search
  const filtered = search ? ALL_MODELS.filter(m => m.label.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search.toLowerCase())) : ALL_MODELS

  // Init scene ONCE
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)
    scene.fog = new THREE.Fog(0x0a0a0f, 10, 30)
    sceneRef.current = scene

    const w = mount.clientWidth, h = mount.clientHeight
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 1.5, 4)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.outputColorSpace = THREE.SRGBColorSpace
    rendRef.current = renderer
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const dir = new THREE.DirectionalLight(0xa78bfa, 2)
    dir.position.set(5, 10, 5); dir.castShadow = true
    scene.add(dir)
    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.8)
    fillLight.position.set(-5, 2, -5)
    scene.add(fillLight)

    const pointLight = new THREE.PointLight(0x7c3aed, 1.5, 10)
    pointLight.position.set(0, 3, 2)
    scene.add(pointLight)

    const grid = new THREE.GridHelper(20, 20, 0x7c3aed, 0x1a1a2e)
    grid.position.y = -1.5
    scene.add(grid)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.05
    controls.minDistance = 1.5;   controls.maxDistance = 12
    controls.target.set(0, 0.5, 0)
    ctrlRef.current = controls

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      mixerRef.current?.update(clockRef.current.getDelta())
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      camera.aspect = w / h; camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("resize", onResize)
      controls.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  // Load model on selection change
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    // Remove old model
    if (modelRef.current) {
      scene.remove(modelRef.current)
      modelRef.current.traverse(c => {
        if (c.isMesh) {
          c.geometry?.dispose()
          const mats = Array.isArray(c.material) ? c.material : [c.material]
          mats.forEach(m => m?.dispose())
        }
      })
      modelRef.current = null
    }
    mixerRef.current?.stopAllAction()
    mixerRef.current = null
    actionsRef.current = []
    setAnimNames([])
    setActiveAnim(0)
    setLoadErr("")
    setLoading(true)

    loaderRef.current.load(
      selected.url,
      (gltf) => {
        const model = gltf.scene
        model.scale.setScalar(selected.scale)
        model.position.set(0, selected.y, 0)
        model.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true } })
        scene.add(model)
        modelRef.current = model

        if (gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model)
          mixerRef.current = mixer
          setAnimNames(gltf.animations.map(a => a.name))
          actionsRef.current = gltf.animations.map(clip => mixer.clipAction(clip))
          actionsRef.current[0].play()
          setActiveAnim(0)
        }
        setLoading(false)
      },
      undefined,
      (err) => { setLoadErr("No se pudo cargar el modelo"); setLoading(false); console.error(err) }
    )
  }, [selected])

  const switchAnim = (idx) => {
    actionsRef.current.forEach(a => a.stop())
    actionsRef.current[idx]?.play()
    setActiveAnim(idx)
  }

  const selectModel = (m) => {
    setSelected(m)
    setSearch("")
    setFiltered(ALL_MODELS)
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: "20px" }}>

      {/* Viewer */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", overflow: "hidden", position: "relative" }}>
        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, background: "rgba(10,10,15,0.85)", borderRadius: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid rgba(124,58,237,0.3)", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ color: "#a78bfa", fontSize: "13px" }}>Cargando {selected.label}...</p>
            </div>
          </div>
        )}
        {loadErr && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", zIndex: 10 }}>
            <p style={{ color: "#f87171", fontSize: "14px" }}>⚠️ {loadErr}</p>
          </div>
        )}
        <div ref={mountRef} style={{ width: "100%", height: "500px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 16px" }}>
          <p style={{ color: "#4b5563", fontSize: "11px" }}>Arrastra para rotar · Scroll para zoom</p>
          <p style={{ color: "#6b7280", fontSize: "11px" }}>{selected.label}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>

      {/* Panel derecho */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto", maxHeight: "560px", paddingRight: "2px" }}>

        {/* Buscador interno */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px" }}>
          <p style={{ color: "#9ca3af", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>🔍 Buscar modelo</p>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="robot, fox, duck, tokyo..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
          />
          {search && filtered.length === 0 && (
            <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "8px" }}>Sin resultados para "{search}"</p>
          )}
        </div>

        {/* Lista de modelos */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px" }}>
          <p style={{ color: "#9ca3af", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
            Modelos ({filtered.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {filtered.map(m => (
              <button key={m.id} onClick={() => selectModel(m)} style={{
                padding: "9px 12px", borderRadius: "8px", border: "none", cursor: "pointer", textAlign: "left",
                background: selected.id === m.id ? "linear-gradient(135deg,#7c3aed,#2563eb)" : "rgba(255,255,255,0.03)",
                color: selected.id === m.id ? "#fff" : "#9ca3af",
                fontSize: "13px", fontWeight: selected.id === m.id ? "600" : "400", transition: "all 0.2s"
              }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Animaciones */}
        {animNames.length > 0 && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px" }}>
            <p style={{ color: "#9ca3af", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
              Animaciones ({animNames.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {animNames.map((name, idx) => (
                <button key={idx} onClick={() => switchAnim(idx)} style={{
                  padding: "8px 12px", borderRadius: "8px", border: "none", cursor: "pointer", textAlign: "left",
                  background: activeAnim === idx ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.03)",
                  color: activeAnim === idx ? "#a78bfa" : "#6b7280",
                  fontSize: "12px", fontWeight: activeAnim === idx ? "600" : "400", transition: "all 0.2s"
                }}>
                  {activeAnim === idx ? "▶ " : "○ "}{name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

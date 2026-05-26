import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function Background3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const count = 1500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80
      const color = Math.random() > 0.5 ? new THREE.Color(0x7c3aed) : new THREE.Color(0x2563eb)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.8 })
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    const torusGeo = new THREE.TorusGeometry(8, 0.5, 16, 100)
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.15 })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.position.set(10, -5, -20)
    scene.add(torus)

    const icoGeo = new THREE.IcosahedronGeometry(3, 0)
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.12 })
    const ico = new THREE.Mesh(icoGeo, icoMat)
    ico.position.set(-12, 4, -15)
    scene.add(ico)

    camera.position.z = 20

    let frame
    const animate = () => {
      frame = requestAnimationFrame(animate)
      particles.rotation.y += 0.0005
      particles.rotation.x += 0.0002
      torus.rotation.x += 0.003
      torus.rotation.y += 0.002
      ico.rotation.x += 0.004
      ico.rotation.z += 0.003
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", handleResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={mountRef} style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      zIndex: 0, background: "linear-gradient(135deg, #0a0a0f 0%, #0f0a1e 50%, #0a0f1e 100%)"
    }} />
  )
}

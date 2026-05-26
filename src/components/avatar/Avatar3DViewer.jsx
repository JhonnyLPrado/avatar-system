import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei"

function AvatarModel({ url }) {
  const { scene } = useGLTF(url)
  return (
    <Center>
      <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
    </Center>
  )
}

function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#7c3aed" wireframe />
    </mesh>
  )
}

export default function Avatar3DViewer({ avatarUrl }) {
  if (!avatarUrl) return null
  return (
    <div style={{ width: "100%", height: "400px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(167,139,250,0.3)" }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<LoadingBox />}>
          <AvatarModel url={avatarUrl} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={1.5} maxDistance={5} />
      </Canvas>
    </div>
  )
}

import { Canvas } from "@react-three/fiber"
import { useState, Suspense } from "react"
import City from "./components/City"
import CameraWalkthrough from "./components/CameraWalkthrough"
import { OrbitControls, Environment, Stars, useProgress } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

// 1. NATIVE LOADER COMPONENT (Pure HTML)
function FullScreenLoader() {
  const { progress } = useProgress()
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'black', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', zIndex: 100, color: 'white'
    }}>
      <h2 style={{ letterSpacing: '5px' }}>CITY OF THE FUTURE</h2>
      <div style={{ width: '250px', height: '2px', background: '#222', margin: '20px 0' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#066b84', boxShadow: '0 0 10px #066b84' }} />
      </div>
      <p>{progress.toFixed(0)}% Initializing Systems...</p>
    </div>
  )
}

export default function App() {
  const [selectedPos, setSelectedPos] = useState(null)
  const { progress } = useProgress()
  const isReady = progress === 100

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: 'relative' }}>

      {/* 2. SHOW LOADER ONLY UNTIL READY */}
      {!isReady && <FullScreenLoader />}

      <Canvas camera={{ position: [0, 70, 230], fov: 45, near: 0.1, far: 5000 }}>
        <color attach="background" args={['#010407']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" castShadow />
        <Environment preset="night" />

        {/* 3. ONLY SHOW CITY ONCE READY */}
        <Suspense fallback={null}>
          <group visible={isReady}>
            <Stars radius={300} depth={50} count={50000} factor={8} saturation={10} fade={true} speed={2.5} />

            <EffectComposer>
              <Bloom intensity={0.5} luminanceThreshold={0.1} mipmapBlur />
            </EffectComposer>

            <City onSelectDome={(pos) => setSelectedPos(pos)} />

            <CameraWalkthrough target={selectedPos} active={Boolean(selectedPos)} />
          </group>
        </Suspense>

        <OrbitControls makeDefault enableDamping={true} maxPolarAngle={Math.PI / 2.1} maxDistance={1000} />
      </Canvas>
    </div>
  )
}
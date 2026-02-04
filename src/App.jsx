import { Canvas } from "@react-three/fiber"
import { useState, Suspense } from "react"
import City from "./components/City"
import CameraWalkthrough from "./components/CameraWalkthrough"
import { OrbitControls, Environment } from "@react-three/drei"
import { Stars, Sparkles } from "@react-three/drei"
// For the Neon Glow Effect
import { EffectComposer, Bloom } from "@react-three/postprocessing"

export default function App() {
  const [selectedPos, setSelectedPos] = useState(null)

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <Canvas camera={{ position: [0, 70, 230], fov: 45, near: 0.1, far: 5000 }}>
        {/* 1. Black Background + Neon Teal Fog */}
        <color attach="background" args={['#003366']} />

        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" castShadow />


        <Environment preset="night" />


        <Suspense fallback={null}>
          <Stars
            radius={300}          // How far the stars are from the center
            depth={50}            // How thick the "shell" of stars is
            count={50000}         // Increase significantly for the dense look of img 2
            factor={8}            // Keep factor low to keep stars tiny and sharp like img 2
            saturation={10}       // High saturation to bring out the teal/cyan tones
            fade={true}           // Helps create that misty, deep-space feel
            speed={2.5}           // Subtle twinkling
          />



          {/* 2. Bloom makes the Teal Sparkles and Stars "Glow" */}
          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.1}
              mipmapBlur
            />
          </EffectComposer>

          <City onSelectDome={(pos) => setSelectedPos(pos)} />

          <CameraWalkthrough
            target={selectedPos}
            active={Boolean(selectedPos)}
          />


        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping={true}
          maxPolarAngle={Math.PI / 2.1}
          maxDistance={1000}
        />
      </Canvas>
    </div>
  )
}
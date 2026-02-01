import { Canvas } from "@react-three/fiber"
import { useState } from "react"
import City from "./components/City"
import CameraWalkthrough from "./components/CameraWalkthrough"

import { OrbitControls, Environment } from "@react-three/drei"

// ... (rest of imports)

export default function App() {
  const [selectedPos, setSelectedPos] = useState(null)

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* 1. Add 'far' to the camera to increase its 'eyesight' range */}
      <Canvas camera={{ position: [0, 70, 230], fov: 45, near: 0.1, far: 3000 }}>
        <color attach="background" args={['#031010']} />
        <Environment preset="city" />
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />

        {/* Navigation Controls */}
        <OrbitControls
          makeDefault
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={10}

          maxDistance={500}
        />

        <City onSelectDome={(pos) => setSelectedPos(pos)} />

        <CameraWalkthrough
          target={selectedPos}
          active={Boolean(selectedPos)}
        />
      </Canvas>
    </div>
  )
}
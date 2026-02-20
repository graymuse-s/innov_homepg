import { Canvas } from "@react-three/fiber";
import { useState, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Perf } from "r3f-perf";
import City, { CityLoaderScreen } from "./components/City";
import CameraWalkthrough from "./components/CameraWalkthrough";
import { OrbitControls, Environment, Stars, useGLTF } from "@react-three/drei";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

useGLTF.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
);

function ScenePrecompiler() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.compile(scene, camera);
  }, []);
  return null;
}

const PagePlaceholder = ({ name }) => (
  <div
    style={{
      color: "white",
      background: "#000",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2rem",
      fontFamily: "sans-serif",
    }}
  >
    {name.toUpperCase()} PAGE COMING SOON...
    <button
      onClick={() => (window.location.href = "/")}
      style={{ marginLeft: "20px", padding: "10px", cursor: "pointer" }}
    >
      BACK TO CITY
    </button>
  </div>
);

export default function App() {
  const [selectedPos, setSelectedPos] = useState(null);

  return (
    <Router>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000",
          position: "relative",
        }}
      >
        <Routes>
          {/* MAIN 3D CITY ROUTE */}
          <Route
            path="/"
            element={
              <>
                {/* ── LOADER: sits in the DOM above the canvas ── */}
                <CityLoaderScreen />

                <Canvas
                  gl={{
                    powerPreference: "high-performance",
                    antialias: true,
                  }}
                  camera={{
                    position: [0, 70, 230],
                    fov: 45,
                    near: 0.1,
                    far: 5000,
                  }}
                >
                  <ScenePrecompiler />

                  <Perf position="top-right" />
                  <color attach="background" args={["#010407"]} />
                  <ambientLight intensity={0.8} />
                  <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.5}
                    color="#ffffff"
                    castShadow
                  />
                  <Environment preset="night" />
                  <Suspense fallback={null}>
                    <group>
                      <Stars
                        radius={300}
                        depth={50}
                        count={15000}
                        factor={8}
                        saturation={10}
                        fade={true}
                        speed={2.5}
                      />

                      <City onSelectDome={(pos) => setSelectedPos(pos)} />

                      <CameraWalkthrough
                        target={selectedPos}
                        active={Boolean(selectedPos)}
                      />
                    </group>
                  </Suspense>
                  <OrbitControls
                    makeDefault
                    enableDamping={true}
                    enabled={!selectedPos}
                    maxPolarAngle={Math.PI / 2.1}
                    maxDistance={1000}
                  />
                </Canvas>
              </>
            }
          />

          {/* DYNAMIC SUB-PAGES */}
          <Route path="/events" element={<PagePlaceholder name="Events" />} />
          <Route
            path="/speakers"
            element={<PagePlaceholder name="Speakers" />}
          />
          <Route path="/team" element={<PagePlaceholder name="Team" />} />
          <Route
            path="/timeline"
            element={<PagePlaceholder name="Timeline" />}
          />
          <Route path="/about" element={<PagePlaceholder name="About Us" />} />
          <Route
            path="/sponsors"
            element={<PagePlaceholder name="Sponsors" />}
          />
          <Route
            path="/initiative"
            element={<PagePlaceholder name="Initiative" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

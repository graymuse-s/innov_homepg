import { Canvas } from "@react-three/fiber";
import { useState, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import City, { CityLoaderScreen, CityLoadingBanner } from "./components/City";
import CameraWalkthrough from "./components/CameraWalkthrough";
import { OrbitControls, Environment, Stars, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

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
    {name.toUpperCase()} PAGE
    <button
      onClick={() => (window.location.href = "/")}
      style={{ marginLeft: "20px", padding: "10px", cursor: "pointer" }}
    >
      ← BACK
    </button>
  </div>
);

export default function App() {
  const [selectedPos, setSelectedPos] = useState(null);

  /**
   * 3-phase state:
   *   "loader"  → full-screen loader showing (Layer 1 loading)
   *   "banner"  → loader gone, city visible, top banner showing, domes LOCKED (L2+L3 loading)
   *   "ready"   → banner gone, domes UNLOCKED, fully interactive
   */
  const [phase, setPhase] = useState("loader");

  const domsLocked = phase !== "ready"; // locked in "loader" and "banner"
  const showLayers = phase !== "loader"; // L2+L3 mount once loader hides
  const bannerDone = phase === "ready"; // tells banner to fade out

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
          <Route
            path="/"
            element={
              <>
                {/* ── PHASE 1: Full-screen loader (hides itself, calls onReady) ── */}
                <CityLoaderScreen onReady={() => setPhase("banner")} />

                {/* ── PHASE 2: Top banner "City Loading — Please Wait" (no click block) ── */}
                {phase !== "loader" && <CityLoadingBanner done={bannerDone} />}

                <Canvas
                  gl={{ powerPreference: "high-performance", antialias: true }}
                  camera={{
                    position: [0, 70, 230],
                    fov: 45,
                    near: 0.1,
                    far: 5000,
                  }}
                >
                  <ScenePrecompiler />
                  <color attach="background" args={["#010407"]} />
                  <ambientLight intensity={0.8} />
                  <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.5}
                    castShadow
                  />
                  <Environment preset="night" />
                  <Suspense fallback={null}>
                    <Stars
                      radius={300}
                      depth={50}
                      count={15000}
                      factor={8}
                      saturation={10}
                      fade
                      speed={2.5}
                    />
                    <City
                      onSelectDome={(pos) => setSelectedPos(pos)}
                      showLayers={showLayers}
                      domsLocked={domsLocked}
                      onAllLoaded={() => setPhase("ready")} // LoadTracker fires this → domes unlock
                    />
                    <CameraWalkthrough
                      target={selectedPos}
                      active={Boolean(selectedPos)}
                    />
                  </Suspense>
                  <OrbitControls
                    makeDefault
                    enableDamping
                    enabled={!selectedPos}
                    maxPolarAngle={Math.PI / 2.1}
                    maxDistance={1000}
                  />
                </Canvas>
              </>
            }
          />

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

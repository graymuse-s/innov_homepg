import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Instances, Instance, useProgress } from "@react-three/drei";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import Dome from "./Dome";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────
// LOADER SCREEN (rendered in DOM, not in canvas)
// ─────────────────────────────────────────────
export function CityLoaderScreen({ onReady }) {
  const { progress, loaded, total } = useProgress();
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  // When progress hits 100, start fade-out
  useEffect(() => {
    if (progress >= 100) {
      // Small delay to ensure GPU has compiled shaders
      const t = setTimeout(() => {
        setFadeOut(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [progress]);

  // After fade-out animation, hide the loader entirely and notify parent
  useEffect(() => {
    if (!fadeOut) return;
    const t = setTimeout(() => {
      setHidden(true);
      onReady?.();
    }, 800); // matches CSS transition duration
    return () => clearTimeout(t);
  }, [fadeOut, onReady]);

  if (hidden) return null;

  const pct = Math.round(progress);
  const filledBars = Math.floor((pct / 100) * 20);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 60% 40%, #0a1a0a 0%, #000d00 60%, #000 100%)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Animated grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
          linear-gradient(rgba(0,255,80,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,80,0.04) 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
          animation: "gridPulse 4s ease-in-out infinite",
        }}
      />

      {/* Glowing orb */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,255,80,0.06) 0%, transparent 70%)",
          animation: "orbPulse 3s ease-in-out infinite",
        }}
      />

      {/* Logo / icon area */}
      <div
        style={{
          position: "relative",
          marginBottom: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Spinning hexagon ring */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          style={{ animation: "spinSlow 6s linear infinite" }}
        >
          <polygon
            points="60,8 104,34 104,86 60,112 16,86 16,34"
            fill="none"
            stroke="rgba(0,255,80,0.6)"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <polygon
            points="60,20 94,39 94,81 60,100 26,81 26,39"
            fill="none"
            stroke="rgba(0,255,80,0.25)"
            strokeWidth="1"
          />
        </svg>

        {/* Inner city icon */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 36,
            filter: "drop-shadow(0 0 12px rgba(0,255,80,0.8))",
          }}
        >
          🏙️
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 13,
          letterSpacing: "0.5em",
          color: "rgba(0,255,80,0.5)",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Initializing World
      </div>

      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: "#00ff50",
          textShadow:
            "0 0 20px rgba(0,255,80,0.7), 0 0 60px rgba(0,255,80,0.3)",
          marginBottom: 48,
          textTransform: "uppercase",
        }}
      >
        City Loading
      </div>

      {/* Bar progress */}
      <div
        style={{
          display: "flex",
          gap: 3,
          marginBottom: 20,
        }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 28,
              background:
                i < filledBars ? "rgba(0,255,80,0.9)" : "rgba(0,255,80,0.08)",
              border: "1px solid rgba(0,255,80,0.2)",
              transition: "background 0.3s ease",
              boxShadow: i < filledBars ? "0 0 8px rgba(0,255,80,0.6)" : "none",
              animation:
                i < filledBars
                  ? `barGlow 1.5s ease-in-out ${i * 0.05}s infinite`
                  : "none",
            }}
          />
        ))}
      </div>

      {/* Percentage */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 42,
          fontWeight: 700,
          color: "#00ff50",
          textShadow: "0 0 30px rgba(0,255,80,0.8)",
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        {pct}
        <span style={{ fontSize: 18, color: "rgba(0,255,80,0.6)" }}>%</span>
      </div>

      {/* Item count */}
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          color: "rgba(0,255,80,0.4)",
          letterSpacing: "0.2em",
        }}
      >
        {loaded} / {total} ASSETS
      </div>

      {/* Scrolling status lines */}
      <StatusTicker progress={pct} />

      {/* CSS keyframes injected */}
      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes barGlow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; box-shadow: 0 0 14px rgba(0,255,80,0.9); }
        }
        @keyframes tickerFade {
          0% { opacity: 0; transform: translateY(8px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Cycling status messages to show loading activity
function StatusTicker({ progress }) {
  const messages = [
    "Compiling shaders...",
    "Loading terrain geometry...",
    "Placing buildings...",
    "Spawning vehicles...",
    "Generating tree instances...",
    "Initializing domes...",
    "Baking lighting...",
    "Preparing animals...",
    "Assembling roads...",
    "Calibrating cameras...",
    "Finalizing scene...",
    "Almost there...",
  ];

  const idx = Math.floor((progress / 100) * messages.length);
  const msg = messages[Math.min(idx, messages.length - 1)];

  return (
    <div
      style={{
        marginTop: 28,
        fontFamily: "'Courier New', monospace",
        fontSize: 11,
        color: "rgba(0,255,80,0.5)",
        letterSpacing: "0.15em",
        height: 20,
        overflow: "hidden",
      }}
    >
      <span
        key={msg}
        style={{ display: "block", animation: "tickerFade 2s ease forwards" }}
      >
        &gt; {msg}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED HOOK
// ─────────────────────────────────────────────
function useTreeAsset() {
  const { nodes, materials } = useGLTF("/models/tree.glb");
  const mesh = Object.values(nodes).find((n) => n.isMesh);
  return {
    geometry: mesh.geometry,
    material: mesh.material || materials[Object.keys(materials)[0]],
  };
}

// ─────────────────────────────────────────────
// INSTANCED COMPONENTS
// ─────────────────────────────────────────────

function InstancedRobos({ robos }) {
  const { nodes } = useGLTF("/models/robo.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={robos.length}
    >
      {robos.map((r, i) => (
        <Instance
          key={i}
          position={r.position}
          rotation={r.rotation}
          scale={r.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedBicycles({ bikes }) {
  const { nodes } = useGLTF("/models/bycycle.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={bikes.length}
    >
      {bikes.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedSheep({ sheep }) {
  const { nodes } = useGLTF("/models/sheep.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={sheep.length}
    >
      {sheep.map((s, i) => (
        <Instance
          key={i}
          position={s.position}
          rotation={s.rotation}
          scale={s.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedGoats({ goats }) {
  const { nodes } = useGLTF("/models/goat.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={goats.length}
    >
      {goats.map((g, i) => (
        <Instance
          key={i}
          position={g.position}
          rotation={g.rotation}
          scale={g.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedCows({ cows }) {
  const { nodes } = useGLTF("/models/Cow.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={cows.length}
    >
      {cows.map((cow, i) => (
        <Instance
          key={i}
          position={cow.position}
          rotation={cow.rotation}
          scale={cow.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedBuildings({ buildings }) {
  const { nodes } = useGLTF("/models/building.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={buildings.length}
    >
      {buildings.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedSolarPanels({ panels }) {
  const { nodes } = useGLTF("/models/solarpanels.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={panels.length}
    >
      {panels.map((panel, i) => (
        <Instance
          key={i}
          position={panel.position}
          rotation={panel.rotation}
          scale={panel.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedCars({ cars }) {
  const { nodes } = useGLTF("/models/car.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={cars.length}
    >
      {cars.map((car, i) => (
        <Instance
          key={i}
          position={car.position}
          rotation={car.rotation}
          scale={car.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedChickens({ chickens }) {
  const { nodes } = useGLTF("/models/chicken.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={chickens.length}
    >
      {chickens.map((chicken, i) => (
        <Instance
          key={i}
          position={chicken.position}
          rotation={chicken.rotation}
          scale={chicken.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedResBuildings({ buildings }) {
  const { nodes } = useGLTF("/models/resbuilding.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={buildings.length}
    >
      {buildings.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedHorses({ horses }) {
  const { nodes } = useGLTF("/models/Horse.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={horses.length}
    >
      {horses.map((horse, i) => (
        <Instance
          key={i}
          position={horse.position}
          rotation={horse.rotation}
          scale={horse.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedBlueBase({ bases }) {
  const { nodes } = useGLTF("/models/blue_base.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={bases.length}
    >
      {bases.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedWindmills({ windmills }) {
  const { nodes } = useGLTF("/models/windmill.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={windmills.length}
    >
      {windmills.map((w, i) => (
        <Instance
          key={i}
          position={w.position}
          rotation={w.rotation}
          scale={w.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedCrops({ crops }) {
  const { nodes } = useGLTF("/models/crops.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={crops.length}
    >
      {crops.map((c, i) => (
        <Instance
          key={i}
          position={c.position}
          rotation={c.rotation}
          scale={c.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedFarms({ farms }) {
  const { nodes } = useGLTF("/models/farm.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={farms.length}
    >
      {farms.map((f, i) => (
        <Instance
          key={i}
          position={f.position}
          rotation={f.rotation}
          scale={f.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedCabins({ cabins }) {
  const { nodes } = useGLTF("/models/Cabin.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={cabins.length}
    >
      {cabins.map((c, i) => (
        <Instance
          key={i}
          position={c.position}
          rotation={c.rotation}
          scale={c.scale}
        />
      ))}
    </Instances>
  );
}

function InstancedMountains({ mountains }) {
  const { nodes } = useGLTF("/models/mountain.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={mountains.length}
      castShadow
      receiveShadow
    >
      {mountains.map((m, i) => (
        <Instance
          key={i}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
        />
      ))}
    </Instances>
  );
}

function AllTreeClusters({ clusters }) {
  const { geometry, material } = useTreeAsset();
  const allTrees = useMemo(() => {
    return clusters.flatMap(({ position, count, spread }) =>
      Array.from({ length: count }, () => ({
        pos: [
          position[0] + (Math.random() - 0.5) * spread,
          position[1],
          position[2] + (Math.random() - 0.5) * spread,
        ],
        scale: 3 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
      })),
    );
  }, []);

  return (
    <Instances geometry={geometry} material={material} limit={allTrees.length}>
      {allTrees.map((t, i) => (
        <Instance
          key={i}
          position={t.pos}
          rotation={[0, t.rot, 0]}
          scale={t.scale}
        />
      ))}
    </Instances>
  );
}

function AllRoadTrees({ radius }) {
  const { geometry, material } = useTreeAsset();

  const allTrees = useMemo(() => {
    const trees = [];
    const treeCount = 10;
    const segmentLength = radius * 1.15;

    for (let seg = 0; seg < 6; seg++) {
      const angle = (seg * Math.PI) / 3 + Math.PI / 6;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      for (let i = 0; i < treeCount; i++) {
        const zLocal =
          i * (segmentLength / (treeCount - 1)) - segmentLength / 2;
        const rot = Math.random() * Math.PI * 2;

        const outerX = cosA * (radius + 6) - sinA * zLocal;
        const outerZ = sinA * (radius + 6) + cosA * zLocal;
        trees.push({ pos: [outerX, 1, outerZ], rot });

        const innerX = cosA * (radius - 6) - sinA * zLocal;
        const innerZ = sinA * (radius - 6) + cosA * zLocal;
        trees.push({ pos: [innerX, 1, innerZ], rot });
      }
    }
    return trees;
  }, [radius]);

  return (
    <Instances geometry={geometry} material={material} limit={allTrees.length}>
      {allTrees.map((t, i) => (
        <Instance key={i} position={t.pos} rotation={[0, t.rot, 0]} scale={7} />
      ))}
    </Instances>
  );
}

function HexPerimeterRoad({ angle, radius }) {
  return (
    <group rotation={[0, angle, 0]}>
      <mesh position={[radius, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, radius * 1.15]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function Model({ path, position, scale = 1, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
    />
  );
}

function SkyLogoI({ position = [0, 140, -80], size = 700 }) {
  const texture = useTexture("/images/logo.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.premultiplyAlpha = false;
  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.6}
        alphaTest={0.01}
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
// PRELOADS
// ─────────────────────────────────────────────
useGLTF.preload("/models/tree.glb");
useGLTF.preload("/models/mountain.glb");
useGLTF.preload("/models/blue_base.glb");
useGLTF.preload("/models/building.glb");
useGLTF.preload("/models/resbuilding.glb");
useGLTF.preload("/models/solarpanels.glb");
useGLTF.preload("/models/car.glb");
useGLTF.preload("/models/bus.glb");
useGLTF.preload("/models/bench.glb");
useGLTF.preload("/models/windmill.glb");
useGLTF.preload("/models/grass.glb");
useGLTF.preload("/models/helicopter.glb");
useGLTF.preload("/models/helicopter_def.glb");
useGLTF.preload("/models/hospital_2.glb");
useGLTF.preload("/models/hospitals.glb");
useGLTF.preload("/models/school1.glb");
useGLTF.preload("/models/Cabin.glb");
useGLTF.preload("/models/crops.glb");
useGLTF.preload("/models/farm.glb");

useTexture.preload("/images/icon_0.png");
useTexture.preload("/images/icon_1.png");
useTexture.preload("/images/icon_2.png");
useTexture.preload("/images/icon_3.png");
useTexture.preload("/images/icon_4.png");
useTexture.preload("/images/icon_5.png");
useTexture.preload("/images/icon_6.png");

// ─────────────────────────────────────────────
// FULL SCENE — renders all models at once (no stagger)
// Only shown after loader disappears
// ─────────────────────────────────────────────
function FullScene({
  getCornerPos,
  cowsData,
  horsesData,
  sheepData,
  goatsData,
  chickenData,
  buildingData,
  resBuildingData,
  solarPanelData,
  carsData,
  roboData,
  bicyclesData,
}) {
  const { gl, scene, camera } = useThree();

  // One-time shader precompile after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      gl.compile(scene, camera);
    });
    return () => cancelAnimationFrame(id);
  }, [gl, scene, camera]);

  return (
    <>
      <Suspense fallback={null}>
        <Model
          path="/models/circle_water.glb"
          position={[0, -1.1, 0]}
          scale={150}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/ground.glb"
          position={[-64, 5.9, 150]}
          scale={43}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/tower.glb"
          position={[-30, 0, -40]}
          scale={50}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/hospitals.glb"
          position={[30, 12, 132]}
          scale={30}
          rotation={[0, Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/hospital_2.glb"
          position={[90, 6, 125]}
          scale={20}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/school1.glb"
          position={[-115, 7, 90]}
          scale={35}
          rotation={[0, Math.PI / 6, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/school_boundary.glb"
          position={[-115, 7, 90]}
          scale={60}
          rotation={[0, -Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/base_army.glb"
          position={[-5, 8, -135]}
          scale={50}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/missiel.glb"
          position={[-54, 21, -135]}
          scale={40}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/helipad_def.glb"
          position={[-109, 6, -100]}
          scale={30}
          rotation={[0, Math.PI / 4, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/helicopter_def.glb"
          position={[-109, 31, -100]}
          scale={30}
          rotation={[0, Math.PI / 4, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/def_veh.glb"
          position={[-89, 9, -130]}
          scale={20}
          rotation={[0, Math.PI / 4, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/helicopter.glb"
          position={[35, 28, 140]}
          scale={20}
          rotation={[-0.2, Math.PI / 6, 0.1]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/ambulance.glb"
          position={[84, 5, 60]}
          scale={15}
          rotation={[0, Math.PI / 3, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <Model
            path="/models/farmhouse.glb"
            position={[-70, -4, -70]}
            scale={15}
            rotation={[0, 0, 0]}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedCows cows={cowsData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedHorses horses={horsesData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedSheep sheep={sheepData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedGoats goats={goatsData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedChickens chickens={chickenData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/slide.glb"
          position={[-54, 11, 150]}
          scale={15}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/Swings.glb"
          position={[-70, 6, 150]}
          scale={8}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/seesaw.glb"
          position={[-66, 3.5, 137]}
          scale={8}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(5)}>
          <Model path="/models/lake.glb" position={[35, 0, -30]} scale={25} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(5)}>
          <Model
            path="/models/photoroom1.glb"
            position={[90, 2, 0]}
            scale={28}
            rotation={[0, Math.PI / 2, 0]}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(5)}>
          <Model
            path="/models/photoroom2.glb"
            position={[40, 2, -55]}
            scale={24}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/cycle_stand.glb"
          position={[-115, 7, 116]}
          scale={20}
          rotation={[0, Math.PI / 6, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <InstancedBuildings buildings={buildingData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <InstancedResBuildings buildings={resBuildingData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <InstancedSolarPanels panels={solarPanelData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <InstancedCars cars={carsData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <Model
            path="/models/solarcar.glb"
            position={[4, 5, 50]}
            scale={25}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/bus.glb"
          position={[-89, 4, -50]}
          scale={15}
          rotation={[0, Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/bike.glb"
          position={[6, 4, 101]}
          scale={10}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/rikshaw.glb"
          position={[-3, 3.5, -99]}
          scale={12}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/scooty.glb"
          position={[-109, 4, 40]}
          scale={8}
          rotation={[0, Math.PI / 5, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/students.glb"
          position={[-95, 9.8, 115]}
          scale={10}
          rotation={[0, Math.PI / 3, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/girls_bench.glb"
          position={[-110, 6, 140]}
          scale={20}
          rotation={[0, Math.PI / 7, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/school_boys.glb"
          position={[-105, 6, 150]}
          scale={20}
          rotation={[0, -Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/boys.glb"
          position={[-65, 4, 165]}
          scale={8}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <InstancedRobos robos={roboData} />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/models/bot.glb"
          position={[-90, 7, 100]}
          scale={10}
          rotation={[0, Math.PI / 5, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <InstancedBicycles bikes={bicyclesData} />
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <Model
            path="/models/AIboard.glb"
            position={[-10, 3, -50]}
            scale={18}
            rotation={[0, -Math.PI / 6, 0]}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <Model
            path="/models/dustbin.glb"
            position={[0, 1, -40]}
            scale={10}
            rotation={[Math.PI / 8, 0, 0]}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <Model path="/models/plus.glb" position={[89, 12, 127]} scale={5} />
      </Suspense>
    </>
  );
}

// ─────────────────────────────────────────────
// MAIN CITY COMPONENT
// ─────────────────────────────────────────────
export default function City({ onSelectDome }) {
  const navigate = useNavigate();
  const { scene, gl, camera } = useThree();

  const hexRadius = 110;

  const getCornerPos = (i) => [
    Math.cos((i * Math.PI) / 3) * hexRadius,
    1,
    Math.sin((i * Math.PI) / 3) * hexRadius,
  ];

  // ── DATA ARRAYS ──────────────────────────────

  const mountainData = [
    { position: [150, 0, -245], scale: 280, rotation: [0, 0, 0] },
    { position: [0, 0, -245], scale: 260, rotation: [0, 0, 0] },
    { position: [-160, 0, -220], scale: 250, rotation: [0, 0, 0] },
    { position: [150, 24, 245], scale: 200, rotation: [0, Math.PI, 0] },
    { position: [-35, 22, 255], scale: 200, rotation: [0, Math.PI, 0] },
    { position: [-190, 18, 220], scale: 200, rotation: [0, Math.PI, 0] },
    { position: [230, 15, -160], scale: 210, rotation: [0, Math.PI, 0] },
    { position: [255, 15, -15], scale: 200, rotation: [0, Math.PI, 0] },
    { position: [260, 15, 120], scale: 200, rotation: [0, Math.PI, 0] },
    {
      position: [-260, 0, -140],
      scale: 200,
      rotation: [Math.PI / 8, Math.PI / 6, 0],
    },
    { position: [-240, 6, -30], scale: 200, rotation: [0, Math.PI / 2, 0] },
    { position: [-260, 14, 120], scale: 200, rotation: [0, 0, 0] },
  ];

  const carsData = [
    { position: [38.5, 1, 20], rotation: [0, Math.PI / 2, 0], scale: 12 },
    { position: [38.5, 1, 27], rotation: [0, Math.PI / 2, 0], scale: 12 },
    { position: [25.5, 1, 27], rotation: [0, Math.PI / 2, 0], scale: 12 },
    { position: [25.5, 1, 34], rotation: [0, Math.PI / 2, 0], scale: 12 },
    { position: [38.5, 1, 34], rotation: [0, Math.PI / 2, 0], scale: 12 },
  ];

  const buildingData = [
    { position: [55, 5, 5], scale: 25, rotation: [0, 0, 0] },
    { position: [55, 5, 25], scale: 25, rotation: [0, 0, 0] },
    { position: [35, 6, 50], scale: 25, rotation: [0, 0, 0] },
    { position: [50, 6, 45], scale: 25, rotation: [0, 0, 0] },
  ];

  const resBuildingData = [
    { position: [60, 12, -25], scale: 28, rotation: [0, Math.PI / 2, 0] },
    { position: [36, 8, -30], scale: 16, rotation: [0, 0, 0] },
    { position: [20, 8, -35], scale: 16, rotation: [0, 0, 0] },
    { position: [38.5, 8, -10], scale: 16, rotation: [0, Math.PI / 2, 0] },
    { position: [38.5, 8, 7], scale: 16, rotation: [0, Math.PI / 2, 0] },
  ];

  const cowsData = [
    { position: [-40, 1, -3], scale: 25, rotation: [0, 0.5, 0] },
    { position: [-45, 1, -82], scale: 25, rotation: [0, 1.2, 0] },
    { position: [-55, 1, -84], scale: 25, rotation: [0, -0.8, 0] },
    { position: [-48, 1, -2], scale: 25, rotation: [0, 2.5, 0] },
    { position: [-35, 1, -75], scale: 25, rotation: [0, 0, 0] },
    { position: [-35, 1, -87], scale: 25, rotation: [0, 3.1, 0] },
  ];

  const goatsData = [
    { position: [-80, 2, 30], scale: 2, rotation: [0, -Math.PI / 6, 0] },
    { position: [-80, 2, 10], scale: 2, rotation: [0, Math.PI / 6, 0] },
  ];

  const sheepData = [
    { position: [-40, 0, -70], scale: 2.5, rotation: [0, 0, 0] },
    { position: [-50, 0, -70], scale: 2.5, rotation: [0, Math.PI, 0] },
  ];

  const bicyclesData = [
    { position: [-118, 7, 120], scale: 10, rotation: [0, Math.PI / 0.9, 0] },
    { position: [-115, 7, 118], scale: 10, rotation: [0, Math.PI / 0.9, 0] },
    { position: [-112, 7, 115], scale: 10, rotation: [0, Math.PI / 0.9, 0] },
    { position: [-110, 7, 114], scale: 10, rotation: [0, Math.PI / 0.9, 0] },
  ];

  const roboData = [
    { position: [15, 7, 140], scale: 8, rotation: [0, -0.6, 0] },
    { position: [77, 3, 130], scale: 7, rotation: [0, -0.6, 0] },
  ];

  const chickenData = [
    { position: [-40, -0.5, -12], scale: 4, rotation: [0, 1.5, 0] },
    { position: [-48, -0.5, -18], scale: 4, rotation: [0, 1.5, 0] },
    { position: [-41, -0.5, -15], scale: 4, rotation: [0, 1.5, 0] },
    { position: [-43, -0.5, -10], scale: 4, rotation: [0, 0.5, 0] },
    { position: [-41, -0.5, -20], scale: 4, rotation: [0, 5.5, 0] },
    { position: [-45, -0.5, -16], scale: 4, rotation: [0, 4.5, 0] },
    { position: [-48, -0.5, -12], scale: 4, rotation: [0, 1.5, 0] },
  ];

  const horsesData = [
    { position: [-30, -0.5, 40], scale: 15, rotation: [0, 1.5, 0] },
    { position: [-25, -0.5, 25], scale: 15, rotation: [0, -1.0, 0] },
    { position: [-14, -0.5, 35], scale: 15, rotation: [0, 0.2, 0] },
    { position: [-29, -0.5, 35], scale: 15, rotation: [0, 2.1, 0] },
  ];

  const solarPanelData = [
    { position: [8, 8, 43], scale: 12, rotation: [Math.PI / 4 + 1, 11.6, 1.8] },
    {
      position: [4, 7.9, 57],
      scale: 12,
      rotation: [Math.PI / 4 + 1, 11.5, 1.9],
    },
    { position: [0, 1, -40], scale: 18, rotation: [Math.PI / 8, 0, 0] },
    { position: [10, 9, -131], scale: 8, rotation: [0, Math.PI / 2, 0] },
    { position: [-10, 1, -40], scale: 18, rotation: [Math.PI / 8, 0, 0] },
  ];

  const blueBasesData = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
    position: i === 6 ? [0, 1, 0] : getCornerPos(i),
    rotation: [0, Math.PI / 2, 0],
    scale: 65,
  }));

  const windmillsData = [
    { position: [20, 4, -35], scale: 10, rotation: [0, 0, 0] },
    { position: [20, 11.8, -155], scale: 20, rotation: [0, -Math.PI / 2, 0] },
  ];

  const cp3 = getCornerPos(3);
  const cropsData = [
    {
      position: [-40 + cp3[0], 4, -40 + cp3[2]],
      scale: 35,
      rotation: [0, Math.PI, 0],
    },
    {
      position: [-50 + cp3[0], 4, 20 + cp3[2]],
      scale: 35,
      rotation: [0, Math.PI, 0],
    },
  ];

  const cp5 = getCornerPos(5);
  const farmsData = [
    { position: [55 + cp5[0], 5, 5 + cp5[2]], scale: 40, rotation: [0, 0, 0] },
    {
      position: [60 + cp5[0], 5, -25 + cp5[2]],
      scale: 30,
      rotation: [0, 0, 0],
    },
  ];

  const cabinsData = [
    {
      position: [-40 + cp3[0], -3, 60 + cp3[2]],
      scale: 15,
      rotation: [0, Math.PI / 4, 0],
    },
    {
      position: [-8 + cp3[0], -4, -50 + cp3[2]],
      scale: 17,
      rotation: [0, Math.PI, 0],
    },
  ];

  const treeClusters = [
    { position: [55 + cp5[0], 1, 55 + cp5[2]], count: 20, spread: 12 },
    { position: [-30 + cp5[0], 1, -20 + cp5[2]], count: 30, spread: 12 },
    { position: [cp5[0], 0, cp5[2]], count: 15, spread: 40 },
  ];

  // ── STATE ─────────────────────────────────────
  const [rotatingDome, setRotatingDome] = useState(null);
  const [activeDome, setActiveDome] = useState(null);

  const handleDomeClick = (i, pos) => {
    if (activeDome === i) return;
    setActiveDome(i);
    setRotatingDome(i);
    onSelectDome(pos);
  };

  const resetView = () => {
    onSelectDome(null);
    setActiveDome(null);
    setRotatingDome(null);
    document.body.style.cursor = "auto";
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      gl.compile(scene, camera);
    });
    return () => cancelAnimationFrame(id);
  }, [scene, gl, camera]);

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.2}
        color="#ffffff"
      />

      {/* FLOOR */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        onClick={() => {
          if (activeDome !== null) resetView();
        }}
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#0a2b02" roughness={0.8} metalness={0.2} />
      </mesh>

      <InstancedMountains mountains={mountainData} />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <HexPerimeterRoad
          key={i}
          angle={(i * Math.PI) / 3 + Math.PI / 6}
          radius={hexRadius - 8}
        />
      ))}

      <AllRoadTrees radius={hexRadius - 8} />
      <AllTreeClusters clusters={treeClusters} />
      <InstancedBlueBase bases={blueBasesData} />
      <InstancedWindmills windmills={windmillsData} />
      <InstancedCrops crops={cropsData} />
      <InstancedFarms farms={farmsData} />
      <InstancedCabins cabins={cabinsData} />

      <SkyLogoI position={[0, -200, -2200]} size={90} />

      {/* 7 DOMES */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const pos = i === 6 ? [0, 1, 0] : getCornerPos(i);
        return (
          <group key={i}>
            <Dome
              index={i}
              position={pos}
              iconPath={`/images/icon_${i}.png`}
              isZoomed={activeDome !== null}
              isSelected={activeDome === i}
              isRotating={rotatingDome === i}
              onRotationComplete={() => setRotatingDome(null)}
              onClick={() => handleDomeClick(i, pos)}
              onBack={resetView}
              onGo={(idx) => {
                const pages = {
                  0: "/events",
                  1: "/speakers",
                  2: "/team",
                  3: "/timeline",
                  4: "/about",
                  5: "/sponsors",
                  6: "/initiative",
                };
                navigate(pages[idx]);
              }}
            />
          </group>
        );
      })}

      {/* ALL SCENE MODELS — loaded fully before loader disappears */}
      <FullScene
        getCornerPos={getCornerPos}
        cowsData={cowsData}
        horsesData={horsesData}
        sheepData={sheepData}
        goatsData={goatsData}
        chickenData={chickenData}
        buildingData={buildingData}
        resBuildingData={resBuildingData}
        solarPanelData={solarPanelData}
        carsData={carsData}
        roboData={roboData}
        bicyclesData={bicyclesData}
      />
    </group>
  );
}

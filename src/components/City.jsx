import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei"

import {
  useGLTF,
  useTexture,
  Html,
  useProgress,
  Stars,
  Sparkles,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Dome from "./Dome";
import { useNavigate } from "react-router-dom";
import HologramIcon from "./HologramIcon";

function useTreeAsset() {
  const { nodes, materials } = useGLTF("/models/tree.glb");

  // pick first mesh found (safe generic grab)
  const mesh = Object.values(nodes).find((n) => n.isMesh);

  return {
    geometry: mesh.geometry,
    material:
      mesh.material || materials[Object.keys(materials)[0]],
  };
}

function InstancedRobos({ robos }) {
  const { nodes } = useGLTF("/models/robo.glb");

  const mesh = useMemo(() => {
    let found;
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n;
    });
    return found;
  }, [nodes]);

  if (!mesh) return null;

  return (
    <Instances geometry={mesh.geometry} material={mesh.material} limit={robos.length}>
      {robos.map((r, i) => (
        <Instance key={i} position={r.position} rotation={r.rotation} scale={r.scale} />
      ))}
    </Instances>
  );
}


function InstancedBicycles({ bikes }) {
  const { nodes } = useGLTF("/models/bycycle.glb");

  const mesh = useMemo(() => {
    let found;
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n;
    });
    return found;
  }, [nodes]);

  if (!mesh) return null;

  return (
    <Instances geometry={mesh.geometry} material={mesh.material} limit={bikes.length}>
      {bikes.map((b, i) => (
        <Instance key={i} position={b.position} rotation={b.rotation} scale={b.scale} />
      ))}
    </Instances>
  );
}


function InstancedSheep({ sheep }) {
  const { nodes } = useGLTF("/models/sheep.glb");

  const mesh = useMemo(() => {
    let found;
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n;
    });
    return found;
  }, [nodes]);

  if (!mesh) return null;

  return (
    <Instances geometry={mesh.geometry} material={mesh.material} limit={sheep.length}>
      {sheep.map((s, i) => (
        <Instance key={i} position={s.position} rotation={s.rotation} scale={s.scale} />
      ))}
    </Instances>
  );
}


function InstancedGoats({ goats }) {
  const { nodes } = useGLTF("/models/goat.glb");

  const mesh = useMemo(() => {
    let found;
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n;
    });
    return found;
  }, [nodes]);

  if (!mesh) return null;

  return (
    <Instances geometry={mesh.geometry} material={mesh.material} limit={goats.length}>
      {goats.map((g, i) => (
        <Instance key={i} position={g.position} rotation={g.rotation} scale={g.scale} />
      ))}
    </Instances>
  );
}


function InstancedCows({ cows }) {
  const { nodes } = useGLTF("/models/Cow.glb");

  const mesh = useMemo(() => {
    let found;
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n;
    });
    return found;
  }, [nodes]);

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
  const { nodes } = useGLTF("/models/building.glb")

  const mesh = useMemo(() => {
    let found
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n
    })
    return found
  }, [nodes])

  if (!mesh) return null

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
  )
}


function InstancedSolarPanels({ panels }) {
  const { nodes } = useGLTF("/models/solarpanels.glb")

  const mesh = useMemo(() => {
    let found
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n
    })
    return found
  }, [nodes])

  if (!mesh) return null

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
  )
}


function InstancedCars({ cars }) {
  const { nodes } = useGLTF("/models/car.glb");

  const mesh = useMemo(() => {
    let found;
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n;
    });
    return found;
  }, [nodes]);

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
  const { nodes } = useGLTF("/models/chicken.glb")

  const mesh = useMemo(() => {
    let found
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n
    })
    return found
  }, [nodes])

  if (!mesh) return null

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
  )
}

function InstancedResBuildings({ buildings }) {
  const { nodes } = useGLTF("/models/resbuilding.glb")

  const mesh = useMemo(() => {
    let found
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n
    })
    return found
  }, [nodes])

  if (!mesh) return null

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
  )
}


function InstancedRoadTrees({ angle, radius }) {
  const { scene } = useGLTF("/models/tree.glb");

  // find first mesh inside tree glb
  const treeMesh = useMemo(() => {
    let mesh;
    scene.traverse((o) => {
      if (o.isMesh && !mesh) mesh = o;
    });
    return mesh;
  }, [scene]);

  const treeData = useMemo(() => {
    const treeCount = 10;
    const segmentLength = radius * 1.15;
    const arr = [];

    for (let i = 0; i < treeCount; i++) {
      const zPos =
        (i * (segmentLength / (treeCount - 1))) -
        segmentLength / 2;
      const rot = Math.random() * Math.PI * 2;

      // outer
      arr.push({ pos: [radius + 6, 1, zPos], rot });

      // inner
      arr.push({ pos: [radius - 6, 1, zPos], rot });
    }

    return arr;
  }, [radius]);

  if (!treeMesh) return null;

  return (
    <group rotation={[0, angle, 0]}>
      <Instances
        geometry={treeMesh.geometry}
        material={treeMesh.material}
        limit={treeData.length}
      >
        {treeData.map((t, i) => (
          <Instance
            key={i}
            position={t.pos}
            rotation={[0, t.rot, 0]}
            scale={7}
          />
        ))}
      </Instances>
    </group>
  );
}

function InstancedHorses({ horses }) {
  const { nodes } = useGLTF("/models/Horse.glb");

  const mesh = useMemo(() => {
    let found;
    Object.values(nodes).forEach((n) => {
      if (n.isMesh && !found) found = n;
    });
    return found;
  }, [nodes]);

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


function Model({
  path,
  position,
  scale = 1,
  rotation = [0, 0, 0],
}) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
    />
  );
}

//Added
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



// At the very top of City.jsx or App.jsx (outside the component)
useTexture.preload("/images/icon_0.png");
useTexture.preload("/images/icon_1.png");
useTexture.preload("/images/icon_2.png");
useTexture.preload("/images/icon_3.png");
useTexture.preload("/images/icon_4.png");
useTexture.preload("/images/icon_5.png");
useTexture.preload("/images/icon_6.png");


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
        rotation={[-0.05, 0, 0]}
      />
    </mesh>
  );
}

// Solid road segment for the Hexagon perimeter
function HexPerimeterRoad({ angle, radius }) {
  // 1. Calculate tree metadata once to prevent flickering/re-randomizing
  const treeData = useMemo(() => {
    const treeCount = 10; // Number of trees per road segment
    const segmentLength = radius * 1.15;
    return Array.from({ length: treeCount }).map((_, i) => ({
      // Distribute trees along the Z-axis of the road strip
      zPos: i * (segmentLength / (treeCount - 1)) - segmentLength / 2,
      scale: 3 + Math.random() * 3,
      rotation: Math.random() * Math.PI * 2,
    }));
  }, [radius]);

  return (
    <group rotation={[0, angle, 0]}>
      {/* MAIN ROAD STRIP */}
      <mesh position={[radius, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, radius * 1.15]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

        {/* Removed */}
      {/* 2. ADDING THE TREES ON BOTH SIDES */}

       {/* INSTANCED TREES */}
      <InstancedRoadTrees angle={0} radius={radius} />

      {/* DASHED LINES */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`dash-${i}`}
          position={[radius + 0.1, 0.05, i * (radius / 6) - radius / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.2, 3]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}
    </group>
  );
}
//Removed
// function TreeCluster({ position, count = 20, spread = 15 }) {
//   const { nodes, materials } = useGLTF("/models/tree.glb");
//   const meshRef = useRef();

//   const dummy = new THREE.Object3D();

//   useEffect(() => {
//     for (let i = 0; i < count; i++) {
//       dummy.position.set(
//         (Math.random() - 0.5) * spread,
//         0,
//         (Math.random() - 0.5) * spread,
//       );

//       const scale = 3 + Math.random() * 3;
//       dummy.scale.set(scale, scale, scale);

//       dummy.rotation.y = Math.random() * Math.PI * 2;

//       dummy.updateMatrix();
//       meshRef.current.setMatrixAt(i, dummy.matrix);
//     }

//     meshRef.current.instanceMatrix.needsUpdate = true;
//   }, [count, spread]);

//   const firstMesh = Object.values(nodes).find((n) => n.isMesh);

//   return (
//     <group position={position}>
//       <instancedMesh
//         ref={meshRef}
//         args={[firstMesh.geometry, firstMesh.material, count]}
//       />
//     </group>
//   );
// }



function TreeCluster({
  position,
  count = 20,
  spread = 15,
}) {
  const { geometry, material } = useTreeAsset();

  console.log("Tree instances:", count);

  const treeData = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      pos: [
        (Math.random() - 0.5) * spread,
        0,
        (Math.random() - 0.5) * spread,
      ],
      scale: 3 + Math.random() * 3,
      rot: Math.random() * Math.PI * 2,
    }));
  }, [count, spread]);

  return (
    <group position={position}>
      <Instances
        geometry={geometry}
        material={material}
        limit={count}
        castShadow
        receiveShadow
      >
        {treeData.map((t, i) => (
          <Instance
            key={i}
            position={t.pos}
            rotation={[0, t.rot, 0]}
            scale={t.scale}
          />
        ))}
      </Instances>
    </group>
  );
}

function MountainBorder() {
  const mountainPath = "/models/mountain.glb"; // Replace with your actual path

  return (
    <group>
      {/* North Edge */}
      <Model
        path={mountainPath}
        position={[150, 0, -245]}
        scale={280}
        rotation={[0, 0, 0]}
      />
      <Model
        path={mountainPath}
        position={[0, 0, -245]}
        scale={260}
        rotation={[0, 0, 0]}
      />
      <Model
        path={mountainPath}
        position={[-160, 0, -220]}
        scale={250}
        rotation={[0, 0, 0]}
      />

      {/* South Edge */}
      <Model
        path={mountainPath}
        position={[150, 24, 245]}
        scale={200}
        rotation={[0, Math.PI, 0]}
      />
      <Model
        path={mountainPath}
        position={[-35, 22, 255]}
        scale={200}
        rotation={[0, Math.PI, 0]}
      />

      <Model
        path={mountainPath}
        position={[-190, 18, 220]}
        scale={200}
        rotation={[0, Math.PI, 0]}
      />

      {/* East Edge */}
      <Model
        path={mountainPath}
        position={[230, 15, -160]}
        scale={210}
        rotation={[0, Math.PI, 0]}
      />
      <Model
        path={mountainPath}
        position={[255, 15, -15]}
        scale={200}
        rotation={[0, Math.PI, 0]}
      />
      <Model
        path={mountainPath}
        position={[260, 15, 120]}
        scale={200}
        rotation={[0, Math.PI, 0]}
      />

      {/* West Edge */}
      <Model
        path={mountainPath}
        position={[-260, 0, -140]}
        scale={200}
        rotation={[Math.PI / 8, Math.PI / 6, 0]}
      />
      <Model
        path={mountainPath}
        position={[-240, 6, -30]}
        scale={200}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Model
        path={mountainPath}
        position={[-260, 14, 120]}
        scale={200}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

export default function City({ onSelectDome }) {
  // States
  const navigate = useNavigate();
  const { scene } = useThree();
  const { gl } = useThree();

  useEffect(() => {
    let totalTriangles = 0;
    let totalMeshes = 0;
    let totalGeometries = 0;
    let totalMaterials = 0;
    let totalObjects = 0;

    const materialSet = new Set();

    scene.traverse((object) => {
      totalObjects++;

      if (object.isMesh) {
        totalMeshes++;

        const geometry = object.geometry;
        if (geometry) {
          totalGeometries++;

          if (geometry.index) {
            totalTriangles += geometry.index.count / 3;
          } else if (geometry.attributes.position) {
            totalTriangles += geometry.attributes.position.count / 3;
          }
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => materialSet.add(mat));
          } else {
            materialSet.add(object.material);
          }
        }
      }
    });

    console.log("====== TOTAL SCENE INFO ======");
    console.log("Total Objects:", totalObjects);
    console.log("Total Meshes:", totalMeshes);
    console.log("Total Geometries:", totalGeometries);
    console.log("Total Materials:", materialSet.size);
    console.log("Total Triangles:", totalTriangles);
    console.log("Total Textures (GPU):", gl.info.memory.textures);
  }, [scene]);


  const carsData = [
  { position: [38.5, 1, 20], rotation: [0, Math.PI / 2, 0], scale: 12 },
  { position: [38.5, 1, 27], rotation: [0, Math.PI / 2, 0], scale: 12 },
  { position: [25.5, 1, 27], rotation: [0, Math.PI / 2, 0], scale: 12 },
  { position: [25.5, 1, 34], rotation: [0, Math.PI / 2, 0], scale: 12 },
  { position: [38.5, 1, 34], rotation: [0, Math.PI / 2, 0], scale: 12 },
]

const buildingData = [
  // First group
  { position: [55, 5, 5], scale: 25, rotation: [0, 0, 0] },
  { position: [55, 5, 25], scale: 25, rotation: [0, 0, 0] },

  // Residential area group
  { position: [35, 6, 50], scale: 25, rotation: [0, 0, 0] },
  { position: [50, 6, 45], scale: 25, rotation: [0, 0, 0] },
];

const resBuildingData = [
  // First usage
  {
    position: [60, 12, -25],
    scale: 28,
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [36, 8, -30],
    scale: 16,
    rotation: [0, 0, 0],
  },

  // Residential group
  {
    position: [20, 8, -35],
    scale: 16,
    rotation: [0, 0, 0],
  },
  {
    position: [38.5, 8, -10],
    scale: 16,
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [38.5, 8, 7],
    scale: 16,
    rotation: [0, Math.PI / 2, 0],
  },
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
  {
    position: [-40, -0.5, -12],
    scale: 4,
    rotation: [0, 1.5, 0],
  },
  {
    position: [-48, -0.5, -18],
    scale: 4,
    rotation: [0, 1.5, 0],
  },
  {
    position: [-41, -0.5, -15],
    scale: 4,
    rotation: [0, 1.5, 0],
  },
  {
    position: [-43, -0.5, -10],
    scale: 4,
    rotation: [0, 0.5, 0],
  },
  {
    position: [-41, -0.5, -20],
    scale: 4,
    rotation: [0, 5.5, 0],
  },
  {
    position: [-45, -0.5, -16],
    scale: 4,
    rotation: [0, 4.5, 0],
  },
  {
    position: [-48, -0.5, -12],
    scale: 4,
    rotation: [0, 1.5, 0],
  },
]

const horsesData = [
  { position: [-30, -0.5, 40], scale: 15, rotation: [0, 1.5, 0] },
  { position: [-25, -0.5, 25], scale: 15, rotation: [0, -1.0, 0] },
  { position: [-14, -0.5, 35], scale: 15, rotation: [0, 0.2, 0] },
  { position: [-29, -0.5, 35], scale: 15, rotation: [0, 2.1, 0] },
];


    const solarPanelData = [
  {
    position: [8, 8, 43],
    scale: 12,
    rotation: [Math.PI / 4 + 1, 11.6, 1.8],
  },
  {
    position: [4, 7.9, 57],
    scale: 12,
    rotation: [Math.PI / 4 + 1, 11.5, 1.9],
  },
  {
    position: [0, 1, -40],
    scale: 18,
    rotation: [Math.PI / 8, 0, 0],
  },
  {
    position: [10, 9, -131],
    scale: 8,
    rotation: [0, Math.PI / 2, 0],
  },
  {
    position: [-10, 1, -40],
    scale: 18,
    rotation: [Math.PI / 8, 0, 0],
  },
]




  const hexRadius = 110; // How far the domes are from center
  const localRadius = 15; // radius for models around each dome

  const getCornerPos = (i) => [
    Math.cos((i * Math.PI) / 3) * hexRadius,
    1,
    Math.sin((i * Math.PI) / 3) * hexRadius,
  ];

  const [rotatingDome, setRotatingDome] = useState(null);
  const [activeDome, setActiveDome] = useState(null);

  const handleDomeClick = (i, pos) => {
    // If we are already zoomed into this dome, don't do anything
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

  return (
    <group>
      {/* 1. THE BIG FLOOR (Added this back) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        onClick={(e) => {
          // If a dome is active, clicking the floor (or through a hollow dome) resets
          if (activeDome !== null) {
            resetView();
          }
        }}
      >
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#0a2b02" roughness={0.8} metalness={0.2} />
      </mesh>

      <MountainBorder />

      {/* 1. THE BIG HEXAGONAL ROAD */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <HexPerimeterRoad
          key={i}
          angle={(i * Math.PI) / 3 + Math.PI / 6}
          radius={hexRadius - 8}
        />
      ))}

      {/* --- UI/Logo --- */}
      <SkyLogoI position={[0, -200, -2200]} size={90} />

      {/* 2. THE 7 DOMES (6 Corners + 1 Center) */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const angle = (i * Math.PI) / 3; // Calculate the angle
        const pos = i === 6 ? [0, 1, 0] : getCornerPos(i);
        const isSelected = activeDome === i;
        const isZoomed = activeDome !== null;
        return (
          <group key={i}>
            {/* 1. The Light: Positioned relative to the dome */}
            <directionalLight
              position={[pos[0] + 20, 50, pos[2] + 20]}
              intensity={0.5}
              color="#ffffff"
              // This ensures the light points at the dome's position
              target-position={[pos[0], 0, pos[2]]}
            />

            <Dome
              key={i}
              index={i}
              position={pos}
              iconPath={`/images/icon_${i}.png`}
              isZoomed={activeDome !== null}
              isSelected={activeDome === i}
              isRotating={rotatingDome === i}
              onRotationComplete={() => setRotatingDome(null)}
              onClick={() => handleDomeClick(i, pos)}
              onBack={resetView} // CRITICAL: Passing the reset function
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

            <Model
              path="/models/blue_base.glb"
              position={pos} // 👈 Use the dome's position here
              scale={65}
              rotation={[0, Math.PI / 2, 0]}
            />
          </group>
        );
      })}

      <Model
        path="/models/missiel.glb"
        position={[-54, 21, -135]}
        scale={40}
        rotation={[0, Math.PI, 0]}
      />
      <Model
        path="/models/def_veh.glb"
        position={[-89, 9, -130]}
        scale={20}
        rotation={[0, Math.PI / 4, 0]}
      />

      <Model
        path="/models/hospitals.glb"
        position={[30, 12, 132]}
        scale={30}
        rotation={[0, Math.PI / 1.2, 0]}
      />
      <Model
        path="/models/hospital_2.glb"
        position={[90, 6, 125]}
        scale={20}
        rotation={[0, -Math.PI / 2, 0]}
      />

      <Model
        path="/models/school1.glb"
        position={[-115, 7, 90]}
        scale={35}
        rotation={[0, Math.PI / 6, 0]}
      />
      <Model
        path="/models/ground.glb"
        position={[-64, 5.9, 150]}
        scale={43}
        rotation={[0, Math.PI, 0]}
      />
      <Model
        path="/models/circle_water.glb"
        position={[0, -1.1, 0]}
        scale={150}
        rotation={[0, Math.PI / 2, 0]}
      />

      <group position={getCornerPos(3)}>
        {/* 1. TWO FARMHOUSES */}
        <Model
          path="/models/Cabin.glb"
          position={[-40, -3, 60]}
          scale={15}
          rotation={[0, Math.PI / 4, 0]}
        />
        <Model
          path="/models/crops.glb"
          position={[-40, 4, -40]}
          scale={35}
          rotation={[0, Math.PI, 0]}
        />
        <Model
          path="/models/crops.glb"
          position={[-50, 4, 20]}
          scale={35}
          rotation={[0, Math.PI, 0]}
        />
      </group>

      <group position={getCornerPos(5)}>
        {/* Main Resource Models around the dome */}
        <Model path="/models/farm.glb" position={[55, 5, 5]} scale={40} />
        <Model path="/models/lake.glb" position={[35, 0, -30]} scale={25} />
        {/* <Model
          path="/models/solarpanels.glb"
          position={[-10, 1, -40]}
          scale={18}
          rotation={[Math.PI / 8, 0, 0]}
        /> */}
      </group>

      <group position={getCornerPos(0)}>
        {/* <Model path="/models/building.glb" position={[55, 5, 5]} scale={25} />
        <Model path="/models/building.glb" position={[55, 5, 25]} scale={25} /> */}
        <InstancedBuildings buildings={buildingData} />

        {/* <Model
          path="/models/resbuilding.glb"
          position={[60, 12, -25]}
          scale={28}
          rotation={[0, Math.PI / 2, 0]}
        />

        <Model
          path="/models/resbuilding.glb"
          position={[36, 8, -30]}
          scale={16}
        /> */}
      </group>

      <Suspense fallback={null}>
        {/* --- Vehicles & Transport --- */}
        <Model
          path="/models/bike.glb"
          position={[6, 4, 101]}
          scale={10}
          rotation={[0, Math.PI / 2, 0]}
        />

        <Model
          path="/models/bus.glb"
          position={[-89, 4, -50]}
          scale={15}
          rotation={[0, Math.PI / 1.2, 0]}
        />
        <Model
          path="/models/rikshaw.glb"
          position={[-3, 3.5, -99]}
          scale={12}
          rotation={[0, Math.PI, 0]}
        />
        <Model
          path="/models/scooty.glb"
          position={[-109, 4, 40]}
          scale={8}
          rotation={[0, Math.PI / 5, 0]}
        />

        {/* --- Defense Hub --- */}

        <Model
          path="/models/helicopter_def.glb"
          position={[-109, 31, -100]}
          scale={30}
          rotation={[0, Math.PI / 4, 0]}
        />
        <Model
          path="/models/helipad_def.glb"
          position={[-109, 6, -100]}
          scale={30}
          rotation={[0, Math.PI / 4, 0]}
        />

        {/* <Model
          path="/models/Defence.glb"
          position={[-70, 6, -130]}
          scale={30}
          rotation={[0, Math.PI / 4, 0]}
        /> */}


        {/* --- Medical Hub --- */}

        <Model
          path="/models/plus.glb"
          position={[89, 12, 127]}
          scale={5}
          rotation={[0, 0, 0]}
        />
        <Model
          path="/models/ambulance.glb"
          position={[84, 5, 60]}
          scale={15}
          rotation={[0, Math.PI / 3, 0]}
        />
        <Model
          path="/models/helicopter.glb"
          position={[35, 28, 140]}
          scale={20}
          rotation={[-0.2, Math.PI / 6, 0.1]}
        />

        {/* --- Park & Recreation --- */}

        <Model
          path="/models/slide.glb"
          position={[-54, 11, 150]}
          scale={15}
          rotation={[0, Math.PI, 0]}
        />
        <Model
          path="/models/Swings.glb"
          position={[-70, 6, 150]}
          scale={8}
          rotation={[0, Math.PI, 0]}
        />
        <Model
          path="/models/seesaw.glb"
          position={[-66, 3.5, 137]}
          scale={8}
          rotation={[0, Math.PI, 0]}
        />

        <Model
          path="/models/girls_bench.glb"
          position={[-110, 6, 140]}
          scale={20}
          rotation={[0, Math.PI / 7, 0]}
        />
        <Model
          path="/models/school_boys.glb"
          position={[-105, 6, 150]}
          scale={20}
          rotation={[0, -Math.PI / 1.2, 0]}
        />
        <Model
          path="/models/boys.glb"
          position={[-65, 4, 165]}
          scale={8}
          rotation={[0, Math.PI / 2, 0]}
        />

        <Model
          path="/models/tower.glb"
          position={[-30, 0, -40]}
          scale={50}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Model
          path="/models/bridge.glb"
          position={[30, 5, 40]}
          scale={0}
          rotation={[0, (2 * Math.PI) / 3, 0]}
        />

        {/* --- DOME 4: ANIMAL HUSBANDRY & MANUAL FARMING --- */}
        <group position={getCornerPos(3)}>
          {/* 1. TWO FARMHOUSES */}

          <Model
            path="/models/Cabin.glb"
            position={[-8, -4, -50]}
            scale={17}
            rotation={[0, Math.PI, 0]}
          />

          <Model
            path="/models/farmhouse.glb"
            position={[-70, -4, -70]}
            scale={15}
            rotation={[0, 0, 0]}
          />

          {/* <Model
            path="/models/sheep.glb"
            position={[-40, 0, -70]}
            scale={2.5}
            rotation={[0, 0, 0]}
          />
          <Model
            path="/models/sheep.glb"
            position={[-50, 0, -70]}
            scale={2.5}
            rotation={[0, Math.PI, 0]}
          /> */}

          <InstancedSheep sheep={sheepData} />


          {/* <Model
            path="/models/goat.glb"
            position={[-80, 2, 30]}
            scale={2}
            rotation={[0, -Math.PI / 6, 0]}
          />
          <Model
            path="/models/goat.glb"
            position={[-80, 2, 10]}
            scale={2}
            rotation={[0, Math.PI / 6, 0]}
          /> */}
          <InstancedGoats goats={goatsData} />



          {/* 2. TWO FARMS (Fields) */}

          {/* 5. CHICKENS (12 Units) - Clustered near Farmhouse 1 */}
          {/* <Model
            path="/models/chicken.glb"
            position={[-40, -0.5, -12]}
            scale={4}
            rotation={[0, 1.5, 0]}
          />
          <Model
            path="/models/chicken.glb"
            position={[-48, -0.5, -18]}
            scale={4}
            rotation={[0, 1.5, 0]}
          /> */}
        </group>

        {/* --- DOME 5: THE RESOURCE & NATURE HUB --- */}
        <group position={getCornerPos(5)}>
          {/* Main Resource Models around the dome */}

          <Model path="/models/farm.glb" position={[60, 5, -25]} scale={30} />

          <TreeCluster position={[55, 1, 55]} count={20} spread={12} />
          <TreeCluster position={[-30, 1, -20]} count={30} spread={12} />

          <Model
            path="/models/photoroom1.glb"
            position={[90, 2, 0]}
            scale={28}
            rotation={[0, Math.PI / 2, 0]}
          />
          <Model
            path="/models/photoroom2.glb"
            position={[40, 2, -55]}
            scale={24}
          />
        </group>

        {/* residential area */}
        <group position={getCornerPos(0)}>
          {/* <Model
            path="/models/building.glb"
            position={[35, 6, 50]}
            scale={25}
          />
          <Model
            path="/models/building.glb"
            position={[50, 6, 45]}
            scale={25}
          /> */}

          {/* <Model
            path="/models/resbuilding.glb"
            position={[20, 8, -35]}
            scale={16}
          />
          <Model
            path="/models/resbuilding.glb"
            position={[38.5, 8, -10]}
            scale={16}
            rotation={[0, Math.PI / 2, 0]}
          />
          <Model
            path="/models/resbuilding.glb"
            position={[38.5, 8, 7]}
            scale={16}
            rotation={[0, Math.PI / 2, 0]}
          /> */}

          <InstancedResBuildings buildings={resBuildingData} />


          {/* <Model
            path="/models/car.glb"
            position={[38.5, 1, 20]}
            scale={12}
            rotation={[0, Math.PI / 2, 0]}
          />
          <Model
            path="/models/car.glb"
            position={[38.5, 1, 27]}
            scale={12}
            rotation={[0, Math.PI / 2, 0]}
          /> */}

            <InstancedCars cars={carsData} />

          {/* 2 Photo Rooms integrated into the nature zone */}
          <Model
            path="/models/solarcar.glb"
            position={[4, 5, 50]}
            scale={25}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </group>

        <Suspense fallback={null}>
          <group position={getCornerPos(0)}>
            {/* Solar Panels tucked behind the dome */}
            <Model
              path="/models/AIboard.glb"
              position={[-10, 3, -50]}
              scale={18}
              rotation={[0, -Math.PI / 6, 0]}
            />
            <Model
              path="/models/dustbin.glb"
              position={[0, 1, -40]}
              scale={10}
              rotation={[Math.PI / 8, 0, 0]}
            />
            {/* <Model
              path="/models/solarpanels.glb"
              position={[8, 8, 43]}
              scale={12}
              rotation={[Math.PI / 4 + 1, 11.6, 1.8]}
            />
            <Model
              path="/models/solarpanels.glb"
              position={[4, 7.9, 57]}
              scale={12}
              rotation={[Math.PI / 4 + 1, 11.5, 1.9]}
            /> */}

            <InstancedSolarPanels panels={solarPanelData} />


            {/* <Model
              path="/models/car.glb"
              position={[25.5, 1, 27]}
              scale={12}
              rotation={[0, Math.PI / 2, 0]}
            />
            <Model
              path="/models/car.glb"
              position={[25.5, 1, 34]}
              scale={12}
              rotation={[0, Math.PI / 2, 0]}
            />
            <Model
              path="/models/car.glb"
              position={[38.5, 1, 34]}
              scale={12}
              rotation={[0, Math.PI / 2, 0]}
            /> */}
          </group>

          <group position={getCornerPos(5)}>
            <Model
              path="/models/windmill.glb"
              position={[20, 4, -35]}
              scale={10}
            />

            {/* Solar Panels tucked behind the dome */}

            {/* <Model
              path="/models/solarpanels.glb"
              position={[0, 1, -40]}
              scale={18}
              rotation={[Math.PI / 8, 0, 0]}
            /> */}
            {/* 2 Photo Rooms integrated into the nature zone */}

            {/* Dense Tree Fill Behind Dome 5 */}
            {Array.from({ length: 15 }).map((_, i) => (
              <Model
                key={`tree-d5-${i}`}
                path="/models/tree.glb"
                position={[
                  Math.cos(i) * 40,
                  0,
                  -30 - Math.random() * 20, // Deep behind the dome
                ]}
                scale={4 + Math.random() * 3}
              />
            ))}
          </group>

          <group position={getCornerPos(3)}>
            {/* 3. COWS (6 Units) */}
            {/* <Model
              path="/models/Cow.glb"
              position={[-40, 1, -3]}
              scale={25}
              rotation={[0, 0.5, 0]}
            />
            <Model
              path="/models/Cow.glb"
              position={[-45, 1, -82]}
              scale={25}
              rotation={[0, 1.2, 0]}
            />
            <Model
              path="/models/Cow.glb"
              position={[-55, 1, -84]}
              scale={25}
              rotation={[0, -0.8, 0]}
            />
            <Model
              path="/models/Cow.glb"
              position={[-48, 1, -2]}
              scale={25}
              rotation={[0, 2.5, 0]}
            />
            <Model
              path="/models/Cow.glb"
              position={[-35, 1, -75]}
              scale={25}
              rotation={[0, 0, 0]}
            />
            <Model
              path="/models/Cow.glb"
              position={[-35, 1, -87]}
              scale={25}
              rotation={[0, 3.1, 0]}
            /> */}

            <InstancedCows cows={cowsData} />


            <InstancedHorses horses={horsesData} />

            {/* 4. HORSES (4 Units) */}
            {/* <Model
              path="/models/Horse.glb"
              position={[-30, -0.5, 40]}
              scale={15}
              rotation={[0, 1.5, 0]}
            />
            <Model
              path="/models/Horse.glb"
              position={[-25, -0.5, 25]}
              scale={15}
              rotation={[0, -1.0, 0]}
            />
            <Model
              path="/models/Horse.glb"
              position={[-14, -0.5, 35]}
              scale={15}
              rotation={[0, 0.2, 0]}
            />
            <Model
              path="/models/Horse.glb"
              position={[-29, -0.5, 35]}
              scale={15}
              rotation={[0, 2.1, 0]}
            /> */}

            <InstancedChickens chickens={chickenData} />

            {/* <Model
              path="/models/chicken.glb"
              position={[-41, -0.5, -15]}
              scale={4}
              rotation={[0, 1.5, 0]}
            />
            <Model
              path="/models/chicken.glb"
              position={[-43, -0.5, -10]}
              scale={4}
              rotation={[0, 0.5, 0]}
            />
            <Model
              path="/models/chicken.glb"
              position={[-41, -0.5, -20]}
              scale={4}
              rotation={[0, 5.5, 0]}
            />
            <Model
              path="/models/chicken.glb"
              position={[-45, -0.5, -16]}
              scale={4}
              rotation={[0, 4.5, 0]}
            />
            <Model
              path="/models/chicken.glb"
              position={[-48, -0.5, -12]}
              scale={4}
              rotation={[0, 1.5, 0]}
            /> */}
          </group>

          {/* --- Energy & Robotics --- */}
          {/* <Model
            path="/models/solarpanels.glb"
            position={[10, 9, -131]}
            scale={8}
            rotation={[0, Math.PI / 2, 0]}
          /> */}
          <Model
            path="/models/windmill.glb"
            position={[20, 11.8, -155]}
            scale={20}
            rotation={[0, -Math.PI / 2, 0]}
          />
          {/* <Model
            path="/models/robo.glb"
            position={[15, 7, 140]}
            scale={8}
            rotation={[0, -0.6, 0]}
          />
          <Model
            path="/models/robo.glb"
            position={[77, 3, 130]}
            scale={7}
            rotation={[0, -0.6, 0]}
          /> */}

          <InstancedRobos robos={roboData} />

          <Model
            path="/models/bot.glb"
            position={[-90, 7, 100]}
            scale={10}
            rotation={[0, Math.PI / 5, 0]}
          />

          {/* --- School & Education Hub --- */}

          <Model
            path="/models/school_boundary.glb"
            position={[-115, 7, 90]}
            scale={60}
            rotation={[0, -Math.PI / 1.2, 0]}
          />
          <Model
            path="/models/cycle_stand.glb"
            position={[-115, 7, 116]}
            scale={20}
            rotation={[0, Math.PI / 6, 0]}
          />
          <Model
            path="/models/students.glb"
            position={[-95, 9.8, 115]}
            scale={10}
            rotation={[0, Math.PI / 3, 0]}
          />

          {/* --- Bicycles (Student Area) --- */}
          {/* <Model
            path="/models/bycycle.glb"
            position={[-118, 7, 120]}
            scale={10}
            rotation={[0, Math.PI / 0.9, 0]}
          />
          <Model
            path="/models/bycycle.glb"
            position={[-115, 7, 118]}
            scale={10}
            rotation={[0, Math.PI / 0.9, 0]}
          />
          <Model
            path="/models/bycycle.glb"
            position={[-112, 7, 115]}
            scale={10}
            rotation={[0, Math.PI / 0.9, 0]}
          />
          <Model
            path="/models/bycycle.glb"
            position={[-110, 7, 114]}
            scale={10}
            rotation={[0, Math.PI / 0.9, 0]}
          /> */}
          <InstancedBicycles bikes={bicyclesData} />


          <Model
            path="/models/base_army.glb"
            position={[-5, 8, -135]}
            scale={50}
            rotation={[0, Math.PI, 0]}
          />
            {/* Removed */}
          {/* <Model
            path="/models/base_army.glb"
            position={[-5, 8, -135]}
            scale={50}
            rotation={[0, Math.PI, 0]}
          />

          <Model
            path="/models/base_army.glb"
            position={[-5, 8, -135]}
            scale={50}
            rotation={[0, Math.PI, 0]}
          />

          <Model
            path="/models/base_army.glb"
            position={[-5, 8, -135]}
            scale={50}
            rotation={[0, Math.PI, 0]}
          /> */}
        </Suspense>
      </Suspense>
    </group>
  );
}

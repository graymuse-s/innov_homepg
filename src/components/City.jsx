import { Suspense, useRef, useMemo, useState } from "react"
import { useGLTF, useTexture, Instances, Instance } from "@react-three/drei"
import * as THREE from "three"
import Dome from "./Dome"
import { useNavigate } from "react-router-dom"

// Preload Textures
[0, 1, 2, 3, 4, 5, 6].forEach(i => useTexture.preload(`/images/icon_${i}.png`));

function Model({ path, position, scale = 1, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF(path)
    const clonedScene = useMemo(() => scene.clone(), [scene])
    return <primitive object={clonedScene} position={position} scale={[scale, scale, scale]} rotation={rotation} />
}

function SkyLogoI({ position = [0, 140, -80], size = 700 }) {
    const texture = useTexture("/images/logo.png");
    texture.colorSpace = THREE.SRGBColorSpace;
    return (
        <mesh position={position}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial map={texture} transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
    );
}

function InstancedGroup({ path, data }) {
    const { nodes } = useGLTF(path);
    const mesh = useMemo(() => {
        let found = null;
        Object.values(nodes).forEach(obj => { if (obj.isMesh && !found) found = obj; });
        return found;
    }, [nodes]);
    if (!mesh) return null;
    return (
        <Instances geometry={mesh.geometry} material={mesh.material}>
            {data.map((d, i) => (
                <Instance key={i} position={d.pos} rotation={d.rot || [0, 0, 0]} scale={d.scale} />
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
            {Array.from({ length: 8 }).map((_, i) => (
                <mesh key={`dash-${i}`} position={[radius + 0.1, 0.05, (i * (radius / 6)) - radius / 2]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.2, 3]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            ))}
        </group>
    );
}

const MOUNTAIN_DATA = [
    { pos: [150, 0, -245], scale: 280 }, { pos: [0, 0, -245], scale: 260 }, { pos: [-160, 0, -220], scale: 250 },
    { pos: [150, 24, 245], scale: 200, rot: [0, Math.PI, 0] }, { pos: [-35, 22, 255], scale: 200, rot: [0, Math.PI, 0] },
    { pos: [-190, 18, 220], scale: 200, rot: [0, Math.PI, 0] }, { pos: [230, 15, -160], scale: 210, rot: [0, Math.PI, 0] },
    { pos: [260, 15, 120], scale: 200, rot: [0, Math.PI, 0] }, { pos: [-260, 0, -140], scale: 200, rot: [Math.PI / 8, Math.PI / 6, 0] },
    { pos: [-240, 6, -30], scale: 200, rot: [0, Math.PI / 2, 0] }, { pos: [-260, 14, 120], scale: 200 }
];

export default function City({ onSelectDome }) {
    const navigate = useNavigate();
    const hexRadius = 110;
    const [activeDome, setActiveDome] = useState(null);
    const [rotatingDome, setRotatingDome] = useState(null);

    const getCornerPos = (i) => [Math.cos((i * Math.PI) / 3) * hexRadius, 1, Math.sin((i * Math.PI) / 3) * hexRadius];
    const addPos = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

    const cityData = useMemo(() => {
        const c0 = getCornerPos(0); const c3 = getCornerPos(3); const c5 = getCornerPos(5);

        // Tree logic
        const roadTrees = [];
        const radius = hexRadius - 8;
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3 + Math.PI / 6;
            const segmentLength = radius * 1.15;
            for (let j = 0; j < 10; j++) {
                const zPos = (j * (segmentLength / 9)) - (segmentLength / 2);
                const t = (lx) => [(lx + radius) * Math.cos(angle) - zPos * Math.sin(angle), 1, (lx + radius) * Math.sin(angle) + zPos * Math.cos(angle)];
                roadTrees.push({ pos: t(6), scale: 7, rot: [0, Math.random() * 6, 0] }, { pos: t(-6), scale: 7, rot: [0, Math.random() * 6, 0] });
            }
        }

        return {
            roadTrees,
            d5Trees: Array.from({ length: 15 }).map((_, i) => ({ pos: addPos(c5, [Math.cos(i) * 40, 0, -30 - (Math.random() * 20)]), scale: 4 + Math.random() * 3 })),
            cows: [[-40, 1, -3], [-45, 1, -82], [-55, 1, -84], [-48, 1, -2], [-35, 1, -75], [-35, 1, -87]].map(p => ({ pos: addPos(c3, p), scale: 25, rot: [0, Math.random() * 6, 0] })),
            horses: [[-30, -0.5, 40], [-25, -0.5, 25], [-14, -0.5, 35], [-29, -0.5, 35]].map(p => ({ pos: addPos(c3, p), scale: 15, rot: [0, Math.random() * 6, 0] })),
            chickens: [[-40, -0.5, -12], [-48, -0.5, -18], [-41, -0.5, -15], [-43, -0.5, -10], [-41, -0.5, -20], [-45, -0.5, -16], [-48, -0.5, -12]].map(p => ({ pos: addPos(c3, p), scale: 4 })),
            bikes: [[-118, 7, 120], [-115, 7, 118], [-112, 7, 115], [-110, 7, 114]].map(p => ({ pos: p, scale: 10, rot: [0, Math.PI / 0.9, 0] })),
            army: Array(4).fill({ pos: [-5, 8, -135], rot: [0, Math.PI, 0], scale: 50 })
        };
    }, [hexRadius]);

    const handleDomeClick = (i, pos) => { if (activeDome === i) return; setActiveDome(i); setRotatingDome(i); onSelectDome(pos); };
    const resetView = () => { onSelectDome(null); setActiveDome(null); setRotatingDome(null); };

    return (
        <group>
            {/* --- OUTSIDE SUSPENSE: MAJOR INFRASTRUCTURE --- */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} onClick={() => activeDome !== null && resetView()}>
                <planeGeometry args={[500, 500]} />
                <meshStandardMaterial color="#0a2b02" roughness={0.8} />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map(i => <HexPerimeterRoad key={i} angle={(i * Math.PI) / 3 + Math.PI / 6} radius={hexRadius - 8} />)}
            <InstancedGroup path="/models/mountain.glb" data={MOUNTAIN_DATA} />
            <SkyLogoI position={[0, -200, -2200]} size={90} />

            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const pos = i === 6 ? [0, 1, 0] : getCornerPos(i);
                return (
                    <group key={i}>
                        <directionalLight position={[pos[0] + 20, 50, pos[2] + 20]} intensity={0.5} target-position={pos} />
                        <Dome index={i} position={pos} iconPath={`/images/icon_${i}.png`} isZoomed={activeDome !== null} isSelected={activeDome === i} isRotating={rotatingDome === i} onRotationComplete={() => setRotatingDome(null)} onClick={() => handleDomeClick(i, pos)} onBack={resetView} onGo={(idx) => navigate(["/events", "/speakers", "/team", "/timeline", "/about", "/sponsors", "/initiative"][idx])} />
                        <Model path="/models/blue_base.glb" position={pos} scale={65} rotation={[0, Math.PI / 2, 0]} />
                    </group>
                );
            })}

            {/* --- INSIDE SUSPENSE: ALL OTHER MODELS --- */}
            <Suspense fallback={null}>
                {/* Instanced Props */}
                <InstancedGroup path="/models/tree.glb" data={[...cityData.roadTrees, ...cityData.d5Trees]} />
                <InstancedGroup path="/models/Cow.glb" data={cityData.cows} />
                <InstancedGroup path="/models/Horse.glb" data={cityData.horses} />
                <InstancedGroup path="/models/chicken.glb" data={cityData.chickens} />
                <InstancedGroup path="/models/bycycle.glb" data={cityData.bikes} />
                <InstancedGroup path="/models/base_army.glb" data={cityData.army} />

                {/* Unique Landmarks */}
                <Model path="/models/hospitals.glb" position={[30, 12, 132]} scale={30} rotation={[0, Math.PI / 1.2, 0]} />
                <Model path="/models/hospital_2.glb" position={[90, 6, 125]} scale={20} rotation={[0, -Math.PI / 2, 0]} />
                <Model path="/models/school1.glb" position={[-115, 7, 90]} scale={35} rotation={[0, Math.PI / 6, 0]} />
                <Model path="/models/ground.glb" position={[-64, 5.9, 150]} scale={43} rotation={[0, Math.PI, 0]} />
                <Model path="/models/circle_water.glb" position={[0, -1.1, 0]} scale={150} rotation={[0, Math.PI / 2, 0]} />
                <Model path="/models/tower.glb" position={[-30, 0, -40]} scale={50} rotation={[0, Math.PI / 2, 0]} />
                <Model path="/models/missiel.glb" position={[-54, 21, -135]} scale={40} rotation={[0, Math.PI, 0]} />

                {/* Grouped Props (Dome 3, 5, 0) */}
                <group position={getCornerPos(3)}>
                    <Model path="/models/Cabin.glb" position={[-40, -3, 60]} scale={15} rotation={[0, Math.PI / 4, 0]} />
                    <Model path="/models/crops.glb" position={[-40, 4, -40]} scale={35} />
                    <Model path="/models/crops.glb" position={[-50, 4, 20]} scale={35} />
                    <Model path="/models/Cabin.glb" position={[-8, -4, -50]} scale={17} rotation={[0, Math.PI, 0]} />
                    <Model path="/models/farmhouse.glb" position={[-70, -4, -70]} scale={15} />
                    <Model path="/models/sheep.glb" position={[-40, 0, -70]} scale={2.5} />
                    <Model path="/models/sheep.glb" position={[-50, 0, -70]} scale={2.5} rotation={[0, Math.PI, 0]} />
                    <Model path="/models/goat.glb" position={[-80, 2, 30]} scale={2} />
                    <Model path="/models/goat.glb" position={[-80, 2, 10]} scale={2} />
                </group>

                <group position={getCornerPos(5)}>
                    <Model path="/models/farm.glb" position={[55, 5, 5]} scale={40} />
                    <Model path="/models/lake.glb" position={[35, 0, -30]} scale={25} />
                    <Model path="/models/solarpanels.glb" position={[-10, 1, -40]} scale={18} rotation={[Math.PI / 8, 0, 0]} />
                    <Model path="/models/photoroom1.glb" position={[90, 2, 0]} scale={28} rotation={[0, Math.PI / 2, 0]} />
                    <Model path="/models/photoroom2.glb" position={[40, 2, -55]} scale={24} />
                    <Model path="/models/windmill.glb" position={[20, 4, -35]} scale={10} />
                </group>

                <group position={getCornerPos(0)}>
                    <Model path="/models/building.glb" position={[55, 5, 5]} scale={25} />
                    <Model path="/models/building.glb" position={[55, 5, 25]} scale={25} />
                    <Model path="/models/building.glb" position={[35, 6, 50]} scale={25} />
                    <Model path="/models/building.glb" position={[50, 6, 45]} scale={25} />
                    <Model path="/models/resbuilding.glb" position={[60, 12, -25]} scale={28} rotation={[0, Math.PI / 2, 0]} />
                    <Model path="/models/resbuilding.glb" position={[36, 8, -30]} scale={16} />
                    <Model path="/models/resbuilding.glb" position={[20, 8, -35]} scale={16} />
                    <Model path="/models/resbuilding.glb" position={[38.5, 8, -10]} scale={16} rotation={[0, Math.PI / 2, 0]} />
                    <Model path="/models/solarcar.glb" position={[4, 5, 50]} scale={25} rotation={[0, -Math.PI / 2, 0]} />
                    <Model path="/models/AIboard.glb" position={[-10, 3, -50]} scale={18} />
                    <Model path="/models/dustbin.glb" position={[0, 1, -40]} scale={10} />
                    <Model path="/models/solarpanels.glb" position={[8, 8, 43]} scale={12} />
                </group>

                {/* Remaining Miscellaneous Props */}
                <Model path="/models/car.glb" position={[84, 4, 60]} scale={15} />
                <Model path="/models/bus.glb" position={[-89, 4, -50]} scale={15} />
                <Model path="/models/rikshaw.glb" position={[-3, 3.5, -99]} scale={12} rotation={[0, Math.PI, 0]} />
                <Model path="/models/scooty.glb" position={[-109, 4, 40]} scale={8} />
                <Model path="/models/helicopter_def.glb" position={[-109, 31, -100]} scale={30} />
                <Model path="/models/helipad_def.glb" position={[-109, 6, -100]} scale={30} />
                <Model path="/models/ambulance.glb" position={[84, 5, 60]} scale={15} />
                <Model path="/models/plus.glb" position={[89, 12, 127]} scale={5} />
                <Model path="/models/slide.glb" position={[-54, 11, 150]} scale={15} />
                <Model path="/models/Swings.glb" position={[-70, 6, 150]} scale={8} />
                <Model path="/models/seesaw.glb" position={[-66, 3.5, 137]} scale={8} />
                <Model path="/models/bench.glb" position={[-110, 6, 140]} scale={20} />
                <Model path="/models/boys.glb" position={[-65, 4, 165]} scale={8} />
                <Model path="/models/robo.glb" position={[15, 7, 140]} scale={8} />
                <Model path="/models/bot.glb" position={[-90, 7, 100]} scale={10} />
                <Model path="/models/grass.glb" position={[112, 4, -30]} scale={5} />
                <Model path="/models/school_boundary.glb" position={[-115, 7, 90]} scale={60} />
                <Model path="/models/cycle_stand.glb" position={[-115, 7, 116]} scale={20} />
            </Suspense>
        </group>
    );
}
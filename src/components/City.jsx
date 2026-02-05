import { Suspense, useRef, useMemo } from "react"
import { useGLTF, Stars, Sparkles, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import Dome from "./Dome"

function Model({ path, position, scale = 1, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF(path)
    const clonedScene = useMemo(() => scene.clone(), [scene])
    return <primitive object={clonedScene} position={position} scale={[scale, scale, scale]} rotation={rotation} />
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
            zPos: (i * (segmentLength / (treeCount - 1))) - (segmentLength / 2),
            scale: 3 + Math.random() * 3,
            rotation: Math.random() * Math.PI * 2
        }));
    }, [radius]);

    return (
        <group rotation={[0, angle, 0]}>
            {/* MAIN ROAD STRIP */}
            <mesh position={[radius, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[12, radius * 1.15]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* 2. ADDING THE TREES ON BOTH SIDES */}
            {treeData.map((tree, i) => (
                <group key={`road-tree-${i}`} position={[radius, 0, tree.zPos]}>
                    {/* Tree on the Outer Edge */}
                    <Model
                        path="/models/tree.glb"
                        position={[6, 1, 0]}
                        scale={7}
                        rotation={[0, tree.rotation, 0]}
                    />
                    {/* Tree on the Inner Edge */}
                    <Model
                        path="/models/tree.glb"
                        position={[-6, 1, 0]}
                        scale={7}
                        rotation={[0, tree.rotation, 0]}
                    />
                </group>
            ))}

            {/* DASHED LINES */}
            {Array.from({ length: 8 }).map((_, i) => (
                <mesh
                    key={`dash-${i}`}
                    position={[radius + 0.1, 0.05, (i * (radius / 6)) - radius / 2]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <planeGeometry args={[0.2, 3]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            ))}
        </group>
    );
}

function TreeCluster({ position, count = 20, spread = 15 }) {
    // Generate random positions once so they don't jump every frame
    const treePositions = useMemo(() => {
        return Array.from({ length: count }).map(() => ({
            x: (Math.random() - 0.5) * spread,
            z: (Math.random() - 0.5) * spread,
            s: 3 + Math.random() * 3, // Random scale for variety
            r: Math.random() * Math.PI * 2 // Random rotation
        }));
    }, [count, spread]);

    return (
        <group position={position}>
            {treePositions.map((p, i) => (
                <Model
                    key={i}
                    path="/models/tree.glb"
                    position={[p.x, 0, p.z]}
                    scale={p.s}
                    rotation={[0, p.r, 0]}
                />
            ))}
        </group>
    );
}



function MountainBorder() {
    const mountainPath = '/models/mountain2.glb'; // Replace with your actual path

    return (
        <group>
            {/* North Edge */}
            <Model path={mountainPath} position={[150, 0, -245]} scale={280} rotation={[0, 0, 0]} />
            <Model path={mountainPath} position={[0, 0, -245]} scale={260} rotation={[0, 0, 0]} />
            <Model path={mountainPath} position={[-160, 0, -220]} scale={250} rotation={[0, 0, 0]} />

            {/* South Edge */}
            <Model path={mountainPath} position={[150, 24, 245]} scale={200} rotation={[0, Math.PI, 0]} />
            <Model path={mountainPath} position={[-35, 22, 255]} scale={200} rotation={[0, Math.PI, 0]} />


            <Model path={mountainPath} position={[-190, 18, 220]} scale={200} rotation={[0, Math.PI, 0]} />


            {/* East Edge */}
            <Model path={mountainPath} position={[230, 15, -160]} scale={210} rotation={[0, Math.PI, 0]} />
            <Model path={mountainPath} position={[255, 15, -15]} scale={200} rotation={[0, Math.PI, 0]} />
            <Model path={mountainPath} position={[260, 15, 120]} scale={200} rotation={[0, Math.PI, 0]} />

            {/* West Edge */}
            <Model path={mountainPath} position={[-260, 0, -140]} scale={200} rotation={[Math.PI / 8, Math.PI / 6, 0]} />
            <Model path={mountainPath} position={[-240, 6, -30]} scale={200} rotation={[0, Math.PI / 2, 0]} />
            <Model path={mountainPath} position={[-260, 14, 120]} scale={200} rotation={[0, 0, 0]} />
        </group>
    );
}




export default function City({ onSelectDome }) {
    const hexRadius = 110 // How far the domes are from center
    const localRadius = 15 // radius for models around each dome

    const getCornerPos = (i) => [
        Math.cos((i * Math.PI) / 3) * hexRadius,
        1,
        Math.sin((i * Math.PI) / 3) * hexRadius
    ]

    return (

        <group onPointerMissed={() => onSelectDome(null)}>





            {/* 1. THE BIG FLOOR (Added this back) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} onClick={() => onSelectDome(null)}>
                {/* Use planeGeometry for a rectangle: [width, height] */}
                <planeGeometry args={[500, 500]} />
                <meshStandardMaterial color="#0a2b02" roughness={0.8} metalness={0.2} />
            </mesh>

            <MountainBorder />

            {/* 1. THE BIG HEXAGONAL ROAD */}
            {[0, 1, 2, 3, 4, 5].map(i => (
                <HexPerimeterRoad key={i} angle={(i * Math.PI) / 3 + Math.PI / 6} radius={hexRadius - 8} />
            ))}

            {/* --- Vehicles & Transport --- */}
            <Model path="/models/bike.glb" position={[6, 4, 101]} scale={10} rotation={[0, Math.PI / 2, 0]} />
            <Model path="/models/car.glb" position={[84, 4, 60]} scale={15} rotation={[0, Math.PI / 1.2, 0]} />
            <Model path="/models/bus.glb" position={[-89, 4, -50]} scale={15} rotation={[0, Math.PI / 1.2, 0]} />
            <Model path="/models/rikshaw.glb" position={[-9, 4, -107]} scale={12} rotation={[0, Math.PI, 0]} />
            <Model path="/models/scooty.glb" position={[-109, 4, 40]} scale={8} rotation={[0, Math.PI / 5, 0]} />

            {/* --- Defense Hub --- */}
            <Model path="/models/missiel.glb" position={[-54, 21, -135]} scale={40} rotation={[0, Math.PI, 0]} />
            <Model path="/models/def_veh.glb" position={[-89, 9, -130]} scale={20} rotation={[0, Math.PI / 4, 0]} />
            <Model path="/models/helicopter_def.glb" position={[-109, 31, -100]} scale={30} rotation={[0, Math.PI / 4, 0]} />
            <Model path="/models/helipad_def.glb" position={[-109, 6, -100]} scale={30} rotation={[0, Math.PI / 4, 0]} />

            {/* --- Medical Hub --- */}
            <Model path="/models/hospitals.glb" position={[35, 12, 140]} scale={30} rotation={[0, Math.PI / 1.2, 0]} />
            <Model path="/models/hospital_2.glb" position={[100, 6, 120]} scale={20} rotation={[0, -Math.PI / 2, 0]} />
            <Model path="/models/plus.glb" position={[100, 13, 120]} scale={5} rotation={[0, 0, 0]} />
            <Model path="/models/ambulance.glb" position={[76, 6, 145]} scale={15} rotation={[0, Math.PI, 0]} />
            <Model path="/models/helicopter.glb" position={[35, 28, 140]} scale={20} rotation={[-0.2, Math.PI / 6, 0.1]} />
            <Model path="/models/docs.glb" position={[-70, 3.5, 73]} scale={4} rotation={[0, -Math.PI / 2, 0]} />

            {/* --- School & Education Hub --- */}
            <Model path="/models/school1.glb" position={[-115, 7, 90]} scale={35} rotation={[0, Math.PI / 6, 0]} />
            <Model path="/models/school_boundary.glb" position={[-115, 7, 90]} scale={60} rotation={[0, -Math.PI / 1.2, 0]} />
            <Model path="/models/cycle_stand.glb" position={[-115, 7, 116]} scale={20} rotation={[0, Math.PI / 6, 0]} />
            <Model path="/models/students.glb" position={[-95, 9.8, 115]} scale={10} rotation={[0, Math.PI / 3, 0]} />
            <Model path="/models/parent_child.glb" position={[100, 4, -31]} scale={10} rotation={[0, -0.6, 0]} />

            {/* --- Bicycles (Student Area) --- */}
            <Model path="/models/bycycle.glb" position={[-118, 7, 120]} scale={10} rotation={[0, Math.PI / 0.9, 0]} />
            <Model path="/models/bycycle1.glb" position={[-115, 7, 118]} scale={10} rotation={[0, Math.PI / 0.9, 0]} />
            <Model path="/models/bycycle2.glb" position={[-112, 7, 115]} scale={10} rotation={[0, Math.PI / 0.9, 0]} />
            <Model path="/models/bycycle3.glb" position={[-110, 7, 114]} scale={10} rotation={[0, Math.PI / 0.9, 0]} />

            {/* --- Park & Recreation --- */}
            <Model path="/models/ground.glb" position={[-64, 5.9, 150]} scale={43} rotation={[0, Math.PI, 0]} />
            <Model path="/models/slide.glb" position={[-54, 11, 150]} scale={15} rotation={[0, Math.PI, 0]} />
            <Model path="/models/Swings.glb" position={[-70, 6, 150]} scale={8} rotation={[0, Math.PI, 0]} />
            <Model path="/models/seesaw.glb" position={[-66, 3.5, 137]} scale={8} rotation={[0, Math.PI, 0]} />
            <Model path="/models/bench.glb" position={[-110, 6, 140]} scale={20} rotation={[0, Math.PI / 7, 0]} />
            <Model path="/models/bench2.glb" position={[-105, 6, 150]} scale={20} rotation={[0, Math.PI / 7, 0]} />
            <Model path="/models/boys.glb" position={[-65, 4, 165]} scale={8} rotation={[0, Math.PI / 2, 0]} />

            {/* --- Energy & Robotics --- */}
            <Model path="/models/solarpanels.glb" position={[10, 9, -131]} scale={8} rotation={[0, Math.PI / 2, 0]} />
            <Model path="/models/windmill.glb" position={[20, 11.8, -155]} scale={20} rotation={[0, -Math.PI / 2, 0]} />
            <Model path="/models/robo.glb" position={[30, 9, 160]} scale={8} rotation={[0, -0.6, 0]} />
            <Model path="/models/robo2.glb" position={[87, 3, 120]} scale={8} rotation={[0, -0.6, 0]} />
            <Model path="/models/bot.glb" position={[-90, 7, 100]} scale={10} rotation={[0, Math.PI / 5, 0]} />

            {/* --- Nature & Environment --- */}
            <Model path="/models/grass.glb" position={[112, 4, -30]} scale={5} rotation={[0, -0.6, 0]} />
            <Model path="/models/grass2.glb" position={[110, 4, -30]} scale={5} rotation={[0, -0.6, 0]} />
            <Model path="/models/grass3.glb" position={[108, 4, -31]} scale={5} rotation={[0, -0.6, 0]} />
            <Model path="/models/circle_water.glb" position={[0, -1.1, 0]} scale={150} rotation={[0, Math.PI / 2, 0]} />

            {/* --- UI/Logo --- */}
            <SkyLogoI position={[0, -200, -2200]} size={90} />


            <Suspense fallback={null}>
                {/* 2. THE 7 DOMES (6 Corners + 1 Center) */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                    const pos = i === 6 ? [0, 1, 0] : getCornerPos(i)
                    return (<group key={i}>
                        {/* 1. The Light: Positioned relative to the dome */}
                        <directionalLight
                            position={[pos[0] + 20, 50, pos[2] + 20]}
                            intensity={0.5}
                            color="#ffffff"
                            castShadow
                            // This ensures the light points at the dome's position
                            target-position={[pos[0], 0, pos[2]]}
                        />

                        {/* 2. The Dome */}
                        <Dome
                            position={pos}
                            onClick={() => onSelectDome(pos)}
                        />

                        <Model
                            path="/models/blue_base.glb"
                            position={pos}           // 👈 Use the dome's position here
                            scale={65}
                            rotation={[0, Math.PI / 2, 0]}
                        />
                    </group>
                    );
                })}


                {/* --- DOME 4: ANIMAL HUSBANDRY & MANUAL FARMING --- */}
                <group position={getCornerPos(3)}>

                    {/* 1. TWO FARMHOUSES */}
                    <Model path="/models/farmhouse.glb" position={[34, 2, 40]} scale={25} rotation={[0, Math.PI / 4, 0]} />
                    <Model path="/models/farmhouse.glb" position={[-8, 2, -50]} scale={35} rotation={[0, Math.PI, 0]} />

                    <Model path="/models/Cabin.glb" position={[-70, -4, -70]} scale={15} rotation={[0, 0, 0]} />

                    <Model path="/models/sheep.glb" position={[-30, 0, -70]} scale={5} rotation={[0, 0, 0]} />
                    <Model path="/models/sheep.glb" position={[-50, 0, -70]} scale={5} rotation={[0, Math.PI, 0]} />

                    <Model path="/models/goat.glb" position={[-80, 2, 30]} scale={3} rotation={[0, - Math.PI / 6, 0]} />
                    <Model path="/models/goat.glb" position={[-80, 2, 50]} scale={3} rotation={[0, Math.PI, 0]} />
                    <Model path="/models/goat.glb" position={[-80, 2, 10]} scale={3} rotation={[0, Math.PI / 6, 0]} />

                    {/* 2. TWO FARMS (Fields) */}
                    <Model path="/models/crops.glb" position={[-40, 4, -40]} scale={35} rotation={[0, Math.PI, 0]} />
                    <Model path="/models/crops.glb" position={[-50, 4, 20]} scale={35} rotation={[0, Math.PI, 0]} />

                    {/* 3. COWS (6 Units) */}
                    <Model path="/models/Cow.glb" position={[20, 1, -30]} scale={12} rotation={[0, 0.5, 0]} />
                    <Model path="/models/Cow.glb" position={[25, 1, -32]} scale={12} rotation={[0, 1.2, 0]} />
                    <Model path="/models/Cow.glb" position={[30, 1, -28]} scale={12} rotation={[0, -0.8, 0]} />
                    <Model path="/models/Cow.glb" position={[22, 1, -38]} scale={12} rotation={[0, 2.5, 0]} />
                    <Model path="/models/Cow.glb" position={[28, 1, -35]} scale={12} rotation={[0, 0, 0]} />
                    <Model path="/models/Cow.glb" position={[35, 1, -33]} scale={12} rotation={[0, 3.1, 0]} />

                    {/* 4. HORSES (4 Units) */}
                    <Model path="/models/Horse.glb" position={[-30, -0.5, 40]} scale={12} rotation={[0, 1.5, 0]} />
                    <Model path="/models/Horse.glb" position={[-25, -0.5, 25]} scale={12} rotation={[0, -1.0, 0]} />
                    <Model path="/models/Horse.glb" position={[-14, -0.5, 35]} scale={12} rotation={[0, 0.2, 0]} />
                    <Model path="/models/Horse.glb" position={[-29, -.5, 35]} scale={12} rotation={[0, 2.1, 0]} />

                    {/* 5. CHICKENS (12 Units) - Clustered near Farmhouse 1 */}
                    <Model path="/models/chicken.glb" position={[30, 0.5, 20]} scale={4} />
                    <Model path="/models/chicken.glb" position={[32, 0.5, 21]} scale={4} />
                    <Model path="/models/chicken.glb" position={[31, 0.5, 19]} scale={4} />
                    <Model path="/models/chicken.glb" position={[34, 0.5, 22]} scale={4} />
                    <Model path="/models/chicken.glb" position={[29, 0.5, 23]} scale={4} />
                    <Model path="/models/chicken.glb" position={[33, 0.5, 18]} scale={6} />
                    <Model path="/models/chicken.glb" position={[35, 0.5, 20]} scale={4} />


                    {/* 6. TREES (Fixed Positions) */}
                    <Model path="/models/tree.glb" position={[50, 0, -50]} scale={8} />
                    <Model path="/models/tree.glb" position={[-50, 0, 50]} scale={8} />
                    <Model path="/models/tree.glb" position={[0, 0, 70]} scale={8} />
                    <Model path="/models/tree.glb" position={[0, 0, -70]} scale={8} />

                    {/* 7. GRASS TYPES (Sample placements for you to duplicate) */}
                    <Model path="/models/grass.glb" position={[15, 0, 15]} scale={3} />
                    <Model path="/models/grass2.glb" position={[18, 0, 12]} scale={3} />
                    <Model path="/models/grass3.glb" position={[12, 0, 18]} scale={3} />

                    <directionalLight position={[10, 40, 10]} intensity={1.5} target-position={[0, 0, 0]} />
                </group>


                {/* --- DOME 5: THE RESOURCE & NATURE HUB --- */}
                <group position={getCornerPos(5)}>
                    {/* Main Resource Models around the dome */}
                    <Model path="/models/farm.glb" position={[55, 5, 5]} scale={40} />
                    <Model path="/models/farm.glb" position={[60, 5, -25]} scale={30} />
                    <TreeCluster position={[30, 1, 0]} count={10} spread={11} />
                    <TreeCluster position={[40, 1, -30]} count={20} spread={12} />
                    <TreeCluster position={[35, 1, 25]} count={25} spread={12} />
                    <TreeCluster position={[55, 1, 55]} count={20} spread={12} />
                    <TreeCluster position={[-30, 1, -20]} count={30} spread={12} />
                    <Model path="/models/lake.glb" position={[35, 0, -30]} scale={25} />
                    <Model path="/models/windmills.glb" position={[20, 4, -35]} scale={10} />



                    {/* Solar Panels tucked behind the dome */}
                    <Model path="/models/solarpanels.glb" position={[-10, 1, -40]} scale={18} rotation={[Math.PI / 8, 0, 0]} />
                    <Model path="/models/solarpanels.glb" position={[0, 1, -40]} scale={18} rotation={[Math.PI / 8, 0, 0]} />
                    {/* 2 Photo Rooms integrated into the nature zone */}
                    <Model path="/models/photoroom1.glb" position={[4, 2, 45]} scale={25} />
                    <Model path="/models/photoroom4.glb" position={[-25, 2, 35]} scale={20} />




                    {/* Dense Tree Fill Behind Dome 5 */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <Model
                            key={`tree-d5-${i}`}
                            path="/models/tree.glb"
                            position={[
                                Math.cos(i) * 40,
                                0,
                                -30 - (Math.random() * 20) // Deep behind the dome
                            ]}
                            scale={4 + Math.random() * 3}
                        />
                    ))}
                </group>

                {/* residential area */}
                <group position={getCornerPos(0)}>

                    <Model path="/models/building.glb" position={[55, 5, 5]} scale={25} />
                    <Model path="/models/building.glb" position={[55, 5, 25]} scale={25} />
                    <Model path="/models/building.glb" position={[35, 6, 45]} scale={25} />
                    <Model path="/models/resbuilding.glb" position={[60, 12, -25]} scale={28} />



                    <Model path="/models/resbuilding.glb" position={[36, 8, -30]} scale={16} />
                    <Model path="/models/resbuilding.glb" position={[20, 8, -35]} scale={16} />
                    <TreeCluster position={[20, 1, 10]} count={10} spread={11} />


                    {/* Solar Panels tucked behind the dome */}
                    <Model path="/models/AIboard.glb" position={[-10, 3, -50]} scale={18} rotation={[0, -Math.PI / 6, 0]} />
                    <Model path="/models/dustbin.glb" position={[0, 1, -40]} scale={10} rotation={[Math.PI / 8, 0, 0]} />
                    {/* 2 Photo Rooms integrated into the nature zone */}
                    <Model path="/models/solarcar.glb" position={[4, 5, 50]} scale={25} rotation={[0, -Math.PI / 2, 0]} />
                    <Model path="/models/solarcar.glb" position={[-30, 5, 40]} scale={20} rotation={[0, Math.PI / 2, 0]} />

                </group>




            </Suspense>
        </group>
    )
}
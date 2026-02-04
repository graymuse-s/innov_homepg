import { Suspense, useRef, useMemo } from "react"
import { useGLTF, Stars, Sparkles } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import Dome from "./Dome"

function Model({ path, position, scale = 1, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF(path)
    const clonedScene = useMemo(() => scene.clone(), [scene])
    return <primitive object={clonedScene} position={position} scale={[scale, scale, scale]} rotation={rotation} />
}

function SeeSaw({ position }) {
    const { scene } = useGLTF("/models/seesaw.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={10}
                rotation={[0, Math.PI, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Park_swing({ position }) {
    const { scene } = useGLTF("/models/Swings.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={10}
                rotation={[0, Math.PI, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Park_slide({ position }) {
    const { scene } = useGLTF("/models/slide.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={10}
                rotation={[0, Math.PI, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}
function Park({ position }) {
    const { scene } = useGLTF("/models/ground.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={40}
                rotation={[0, Math.PI, 0]}
                position={[-4, 0.9, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Student({ position }) {
    const { scene } = useGLTF("/models/students.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={8}
                rotation={[0, Math.PI / 2, 0]}
                position={[0, 1.8, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Windmill({ position }) {
    const { scene } = useGLTF("/models/windmill.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={20}
                rotation={[0, -Math.PI / 2, 0]}
                position={[0, 1.8, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function SolarPanels({ position }) {
    const { scene } = useGLTF("/models/solarpanels.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={8}
                rotation={[0, Math.PI / 2, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bycycle({ position }) {
    const { scene } = useGLTF("/models/bycycle.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={12}
                rotation={[0, Math.PI / 0.9, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}
function Boys({ position }) {
    const { scene } = useGLTF("/models/boys.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={6}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bycycle1({ position }) {
    const { scene } = useGLTF("/models/bycycle1.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={12}
                rotation={[0, Math.PI / 0.9, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bycycle2({ position }) {
    const { scene } = useGLTF("/models/bycycle2.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={12}
                rotation={[0, Math.PI / 0.9, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bycycle3({ position }) {
    const { scene } = useGLTF("/models/bycycle3.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={12}
                rotation={[0, Math.PI / 0.9, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function CycleStand({ position }) {
    const { scene } = useGLTF("/models/cycle_stand.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={30}
                rotation={[0, Math.PI / 6, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Boundary({ position }) {
    const { scene } = useGLTF("/models/school_boundary.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={60}
                rotation={[0, Math.PI / 6, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function School1({ position }) {
    const { scene } = useGLTF("/models/school1.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={60}
                rotation={[0, Math.PI / 5, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Parent({ position }) {
    const { scene } = useGLTF("/models/parent_child.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={10}
                rotation={[0, -0.6, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bush({ position }) {
    const { scene } = useGLTF("/models/grass.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={5}
                rotation={[0, -0.6, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bush2({ position }) {
    const { scene } = useGLTF("/models/grass2.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={5}
                rotation={[0, -0.6, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bush3({ position }) {
    const { scene } = useGLTF("/models/grass3.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={5}
                rotation={[0, -0.6, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Robo2({ position }) {
    const { scene } = useGLTF("/models/robo2.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={13}
                rotation={[0, -0.6, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Docs({ position }) {
    const { scene } = useGLTF("/models/docs.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={4}
                rotation={[0, -Math.PI / 2, 0]}
                position={[0, 2, 3]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Plus({ position }) {
    const { scene } = useGLTF("/models/plus.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={10}
                rotation={[0, 0, 0]}
                position={[0, 1.8, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Helicopter({ position }) {
    const { scene } = useGLTF("/models/helicopter.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={30}
                rotation={[-0.2, Math.PI / 6, 0.1]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Robo({ position }) {
    const { scene } = useGLTF("/models/robo.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={15}
                rotation={[0, -0.6, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Hospital({ position }) {
    const { scene } = useGLTF("/models/hospitals.glb");

    return (
        <group position={position}>
            {/* Move model DOWN so its base touches ground */}
            <primitive
                object={scene}
                scale={48}
                rotation={[0, Math.PI / 1.2, 0]}
                position={[0, 2, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Hospital2({ position }) {
    const { scene } = useGLTF("/models/hospital_2.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={40}
                rotation={[0, -Math.PI / 2, 0]}
                position={[0, 1.8, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Helipad({ position }) {
    const { scene } = useGLTF("/models/helipad_def.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={30}
                rotation={[0, Math.PI / 4, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Helicopter_Def({ position }) {
    const { scene } = useGLTF("/models/helicopter_def.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={30}
                rotation={[0, Math.PI / 4, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Def_Veh({ position }) {
    const { scene } = useGLTF("/models/def_veh.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={20}
                rotation={[0, Math.PI / 4, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Missiel({ position }) {
    const { scene } = useGLTF("/models/missiel.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={40}
                rotation={[0, Math.PI, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Scooty({ position }) {
    const { scene } = useGLTF("/models/scooty.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={10}
                rotation={[0, Math.PI / 5, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bus({ position }) {
    const { scene } = useGLTF("/models/bus.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={20}
                rotation={[0, Math.PI / 1.2, 0]}
                position={[-4, 0.9, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Car({ position }) {
    const { scene } = useGLTF("/models/car.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={25}
                rotation={[0, Math.PI / 1.2, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Water({ position }) {
    const { scene } = useGLTF("/models/circle_water.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={100}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 0.9, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Bike({ position }) {
    const { scene } = useGLTF("/models/bike.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={20}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 0.9, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Rikshaw({ position }) {
    const { scene } = useGLTF("/models/rikshaw.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={15}
                rotation={[0, Math.PI, 0]}
                position={[-4, 1, 0]} // 👈 THIS IS THE FIX
            />
        </group>
    );
}

function Base_Blue({ position }) {
    const { scene } = useGLTF("/models/blue_base.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={55}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 1, 0]}
            />
        </group>
    );
}

function Base_Blue1({ position }) {
    const { scene } = useGLTF("/models/blue_base1.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={55}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 1, 0]}
            />
        </group>
    );
}

function Base_Blue2({ position }) {
    const { scene } = useGLTF("/models/blue_base2.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={55}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 1, 0]}
            />
        </group>
    );
}

function Base_Blue3({ position }) {
    const { scene } = useGLTF("/models/blue_base3.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={55}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 1, 0]}
            />
        </group>
    );
}

function Base_Blue4({ position }) {
    const { scene } = useGLTF("/models/blue_base4.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={55}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 1, 0]}
            />
        </group>
    );
}

function Base_Blue5({ position }) {
    const { scene } = useGLTF("/models/blue_base5.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={55}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 1, 0]}
            />
        </group>
    );
}

function Base_Blue6({ position }) {
    const { scene } = useGLTF("/models/blue_base6.glb");

    return (
        <group position={position}>
            <primitive
                object={scene}
                scale={55}
                rotation={[0, Math.PI / 2, 0]}
                position={[-4, 1, 0]}
            />
        </group>
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
                <planeGeometry args={[6, radius * 1.15]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* 2. ADDING THE TREES ON BOTH SIDES */}
            {treeData.map((tree, i) => (
                <group key={`road-tree-${i}`} position={[radius, 0, tree.zPos]}>
                    {/* Tree on the Outer Edge */}
                    <Model
                        path="/models/tree.glb"
                        position={[5, 1, 0]}
                        scale={tree.scale}
                        rotation={[0, tree.rotation, 0]}
                    />
                    {/* Tree on the Inner Edge */}
                    <Model
                        path="/models/tree.glb"
                        position={[-5, 1, 0]}
                        scale={tree.scale * 0.8}
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
                <meshStandardMaterial color="#b7b552" roughness={0.8} metalness={0.2} />
            </mesh>
            {/* 1. THE BIG HEXAGONAL ROAD */}
            {[0, 1, 2, 3, 4, 5].map(i => (
                <HexPerimeterRoad key={i} angle={(i * Math.PI) / 3 + Math.PI / 6} radius={hexRadius - 8} />
            ))}


            <Base_Blue position={[113, 2, 0]} />
            <Base_Blue1 position={[-105, 2, 0]} />
            <Base_Blue2 position={[-50, 2, 95]} />
            <Base_Blue3 position={[60, 2, -95]} />
            <Base_Blue4 position={[60, 2, 95]} />
            <Base_Blue5 position={[-52, 2, -95]} />
            <Base_Blue6 position={[4, 2, 0]} />
            <Bike position={[10, 4, 101]} />
            <Car position={[88, 4, 60]} />
            <Bus position={[-85, 4, -50]} />
            <Rikshaw position={[-5, 4, -107]} />
            <Scooty position={[-100, 4, 40]} />
            <Missiel position={[-50, 20, -135]} />
            <Def_Veh position={[-85, 8, -130]} />
            <Helicopter_Def position={[-105, 30, -100]} />
            <Helipad position={[-105, 5, -100]} />
            <Hospital position={[35, 10, 140]} />
            <Robo position={[10, 5, 160]} />
            <Helicopter position={[35, 30, 140]} />
            <Docs position={[-70, 1.5, 70]} />

            <Bush position={[112, 2, -30]} />
            <Bush2 position={[110, 2, -30]} />
            <Bush3 position={[108, 2, -31]} />
            <Parent position={[100, 2, -31]} />
            <School1 position={[-125, 5, 70]} />
            <Boundary position={[-125, 0, 70]} />
            <CycleStand position={[-120, 0, 105]} />
            <Bycycle position={[-110, 0, 100]} />
            <Bycycle1 position={[-114, 0, 103]} />
            <Bycycle2 position={[-116, 0, 104]} />
            <Bycycle3 position={[-120, 0, 105]} />
            <SolarPanels position={[10, 7, -131]} />
            <Windmill position={[20, 10, -155]} />
            <Student position={[15, 2, -105]} />
            <Park position={[-15, 3, -75]} />
            <Park_slide position={[-15, 5, -70]} />
            <Park_swing position={[-10, 3, -80]} />
            <SeeSaw position={[-20, 3, -80]} />
            <Boys position={[-25, 3, -70]} />
            <Hospital2 position={[110, 10, 105]} />
            <Plus position={[100, 10, 120]} />
            <Robo2 position={[90, 6, 120]} />


            <Suspense fallback={null}>
                {/* 2. THE 7 DOMES (6 Corners + 1 Center) */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                    const pos = i === 6 ? [0, 1, 0] : getCornerPos(i)
                    return <Dome key={i} position={pos} onClick={() => onSelectDome(pos)} />
                })}





                {/* --- DOME 5: THE RESOURCE & NATURE HUB --- */}
                <group position={getCornerPos(5)}>
                    {/* Main Resource Models around the dome */}
                    <Model path="/models/farm.glb" position={[50, 5, 5]} scale={40} />
                    <Model path="/models/farm.glb" position={[55, 5, -25]} scale={30} />
                    <TreeCluster position={[25, 1, 0]} count={20} spread={12} />
                    <TreeCluster position={[40, 1, -30]} count={20} spread={12} />
                    <TreeCluster position={[35, 1, 25]} count={25} spread={12} />
                    <TreeCluster position={[55, 1, 55]} count={20} spread={12} />
                    <TreeCluster position={[-30, 1, -20]} count={30} spread={12} />
                    <Model path="/models/lake.glb" position={[25, 0, -20]} scale={25} />
                    <Model path="/models/windmills.glb" position={[10, 0, -25]} scale={6} />

                    <Model path="/models/mountain.glb" position={[-100, 1, -80]} scale={150} rotation={[Math.PI / 8, 0, 0]} />
                    <Model path="/models/mountain.glb" position={[-50, 1, -80]} scale={150} rotation={[Math.PI / 8, 0, 0]} />
                    <Model path="/models/mountain.glb" position={[40, 1, -80]} scale={150} rotation={[Math.PI / 8, 0, 0]} />

                    {/* Solar Panels tucked behind the dome */}
                    <Model path="/models/solarpanels.glb" position={[-10, 1, -20]} scale={18} rotation={[Math.PI / 8, 0, 0]} />
                    <Model path="/models/solarpanels.glb" position={[0, 1, -30]} scale={18} rotation={[Math.PI / 8, 0, 0]} />
                    {/* 2 Photo Rooms integrated into the nature zone */}
                    <Model path="/models/photoroom1.glb" position={[4, 2, 25]} scale={25} />
                    <Model path="/models/photoroom4.glb" position={[-25, 2, 15]} scale={20} />

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






            </Suspense>
        </group>
    )
}
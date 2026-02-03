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

function SceneBackground() {
    return (
        <>
            {/* Sharp white background stars */}
            <Stars
                radius={300}
                depth={60}
                count={20000}
                factor={1.5}
                saturation={0}
                fade
                speed={1}
            />

            {/* The "Teal Nebula" effect using Sparkles */}
            {/* This creates the dense, glowing teal clouds */}
            <Sparkles
                count={3000}
                scale={[400, 100, 400]} // Spread them wide across the horizon
                size={6}
                speed={0.4}
                opacity={0.8}
                color="#008080" // Teal color
            />

            {/* Secondary glow for depth */}
            <Sparkles
                count={1000}
                scale={[300, 50, 300]}
                size={12}
                speed={0.2}
                color="#20b2aa" // Light Sea Green
            />
        </>
    )
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
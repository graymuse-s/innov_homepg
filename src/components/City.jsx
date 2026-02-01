import { Suspense, useRef, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import Dome from "./Dome"

function Model({ path, position, scale = 1, rotation = [0, 0, 0] }) {
    const { scene } = useGLTF(path)
    const clonedScene = useMemo(() => scene.clone(), [scene])
    return <primitive object={clonedScene} position={position} scale={[scale, scale, scale]} rotation={rotation} />
}

// Solid road segment for the Hexagon perimeter
function HexPerimeterRoad({ angle, radius }) {
    return (
        <group rotation={[0, angle, 0]}>
            <mesh position={[radius, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[6, radius * 1.15]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            {/* Dashed line */}
            {Array.from({ length: 8 }).map((_, i) => (
                <mesh
                    key={i}
                    position={[radius + 0.1, 0.05, (i * (radius / 6)) - radius / 2]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <planeGeometry args={[0.2, 3]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            ))}
        </group>
    )
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
        <group>
            <ambientLight intensity={0.8} />
            <directionalLight position={[50, 50, 20]} intensity={1.5} />

            {/* 1. THE BIG FLOOR (Added this back) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <circleGeometry args={[200, 6]} />
                <meshStandardMaterial color="#051205" />
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

                {/* 3. SECTION: RESIDENTIAL (Corners 0 & 1) */}
                {[0, 1].map(corner => (
                    <group key={corner} position={getCornerPos(corner)}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Model
                                key={i}
                                path="/models/building.glb"
                                position={[Math.cos(i) * localRadius, 5, Math.sin(i) * localRadius]}
                                scale={8}
                            />
                        ))}
                    </group>
                ))}

                {/* 4. SECTION: HOSPITALS (Corner 2) */}
                <group position={getCornerPos(2)}>
                    <Model path="/models/hospital.glb" position={[localRadius + 8, 6, 0]} scale={25} />
                    <Model path="/models/hospital2.glb" position={[-localRadius - 10, 8, 0]} scale={25} />
                </group>

                {/* 5. SECTION: EDUCATION (Corner 3) */}
                <group position={getCornerPos(3)}>
                    <Model path="/models/playground.glb" position={[0, 2, 0]} scale={22} />
                    <Model path="/models/building.glb" position={[localRadius, 8, localRadius]} scale={15} />
                </group>

                {/* 6. SECTION: ENERGY - WIND (Corner 4) */}
                <group position={getCornerPos(4)}>
                    {[0, 1, 2].map(i => (
                        <Model
                            key={i}
                            path="/models/windmills.glb"
                            position={[Math.cos(i * 2) * localRadius, 0, Math.sin(i * 2) * localRadius]}
                            scale={5}
                        />
                    ))}
                </group>

                {/* 7. SECTION: FARM & SOLAR (Corner 5) */}
                <group position={getCornerPos(5)}>
                    <Model path="/models/solarpanels.glb" position={[0, 1, 0]} scale={18} />
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Model key={i} path="/models/tree.glb" position={[Math.cos(i) * localRadius, 0, Math.sin(i) * localRadius]} scale={4} />
                    ))}
                </group>

                {/* 8. CENTER SECTION: THE UNEVEN LAKE */}
                <group position={[0, 0, 0]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                        <circleGeometry args={[12, 32]} />
                        <meshStandardMaterial color="#003366" roughness={0.2} />
                    </mesh>
                    {/* Dense forest around the center dome */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Model key={i} path="/models/tree.glb" position={[Math.cos(i) * 20, 0, Math.sin(i) * 20]} scale={6} />
                    ))}
                </group>

                {/* 9. SOCIAL GOOD (RESERVED EMPTY SPACE) */}
                {/* These spaces between the hex roads and center are now naturally empty */}
            </Suspense>
        </group>
    )
}
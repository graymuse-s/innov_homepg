import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import { useGLTF } from "@react-three/drei" // Add this package








export default function Dome({ position, onClick, visible = true }) {
    return (
        <group visible={visible} position={position}>
            {/* Base platform */}


            {/* Glass Dome (hemisphere) */}
            <mesh onClick={(e) => {
                e.stopPropagation(); // 👈 THIS IS THE FIX
                onClick();
            }}>
                <sphereGeometry
                    args={[25, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]}
                />
                <meshPhysicalMaterial
                    transmission={1}
                    thickness={0.6}
                    roughness={0.1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    ior={1.45}
                    envMapIntensity={1}
                    transparent

                />
            </mesh>





        </group>
    )
}
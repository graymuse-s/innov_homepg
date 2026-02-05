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
                    args={[30, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]}
                />
                <meshPhysicalMaterial
                    transmission={1}
                    thickness={1.5}          // Increased for better light bending
                    roughness={0}         // Keep low for that "shine"
                    clearcoat={1}
                    clearcoatRoughness={0}
                    ior={1.2}                // Lower IOR reduces the "mirror" glare effect

                    /* COLOR & GLOW */
                    color="#3a6989"          // Base blue
                    emissive="#003366"       // Subtle blue glow so it doesn't look black in shadows

                    /* THE FIX FOR REFLECTIONS */
                    reflectivity={0}         // CRITICAL: Removes the "light bulb" reflections
                    envMapIntensity={1}      // Removes reflections from the sky/stars
                    transparent
                    opacity={0.6}
                />
            </mesh>





        </group>
    )
}
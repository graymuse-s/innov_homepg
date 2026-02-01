import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function TechRing({ triggerRotate }) {
    const ringRef = useRef()
    const angle = useRef(0)
    const rotatedOnce = useRef(false)

    useFrame(() => {
        if (!triggerRotate || rotatedOnce.current) return

        angle.current += 0.03

        if (angle.current >= Math.PI * 2) {
            angle.current = Math.PI * 2
            rotatedOnce.current = true
        }

        ringRef.current.rotation.y = angle.current
    })

    const radius = 2.8
    const icons = 6

    return (
        <group ref={ringRef}>
            {[...Array(icons)].map((_, i) => {
                const theta = (i / icons) * Math.PI * 2
                return (
                    <mesh
                        key={i}
                        position={[
                            radius * Math.cos(theta),
                            0.6,
                            radius * Math.sin(theta),
                        ]}
                    >
                        {/* Icon placeholder (replace later with models/icons) */}
                        <boxGeometry args={[0.4, 0.4, 0.4]} />
                        <meshStandardMaterial
                            color="#22d3ee"
                            emissive="#0891b2"
                        />
                    </mesh>
                )
            })}
        </group>
    )
}
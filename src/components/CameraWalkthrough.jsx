import { useThree, useFrame } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import * as THREE from "three"

export default function CameraWalkthrough({ target, active }) {
    const { camera } = useThree()

    const t = useRef(0)

    const desiredPos = useRef(new THREE.Vector3())
    const lookAtPos = useRef(new THREE.Vector3())

    useEffect(() => {
        t.current = 0

        camera.near = 0.1
        camera.far = 3000
        camera.updateProjectionMatrix()
    }, [target, camera])

    // ===== 🎚 CINEMATIC TUNING =====
    const startRadius = 15
    const endRadius = 9

    const startAngleOffset = Math.PI * 0.22 // ~40°
    const totalOrbit = Math.PI * 2          // full 360°

    const baseHeight = 4
    const endHeight = 9

    const speed = 0.002

    const posLerp = 0.085
    const lookLerp = 0.12

    // Smooth cinematic easing
    const ease = (x) => x * x * (3 - 2 * x)

    useFrame(() => {
        if (!active || !target) return

        // Advance single timeline
        t.current = Math.min(t.current + speed, 1)
        const e = ease(t.current)

        // ===== SINGLE PARAMETRIC PATH =====

        // Radius tightens smoothly
        const radius = THREE.MathUtils.lerp(
            startRadius,
            endRadius,
            e
        )

        // Angle advances continuously (clockwise)
        const angle =
            Math.PI / 2 - startAngleOffset +
            totalOrbit * e

        // Height rises gently near the end
        const height = THREE.MathUtils.lerp(
            baseHeight,
            endHeight,
            ease(Math.max(0, (e - 0.65) / 0.35))
        )

        desiredPos.current.set(
            target[0] + Math.cos(angle) * radius,
            target[1] + height,
            target[2] + Math.sin(angle) * radius
        )

        camera.position.lerp(desiredPos.current, posLerp)

        lookAtPos.current.set(
            target[0],
            target[1] + 1.2,
            target[2]
        )

        camera.lookAt(
            camera.position.clone().lerp(
                lookAtPos.current,
                lookLerp
            )
        )
    })

    return null
}
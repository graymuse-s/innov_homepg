import { useGLTF, useTexture } from "@react-three/drei"

// ✅ Models
useGLTF.preload("/models/tree.glb")
useGLTF.preload("/models/mountain.glb")
useGLTF.preload("/models/blue_base.glb")
useGLTF.preload("/models/building.glb")
useGLTF.preload("/models/resbuilding.glb")
useGLTF.preload("/models/solarpanels.glb")
useGLTF.preload("/models/car.glb")
useGLTF.preload("/models/bus.glb")
useGLTF.preload("/models/bench.glb")
useGLTF.preload("/models/grass.glb")

// ✅ Textures
useTexture.preload("/images/logo.png")

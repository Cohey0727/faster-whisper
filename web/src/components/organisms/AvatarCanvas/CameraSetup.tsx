import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

const CAMERA_POSITION = new THREE.Vector3(0, 1.4, 1.5)
const LOOK_AT = new THREE.Vector3(0, 1.2, 0)
const MIN_DISTANCE = 0.5
const MAX_DISTANCE = 4

export function CameraSetup() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.copy(CAMERA_POSITION)
    camera.lookAt(LOOK_AT)
  }, [camera])

  return (
    <OrbitControls
      target={LOOK_AT}
      enableRotate={false}
      enablePan={true}
      enableZoom={true}
      minDistance={MIN_DISTANCE}
      maxDistance={MAX_DISTANCE}
    />
  )
}

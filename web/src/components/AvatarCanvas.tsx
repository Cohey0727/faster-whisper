import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm"
import type { Viseme } from "../hooks/useChat"
import { useLipSync } from "../hooks/useLipSync"

interface AvatarCanvasProps {
  readonly visemes: readonly Viseme[]
  readonly audioBase64: string
}

function CameraSetup() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 1.4, 1.5)
    camera.lookAt(0, 1.2, 0)
  }, [camera])

  return null
}

function AvatarModel({
  visemes,
  audioBase64,
}: {
  readonly visemes: readonly Viseme[]
  readonly audioBase64: string
}) {
  const [vrm, setVrm] = useState<VRM | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const nextBlinkRef = useRef(0)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.register((parser) => new VRMLoaderPlugin(parser))

    loader.load(
      "/models/avatar.vrm",
      (gltf) => {
        const loadedVrm = gltf.userData.vrm as VRM
        loadedVrm.scene.rotation.y = Math.PI
        setVrm(loadedVrm)
      },
      undefined,
      () => {
        setLoadError("Failed to load avatar model")
      },
    )
  }, [])

  useFrame(({ clock }) => {
    if (!vrm) return

    vrm.update(clock.getDelta())

    const now = clock.getElapsedTime()
    if (now >= nextBlinkRef.current) {
      vrm.expressionManager?.setValue("blink", 1)
      nextBlinkRef.current = now + 0.15
      setTimeout(() => {
        vrm.expressionManager?.setValue("blink", 0)
        nextBlinkRef.current =
          clock.getElapsedTime() + 2 + Math.random() * 4
      }, 150)
    }
  })

  useLipSync({ vrm, audioBase64, visemes })

  if (loadError) return null

  return vrm ? <primitive object={vrm.scene} /> : null
}

const canvasStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
}

export function AvatarCanvas({ visemes, audioBase64 }: AvatarCanvasProps) {
  return (
    <div style={canvasStyle}>
      <Canvas>
        <CameraSetup />
        <ambientLight intensity={0.6} />
        <directionalLight position={[1, 2, 1]} intensity={0.8} />
        <Suspense fallback={null}>
          <AvatarModel visemes={visemes} audioBase64={audioBase64} />
        </Suspense>
      </Canvas>
    </div>
  )
}

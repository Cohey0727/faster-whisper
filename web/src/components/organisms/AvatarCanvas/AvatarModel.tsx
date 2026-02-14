import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm"
import type { Viseme } from "../../../hooks/useChat"
import type { AvatarAction } from "../../../lib/avatarActions"
import { useLipSync } from "../../../hooks/useLipSync"
import { useAvatarAction } from "../../../hooks/useAvatarAction"

type BlinkPhase = "idle" | "closing" | "opening"

interface AvatarModelProps {
  readonly visemes: readonly Viseme[]
  readonly audioBase64: string
  readonly action: AvatarAction
}

export function AvatarModel({ visemes, audioBase64, action }: AvatarModelProps) {
  const [vrm, setVrm] = useState<VRM | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const blinkStateRef = useRef<BlinkPhase>("idle")
  const blinkTimerRef = useRef(2 + Math.random() * 4)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.register((parser) => new VRMLoaderPlugin(parser))

    loader.load(
      "/models/avatar.vrm",
      (gltf) => {
        const loadedVrm = gltf.userData.vrm as VRM
        loadedVrm.scene.rotation.y = Math.PI

        const expressionCount =
          loadedVrm.expressionManager?.expressions?.length ?? 0
        if (expressionCount === 0) {
          console.error(
            "VRM model has no facial expressions — lip sync and blink will not work",
          )
        }

        setVrm(loadedVrm)
      },
      undefined,
      (error) => {
        console.error("Failed to load VRM model:", error)
        setLoadError("Failed to load avatar model")
      },
    )
  }, [])

  useFrame((_, delta) => {
    if (!vrm) return

    vrm.update(delta)

    blinkTimerRef.current -= delta

    if (blinkTimerRef.current <= 0) {
      switch (blinkStateRef.current) {
        case "idle": {
          vrm.expressionManager?.setValue("blink", 1)
          blinkStateRef.current = "closing"
          blinkTimerRef.current = 0.08
          break
        }
        case "closing": {
          vrm.expressionManager?.setValue("blink", 0)
          blinkStateRef.current = "opening"
          blinkTimerRef.current = 0.06
          break
        }
        case "opening": {
          blinkStateRef.current = "idle"
          blinkTimerRef.current = 2 + Math.random() * 4
          break
        }
      }
    }
  })

  useLipSync({ vrm, audioBase64, visemes })
  useAvatarAction({ vrm, action })

  if (loadError) return null

  return vrm ? <primitive object={vrm.scene} /> : null
}

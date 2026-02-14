import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm"
import type { Viseme } from "../../../hooks/useChat"
import type { AvatarAction } from "../../../lib/avatarActions"
import { useLipSync } from "../../../hooks/useLipSync"
import { useAvatarAction } from "../../../hooks/useAvatarAction"

function disposeVrm(vrm: VRM): void {
  vrm.scene.traverse((obj) => {
    if ("geometry" in obj && obj.geometry) {
      (obj.geometry as { dispose: () => void }).dispose()
    }
    if ("material" in obj && obj.material) {
      const mat = obj.material as
        | { dispose: () => void }
        | { dispose: () => void }[]
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose())
      } else {
        mat.dispose()
      }
    }
  })
  vrm.scene.removeFromParent()
}

type BlinkPhase = "idle" | "closing" | "opening"

interface AvatarModelProps {
  readonly visemes: readonly Viseme[]
  readonly audioBase64: string
  readonly action: AvatarAction
  readonly modelUrl: string
}

export function AvatarModel({ visemes, audioBase64, action, modelUrl }: AvatarModelProps) {
  const [vrm, setVrm] = useState<VRM | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const blinkStateRef = useRef<BlinkPhase>("idle")
  const blinkTimerRef = useRef(2 + Math.random() * 4)

  useEffect(() => {
    let disposed = false
    const loader = new GLTFLoader()
    loader.register((parser) => new VRMLoaderPlugin(parser))

    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return

        const loadedVrm = gltf.userData.vrm as VRM
        loadedVrm.scene.rotation.y = Math.PI

        setVrm((prev) => {
          if (prev) {
            disposeVrm(prev)
          }
          return loadedVrm
        })
        setLoadError(null)
      },
      undefined,
      (error) => {
        if (disposed) return
        setLoadError("Failed to load avatar model")
      },
    )

    return () => {
      disposed = true
      setVrm((prev) => {
        if (prev) {
          disposeVrm(prev)
        }
        return null
      })
    }
  }, [modelUrl])

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

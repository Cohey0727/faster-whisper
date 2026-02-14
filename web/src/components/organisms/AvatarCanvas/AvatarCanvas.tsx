import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import type { Viseme } from "../../../hooks/useChat"
import type { AvatarAction } from "../../../lib/avatarActions"
import { CameraSetup } from "./CameraSetup"
import { AvatarModel } from "./AvatarModel"
import * as styles from "./AvatarCanvas.css"

interface AvatarCanvasProps {
  readonly visemes: readonly Viseme[]
  readonly audioBase64: string
  readonly action: AvatarAction
  readonly modelUrl: string
}

export function AvatarCanvas({ visemes, audioBase64, action, modelUrl }: AvatarCanvasProps) {
  return (
    <div className={styles.canvasWrapper}>
      <Canvas>
        <CameraSetup />
        <ambientLight intensity={0.6} />
        <directionalLight position={[1, 2, 1]} intensity={0.8} />
        <Suspense fallback={null}>
          <AvatarModel visemes={visemes} audioBase64={audioBase64} action={action} modelUrl={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  )
}

import { useRef, useCallback } from "react"
import { useFrame } from "@react-three/fiber"
import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm"
import {
  type AvatarAction,
  ACTION_CONFIGS,
  ACTION_ANIMATIONS,
  restoreBones,
} from "../lib/avatarActions"

interface UseAvatarActionParams {
  readonly vrm: VRM | null
  readonly action: AvatarAction
}

export function useAvatarAction({ vrm, action }: UseAvatarActionParams): void {
  const isPlayingRef = useRef(false)
  const startTimeRef = useRef(0)
  const currentActionRef = useRef<NonNullable<AvatarAction> | null>(null)
  const prevActionRef = useRef<AvatarAction>(null)
  const variationRef = useRef(0)

  const startAction = useCallback(
    (newAction: NonNullable<AvatarAction>) => {
      if (!vrm) return

      const config = ACTION_CONFIGS[newAction]
      const missingBones = config.bones.filter(
        (name) => vrm.humanoid?.getRawBoneNode(name as VRMHumanBoneName) == null,
      )

      if (missingBones.length === config.bones.length) {
        return
      }

      if (currentActionRef.current) {
        restoreBones(vrm, currentActionRef.current)
      }

      currentActionRef.current = newAction
      isPlayingRef.current = true
      startTimeRef.current = performance.now()
      variationRef.current = Math.random()
    },
    [vrm],
  )

  useFrame(() => {
    if (action !== prevActionRef.current) {
      prevActionRef.current = action
      if (action) {
        startAction(action)
      }
    }

    if (!vrm || !isPlayingRef.current || !currentActionRef.current) return

    const elapsed = performance.now() - startTimeRef.current
    const config = ACTION_CONFIGS[currentActionRef.current]
    const progress = Math.min(elapsed / config.duration, 1)

    const animateFn = ACTION_ANIMATIONS[currentActionRef.current]
    animateFn(vrm, progress, variationRef.current)

    if (progress >= 1) {
      restoreBones(vrm, currentActionRef.current)
      isPlayingRef.current = false
      currentActionRef.current = null
    }
  })
}

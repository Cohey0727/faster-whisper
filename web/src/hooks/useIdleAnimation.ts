import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm"
import { Quaternion, Vector3 } from "three"

interface UseIdleAnimationParams {
  readonly vrm: VRM | null
}

/**
 * Pre-allocated objects to avoid per-frame GC pressure.
 */
const _q = new Quaternion()
const _axisX = new Vector3(1, 0, 0)
const _axisY = new Vector3(0, 1, 0)
const _axisZ = new Vector3(0, 0, 1)

function getBone(vrm: VRM, name: string) {
  return vrm.humanoid?.getRawBoneNode(name as VRMHumanBoneName) ?? null
}

function multiplyAxisAngle(
  bone: { quaternion: Quaternion },
  axis: Vector3,
  angle: number,
): void {
  _q.setFromAxisAngle(axis, angle)
  bone.quaternion.multiply(_q)
}

/**
 * Applies continuous subtle idle animation (breathing, sway, head movement).
 * Runs every frame after applyRestPose() and before action animations.
 * Uses incommensurate frequencies to avoid robotic looping.
 */
export function useIdleAnimation({ vrm }: UseIdleAnimationParams): void {
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!vrm) return

    timeRef.current += delta
    const t = timeRef.current

    // --- Breathing: spine + chest ---
    const spine = getBone(vrm, "spine")
    const chest = getBone(vrm, "chest")

    // Slow inhale/exhale cycle (~4.2s)
    const breathPhase = Math.sin(t * 1.5)
    // Secondary rhythm to break regularity
    const breathPhase2 = Math.sin(t * 0.9) * 0.3

    if (spine) {
      // Subtle forward lean on inhale
      multiplyAxisAngle(spine, _axisX, (breathPhase + breathPhase2) * 0.012)
    }
    if (chest) {
      // Chest expansion (slight upward tilt)
      multiplyAxisAngle(chest, _axisX, breathPhase * -0.008)
    }

    // --- Body sway: hips + spine ---
    const hips = getBone(vrm, "hips")

    // Very slow lateral sway (~7.3s cycle)
    const swayZ = Math.sin(t * 0.86) * 0.008
    // Slight forward-back drift (~9.1s cycle)
    const swayX = Math.sin(t * 0.69) * 0.005

    if (hips) {
      multiplyAxisAngle(hips, _axisZ, swayZ)
      multiplyAxisAngle(hips, _axisX, swayX)
    }
    if (spine) {
      // Counter-sway for natural balance
      multiplyAxisAngle(spine, _axisZ, swayZ * -0.4)
    }

    // --- Head micro-movement ---
    const head = getBone(vrm, "head")
    const neck = getBone(vrm, "neck")

    // Slow wander (~5.7s nod, ~8.3s tilt, ~11s turn)
    const headNod = Math.sin(t * 1.1) * 0.01 + Math.sin(t * 0.47) * 0.006
    const headTilt = Math.sin(t * 0.76) * 0.008 + Math.sin(t * 0.31) * 0.005
    const headTurn = Math.sin(t * 0.57) * 0.007

    if (neck) {
      multiplyAxisAngle(neck, _axisX, headNod * 0.4)
      multiplyAxisAngle(neck, _axisZ, headTilt * 0.3)
    }
    if (head) {
      multiplyAxisAngle(head, _axisX, headNod * 0.6)
      multiplyAxisAngle(head, _axisZ, headTilt * 0.7)
      multiplyAxisAngle(head, _axisY, headTurn)
    }

    // --- Subtle arm sway (pendulum from body movement) ---
    const leftUpperArm = getBone(vrm, "leftUpperArm")
    const rightUpperArm = getBone(vrm, "rightUpperArm")

    const armSwing = Math.sin(t * 0.86 + 0.5) * 0.01

    if (leftUpperArm) {
      multiplyAxisAngle(leftUpperArm, _axisX, armSwing)
    }
    if (rightUpperArm) {
      multiplyAxisAngle(rightUpperArm, _axisX, -armSwing)
    }
  })
}

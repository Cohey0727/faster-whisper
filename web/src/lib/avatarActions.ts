import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm"
import type { Object3D } from "three"
import { Euler, Quaternion, Vector3 } from "three"

export type AvatarAction =
  | "jump"
  | "spin"
  | "wave"
  | "nod"
  | "bow"
  | "shake"
  | null

export interface ActionConfig {
  readonly bones: readonly string[]
  readonly duration: number
}

export const ACTION_CONFIGS: Readonly<
  Record<NonNullable<AvatarAction>, ActionConfig>
> = {
  jump: { bones: ["hips", "leftUpperLeg", "rightUpperLeg"], duration: 800 },
  spin: { bones: ["hips"], duration: 1000 },
  wave: {
    bones: ["rightUpperArm", "rightLowerArm"],
    duration: 1200,
  },
  nod: { bones: ["head"], duration: 800 },
  bow: { bones: ["spine", "chest"], duration: 1000 },
  shake: { bones: ["head"], duration: 1000 },
}

interface BoneState {
  readonly position: Vector3
  readonly quaternion: Quaternion
}

const initialBoneStates = new WeakMap<Object3D, BoneState>()

function saveInitialState(bone: Object3D): void {
  if (!initialBoneStates.has(bone)) {
    initialBoneStates.set(bone, {
      position: bone.position.clone(),
      quaternion: bone.quaternion.clone(),
    })
  }
}

function restoreInitialState(bone: Object3D): void {
  const state = initialBoneStates.get(bone)
  if (state) {
    bone.position.copy(state.position)
    bone.quaternion.copy(state.quaternion)
  }
}

function getBone(vrm: VRM, name: string): Object3D | null {
  return vrm.humanoid?.getRawBoneNode(name as VRMHumanBoneName) ?? null
}

function easeOutQuad(t: number): number {
  return t * (2 - t)
}

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

function animateJump(vrm: VRM, progress: number): void {
  const hips = getBone(vrm, "hips")
  if (!hips) return
  saveInitialState(hips)

  const initial = initialBoneStates.get(hips)
  if (!initial) return

  const jumpHeight = 0.15
  const height = Math.sin(progress * Math.PI) * jumpHeight
  hips.position.set(initial.position.x, initial.position.y + height, initial.position.z)

  const leftLeg = getBone(vrm, "leftUpperLeg")
  const rightLeg = getBone(vrm, "rightUpperLeg")

  if (leftLeg) {
    saveInitialState(leftLeg)
    const legBend = progress < 0.2
      ? easeOutQuad(progress / 0.2) * 0.3
      : progress > 0.8
        ? easeOutQuad((1 - progress) / 0.2) * 0.3
        : 0
    const legInitial = initialBoneStates.get(leftLeg)
    if (legInitial) {
      leftLeg.quaternion.copy(legInitial.quaternion)
      leftLeg.quaternion.multiply(new Quaternion().setFromEuler(new Euler(-legBend, 0, 0)))
    }
  }

  if (rightLeg) {
    saveInitialState(rightLeg)
    const legBend = progress < 0.2
      ? easeOutQuad(progress / 0.2) * 0.3
      : progress > 0.8
        ? easeOutQuad((1 - progress) / 0.2) * 0.3
        : 0
    const legInitial = initialBoneStates.get(rightLeg)
    if (legInitial) {
      rightLeg.quaternion.copy(legInitial.quaternion)
      rightLeg.quaternion.multiply(new Quaternion().setFromEuler(new Euler(-legBend, 0, 0)))
    }
  }
}

function animateSpin(vrm: VRM, progress: number): void {
  const hips = getBone(vrm, "hips")
  if (!hips) return
  saveInitialState(hips)

  const initial = initialBoneStates.get(hips)
  if (!initial) return

  const angle = easeInOutSine(progress) * Math.PI * 2
  hips.quaternion.copy(initial.quaternion)
  hips.quaternion.multiply(new Quaternion().setFromEuler(new Euler(0, angle, 0)))
}

function animateWave(vrm: VRM, progress: number): void {
  const upperArm = getBone(vrm, "rightUpperArm")
  const lowerArm = getBone(vrm, "rightLowerArm")

  if (upperArm) {
    saveInitialState(upperArm)
    const initial = initialBoneStates.get(upperArm)
    if (initial) {
      const raiseProgress = progress < 0.15
        ? easeOutQuad(progress / 0.15)
        : progress > 0.85
          ? easeOutQuad((1 - progress) / 0.15)
          : 1
      upperArm.quaternion.copy(initial.quaternion)
      upperArm.quaternion.multiply(
        new Quaternion().setFromEuler(new Euler(0, 0, -raiseProgress * 2.5)),
      )
    }
  }

  if (lowerArm) {
    saveInitialState(lowerArm)
    const initial = initialBoneStates.get(lowerArm)
    if (initial) {
      const waveAngle = Math.sin(progress * Math.PI * 4) * 0.4
      lowerArm.quaternion.copy(initial.quaternion)
      lowerArm.quaternion.multiply(
        new Quaternion().setFromEuler(new Euler(0, waveAngle, 0)),
      )
    }
  }
}

function animateNod(vrm: VRM, progress: number): void {
  const head = getBone(vrm, "head")
  if (!head) return
  saveInitialState(head)

  const initial = initialBoneStates.get(head)
  if (!initial) return

  const nodAngle = Math.sin(progress * Math.PI * 2) * 0.3
  head.quaternion.copy(initial.quaternion)
  head.quaternion.multiply(new Quaternion().setFromEuler(new Euler(nodAngle, 0, 0)))
}

function animateBow(vrm: VRM, progress: number): void {
  const spine = getBone(vrm, "spine")
  const chest = getBone(vrm, "chest")

  const bowProgress = progress < 0.3
    ? easeOutQuad(progress / 0.3)
    : progress > 0.7
      ? easeOutQuad((1 - progress) / 0.3)
      : 1

  if (spine) {
    saveInitialState(spine)
    const initial = initialBoneStates.get(spine)
    if (initial) {
      spine.quaternion.copy(initial.quaternion)
      spine.quaternion.multiply(
        new Quaternion().setFromEuler(new Euler(bowProgress * 0.4, 0, 0)),
      )
    }
  }

  if (chest) {
    saveInitialState(chest)
    const initial = initialBoneStates.get(chest)
    if (initial) {
      chest.quaternion.copy(initial.quaternion)
      chest.quaternion.multiply(
        new Quaternion().setFromEuler(new Euler(bowProgress * 0.2, 0, 0)),
      )
    }
  }
}

function animateShake(vrm: VRM, progress: number): void {
  const head = getBone(vrm, "head")
  if (!head) return
  saveInitialState(head)

  const initial = initialBoneStates.get(head)
  if (!initial) return

  const shakeAngle = Math.sin(progress * Math.PI * 3) * 0.35
  head.quaternion.copy(initial.quaternion)
  head.quaternion.multiply(new Quaternion().setFromEuler(new Euler(0, shakeAngle, 0)))
}

type AnimationFn = (vrm: VRM, progress: number) => void

export const ACTION_ANIMATIONS: Readonly<
  Record<NonNullable<AvatarAction>, AnimationFn>
> = {
  jump: animateJump,
  spin: animateSpin,
  wave: animateWave,
  nod: animateNod,
  bow: animateBow,
  shake: animateShake,
}

export function restoreBones(vrm: VRM, action: NonNullable<AvatarAction>): void {
  const config = ACTION_CONFIGS[action]
  for (const boneName of config.bones) {
    const bone = getBone(vrm, boneName)
    if (bone) {
      restoreInitialState(bone)
    }
  }
}

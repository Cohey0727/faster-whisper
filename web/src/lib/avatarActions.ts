import type { VRM, VRMHumanBoneName } from "@pixiv/three-vrm"
import type { Object3D } from "three"
import { Quaternion, Vector3 } from "three"

export type AvatarAction =
  | "jump"
  | "spin"
  | "wave"
  | "nod"
  | "bow"
  | "shake"
  | "laugh"
  | "surprise"
  | "think"
  | "dance"
  | "stretch"
  | "tilt"
  | "lookLeft"
  | "lookRight"
  | "cheer"
  | "sway"
  | "shrug"
  | "peek"
  | "sleep"
  | "clap"
  | "shy"
  | "angry"
  | "pray"
  | "flex"
  | "sneak"
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
  wave: { bones: ["rightUpperArm", "rightLowerArm"], duration: 1200 },
  nod: { bones: ["head"], duration: 800 },
  bow: { bones: ["spine", "chest"], duration: 1000 },
  shake: { bones: ["head"], duration: 1000 },
  laugh: { bones: ["spine", "chest", "head"], duration: 1200 },
  surprise: { bones: ["spine", "head", "leftUpperArm", "rightUpperArm"], duration: 1000 },
  think: { bones: ["head", "rightUpperArm", "rightLowerArm"], duration: 2000 },
  dance: { bones: ["hips", "spine", "leftUpperArm", "rightUpperArm"], duration: 2000 },
  stretch: { bones: ["spine", "leftUpperArm", "rightUpperArm"], duration: 1500 },
  tilt: { bones: ["head", "neck"], duration: 800 },
  lookLeft: { bones: ["head", "neck"], duration: 1000 },
  lookRight: { bones: ["head", "neck"], duration: 1000 },
  cheer: { bones: ["leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm", "spine"], duration: 1200 },
  sway: { bones: ["hips", "spine"], duration: 2000 },
  shrug: { bones: ["leftUpperArm", "rightUpperArm", "head"], duration: 1000 },
  peek: { bones: ["hips", "spine", "head"], duration: 1200 },
  sleep: { bones: ["head", "neck", "spine"], duration: 2500 },
  clap: { bones: ["leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm"], duration: 1400 },
  shy: { bones: ["head", "spine", "leftUpperArm", "rightUpperArm"], duration: 1500 },
  angry: { bones: ["spine", "head", "leftUpperArm", "rightUpperArm"], duration: 1200 },
  pray: { bones: ["leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm", "spine"], duration: 1500 },
  flex: { bones: ["leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm", "spine"], duration: 1500 },
  sneak: { bones: ["hips", "spine", "chest", "leftUpperLeg", "rightUpperLeg"], duration: 1800 },
}

export type AnimationFn = (vrm: VRM, progress: number, variation: number) => void

interface BoneState {
  readonly position: Vector3
  readonly quaternion: Quaternion
}

const initialBoneStates = new WeakMap<Object3D, BoneState>()

export function saveInitialState(bone: Object3D): void {
  if (!initialBoneStates.has(bone)) {
    initialBoneStates.set(bone, {
      position: bone.position.clone(),
      quaternion: bone.quaternion.clone(),
    })
  }
}

export function getInitialState(bone: Object3D): BoneState | undefined {
  return initialBoneStates.get(bone)
}

function restoreInitialState(bone: Object3D): void {
  const state = initialBoneStates.get(bone)
  if (state) {
    bone.position.copy(state.position)
    bone.quaternion.copy(state.quaternion)
  }
}

export function getBone(vrm: VRM, name: string): Object3D | null {
  return vrm.humanoid?.getRawBoneNode(name as VRMHumanBoneName) ?? null
}

export function easeOutQuad(t: number): number {
  return t * (2 - t)
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

export function vary(base: number, range: number, variation: number): number {
  return base + (variation - 0.5) * 2 * range
}

export function applyRotation(
  bone: Object3D,
  x: number,
  y: number,
  z: number,
): void {
  saveInitialState(bone)
  const initial = getInitialState(bone)
  if (!initial) return
  bone.quaternion.copy(initial.quaternion)
  bone.quaternion.multiply(
    new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), x),
  )
  bone.quaternion.multiply(
    new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), y),
  )
  bone.quaternion.multiply(
    new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), z),
  )
}

export { ACTION_ANIMATIONS } from "./avatarAnimations"

export function restoreBones(vrm: VRM, action: NonNullable<AvatarAction>): void {
  const config = ACTION_CONFIGS[action]
  for (const boneName of config.bones) {
    const bone = getBone(vrm, boneName)
    if (bone) {
      restoreInitialState(bone)
    }
  }
}

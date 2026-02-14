import type { VRM } from "@pixiv/three-vrm"
import type { AvatarAction, AnimationFn } from "./avatarActions"
import {
  getBone,
  saveInitialState,
  getInitialState,
  applyRotation,
  easeOutQuad,
  easeInOutSine,
  vary,
} from "./avatarActions"
import { Vector3 } from "three"

function envelope(progress: number, fadeIn: number, fadeOut: number): number {
  if (progress < fadeIn) return easeOutQuad(progress / fadeIn)
  if (progress > 1 - fadeOut) return easeOutQuad((1 - progress) / fadeOut)
  return 1
}

function animateJump(vrm: VRM, progress: number, v: number): void {
  const hips = getBone(vrm, "hips")
  if (!hips) return
  saveInitialState(hips)

  const initial = getInitialState(hips)
  if (!initial) return

  const jumpHeight = vary(0.15, 0.05, v)
  const height = Math.sin(progress * Math.PI) * jumpHeight
  hips.position.set(
    initial.position.x,
    initial.position.y + height,
    initial.position.z,
  )

  const legBend = progress < 0.2
    ? easeOutQuad(progress / 0.2) * vary(0.3, 0.1, v)
    : progress > 0.8
      ? easeOutQuad((1 - progress) / 0.2) * vary(0.3, 0.1, v)
      : 0

  for (const name of ["leftUpperLeg", "rightUpperLeg"]) {
    const leg = getBone(vrm, name)
    if (leg) applyRotation(leg, -legBend, 0, 0)
  }
}

function animateSpin(vrm: VRM, progress: number, v: number): void {
  const hips = getBone(vrm, "hips")
  if (!hips) return

  const turns = vary(1, 0.25, v)
  const angle = easeInOutSine(progress) * Math.PI * 2 * turns
  applyRotation(hips, 0, angle, 0)
}

function animateWave(vrm: VRM, progress: number, v: number): void {
  const upperArm = getBone(vrm, "rightUpperArm")
  const lowerArm = getBone(vrm, "rightLowerArm")
  const env = envelope(progress, 0.15, 0.15)
  const raiseAngle = vary(2.5, 0.3, v)
  const swingSpeed = vary(4, 0.5, v)

  if (upperArm) applyRotation(upperArm, 0, 0, -env * raiseAngle)
  if (lowerArm) {
    const waveAngle = Math.sin(progress * Math.PI * swingSpeed) * vary(0.4, 0.1, v)
    applyRotation(lowerArm, 0, waveAngle, 0)
  }
}

function animateNod(vrm: VRM, progress: number, v: number): void {
  const head = getBone(vrm, "head")
  if (!head) return

  const cycles = vary(2, 0.5, v)
  const amplitude = vary(0.3, 0.08, v)
  const angle = Math.sin(progress * Math.PI * cycles) * amplitude
  applyRotation(head, angle, 0, 0)
}

function animateBow(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.3, 0.3)
  const depth = vary(0.4, 0.1, v)

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, env * depth, 0, 0)

  const chest = getBone(vrm, "chest")
  if (chest) applyRotation(chest, env * depth * 0.5, 0, 0)
}

function animateShake(vrm: VRM, progress: number, v: number): void {
  const head = getBone(vrm, "head")
  if (!head) return

  const cycles = vary(3, 0.5, v)
  const amplitude = vary(0.35, 0.08, v)
  const angle = Math.sin(progress * Math.PI * cycles) * amplitude
  applyRotation(head, 0, angle, 0)
}

function animateLaugh(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.15, 0.2)
  const speed = vary(6, 1, v)
  const intensity = vary(0.08, 0.03, v)

  const spine = getBone(vrm, "spine")
  if (spine) {
    const bounce = Math.sin(progress * Math.PI * speed) * intensity * env
    applyRotation(spine, -bounce, 0, 0)
  }

  const chest = getBone(vrm, "chest")
  if (chest) {
    const bounce = Math.sin(progress * Math.PI * speed + 0.5) * intensity * 0.7 * env
    applyRotation(chest, -bounce, 0, 0)
  }

  const head = getBone(vrm, "head")
  if (head) {
    const tiltBack = vary(0.15, 0.05, v) * env
    applyRotation(head, -tiltBack, 0, 0)
  }
}

function animateSurprise(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.1, 0.4)
  const leanBack = vary(0.2, 0.06, v) * env

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, -leanBack, 0, 0)

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, -leanBack * 0.5, 0, 0)

  const armRaise = vary(1.2, 0.3, v) * env
  const leftArm = getBone(vrm, "leftUpperArm")
  if (leftArm) applyRotation(leftArm, 0, 0, armRaise)

  const rightArm = getBone(vrm, "rightUpperArm")
  if (rightArm) applyRotation(rightArm, 0, 0, -armRaise)
}

function animateThink(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.2)
  const tiltAngle = vary(0.2, 0.05, v)

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, vary(0.08, 0.03, v) * env, 0, tiltAngle * env)

  const upperArm = getBone(vrm, "rightUpperArm")
  if (upperArm) applyRotation(upperArm, vary(0.8, 0.2, v) * env, 0, -vary(1.0, 0.2, v) * env)

  const lowerArm = getBone(vrm, "rightLowerArm")
  if (lowerArm) applyRotation(lowerArm, -vary(1.2, 0.2, v) * env, 0, 0)
}

function animateDance(vrm: VRM, progress: number, v: number): void {
  const speed = vary(3, 0.5, v)
  const hipSway = vary(0.15, 0.04, v)
  const spineGroove = vary(0.1, 0.03, v)
  const armSwing = vary(0.8, 0.2, v)

  const hips = getBone(vrm, "hips")
  if (hips) {
    saveInitialState(hips)
    const initial = getInitialState(hips)
    if (initial) {
      const sideShift = Math.sin(progress * Math.PI * speed) * 0.03
      hips.position.set(
        initial.position.x + sideShift,
        initial.position.y + Math.abs(Math.sin(progress * Math.PI * speed * 2)) * 0.02,
        initial.position.z,
      )
    }
    applyRotation(hips, 0, Math.sin(progress * Math.PI * speed) * hipSway, 0)
  }

  const spine = getBone(vrm, "spine")
  if (spine) {
    applyRotation(
      spine,
      Math.sin(progress * Math.PI * speed * 2) * spineGroove * 0.5,
      0,
      Math.sin(progress * Math.PI * speed) * spineGroove,
    )
  }

  const leftArm = getBone(vrm, "leftUpperArm")
  if (leftArm) {
    applyRotation(leftArm, Math.sin(progress * Math.PI * speed) * 0.3, 0, armSwing * Math.sin(progress * Math.PI * speed + Math.PI))
  }

  const rightArm = getBone(vrm, "rightUpperArm")
  if (rightArm) {
    applyRotation(rightArm, Math.sin(progress * Math.PI * speed + Math.PI) * 0.3, 0, -armSwing * Math.sin(progress * Math.PI * speed))
  }
}

function animateStretch(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.25, 0.25)
  const raiseAngle = vary(2.8, 0.3, v) * env
  const backBend = vary(0.15, 0.05, v) * env

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, -backBend, 0, 0)

  const leftArm = getBone(vrm, "leftUpperArm")
  if (leftArm) applyRotation(leftArm, 0, 0, raiseAngle)

  const rightArm = getBone(vrm, "rightUpperArm")
  if (rightArm) applyRotation(rightArm, 0, 0, -raiseAngle)
}

function animateTilt(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.3)
  const angle = vary(0.35, 0.1, v) * env
  const direction = v > 0.5 ? 1 : -1

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, 0, 0, angle * direction)

  const neck = getBone(vrm, "neck")
  if (neck) applyRotation(neck, 0, 0, angle * 0.3 * direction)
}

function animateLookLeft(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.3)
  const angle = vary(0.5, 0.1, v) * env

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, 0, angle, 0)

  const neck = getBone(vrm, "neck")
  if (neck) applyRotation(neck, 0, angle * 0.3, 0)
}

function animateLookRight(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.3)
  const angle = vary(0.5, 0.1, v) * env

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, 0, -angle, 0)

  const neck = getBone(vrm, "neck")
  if (neck) applyRotation(neck, 0, -angle * 0.3, 0)
}

function animateCheer(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.15, 0.15)
  const raiseAngle = vary(2.8, 0.3, v) * env
  const pumpSpeed = vary(4, 1, v)
  const pumpAmount = Math.sin(progress * Math.PI * pumpSpeed) * 0.2 * env

  const leftUpper = getBone(vrm, "leftUpperArm")
  if (leftUpper) applyRotation(leftUpper, 0, 0, raiseAngle + pumpAmount)

  const rightUpper = getBone(vrm, "rightUpperArm")
  if (rightUpper) applyRotation(rightUpper, 0, 0, -(raiseAngle + pumpAmount))

  const leftLower = getBone(vrm, "leftLowerArm")
  if (leftLower) applyRotation(leftLower, -vary(0.5, 0.15, v) * env, 0, 0)

  const rightLower = getBone(vrm, "rightLowerArm")
  if (rightLower) applyRotation(rightLower, -vary(0.5, 0.15, v) * env, 0, 0)

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, -vary(0.08, 0.03, v) * env, 0, 0)
}

function animateSway(vrm: VRM, progress: number, v: number): void {
  const speed = vary(2, 0.5, v)
  const amplitude = vary(0.12, 0.04, v)

  const hips = getBone(vrm, "hips")
  if (hips) {
    saveInitialState(hips)
    const initial = getInitialState(hips)
    if (initial) {
      const offset = Math.sin(progress * Math.PI * speed) * 0.02
      hips.position.set(initial.position.x + offset, initial.position.y, initial.position.z)
    }
    applyRotation(hips, 0, 0, Math.sin(progress * Math.PI * speed) * amplitude)
  }

  const spine = getBone(vrm, "spine")
  if (spine) {
    applyRotation(spine, 0, 0, Math.sin(progress * Math.PI * speed + 0.3) * amplitude * 0.5)
  }
}

function animateShrug(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.3)
  const shoulferRaise = vary(0.5, 0.15, v) * env

  const leftArm = getBone(vrm, "leftUpperArm")
  if (leftArm) applyRotation(leftArm, 0, 0, shoulferRaise)

  const rightArm = getBone(vrm, "rightUpperArm")
  if (rightArm) applyRotation(rightArm, 0, 0, -shoulferRaise)

  const head = getBone(vrm, "head")
  if (head) {
    const tilt = vary(0.15, 0.05, v) * env
    applyRotation(head, 0, 0, tilt * (v > 0.5 ? 1 : -1))
  }
}

function animatePeek(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.3)
  const direction = v > 0.5 ? 1 : -1
  const leanAmount = vary(0.25, 0.08, v) * env

  const hips = getBone(vrm, "hips")
  if (hips) {
    saveInitialState(hips)
    const initial = getInitialState(hips)
    if (initial) {
      hips.position.set(
        initial.position.x + direction * 0.05 * env,
        initial.position.y,
        initial.position.z,
      )
    }
    applyRotation(hips, 0, 0, leanAmount * direction)
  }

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, 0, 0, leanAmount * 0.5 * direction)

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, 0, -direction * vary(0.2, 0.05, v) * env, 0)
}

function animateSleep(vrm: VRM, progress: number, v: number): void {
  const fallEnv = progress < 0.2
    ? easeOutQuad(progress / 0.2)
    : progress > 0.85
      ? easeOutQuad((1 - progress) / 0.15)
      : 1

  const headDrop = vary(0.45, 0.1, v)
  const bobSpeed = vary(1.5, 0.3, v)
  const bob = Math.sin(progress * Math.PI * bobSpeed) * 0.06

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, (headDrop + bob) * fallEnv, 0, 0)

  const neck = getBone(vrm, "neck")
  if (neck) applyRotation(neck, headDrop * 0.3 * fallEnv, 0, 0)

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, vary(0.08, 0.03, v) * fallEnv, 0, 0)
}

function animateClap(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.1, 0.15)
  const speed = vary(5, 1, v)
  const armAngle = vary(1.0, 0.2, v) * env

  const clapPhase = Math.sin(progress * Math.PI * speed)
  const clapOffset = clapPhase > 0 ? clapPhase * 0.3 : 0

  const leftUpper = getBone(vrm, "leftUpperArm")
  if (leftUpper) applyRotation(leftUpper, armAngle * 0.8, 0, armAngle - clapOffset * env)

  const rightUpper = getBone(vrm, "rightUpperArm")
  if (rightUpper) applyRotation(rightUpper, armAngle * 0.8, 0, -(armAngle - clapOffset * env))

  const leftLower = getBone(vrm, "leftLowerArm")
  if (leftLower) applyRotation(leftLower, -vary(0.8, 0.15, v) * env, 0, 0)

  const rightLower = getBone(vrm, "rightLowerArm")
  if (rightLower) applyRotation(rightLower, -vary(0.8, 0.15, v) * env, 0, 0)
}

function animateShy(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.3)
  const lookAway = vary(0.35, 0.1, v) * env
  const direction = v > 0.5 ? 1 : -1

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, vary(0.15, 0.05, v) * env, lookAway * direction, 0)

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, vary(0.1, 0.03, v) * env, 0, 0)

  const leftArm = getBone(vrm, "leftUpperArm")
  if (leftArm) applyRotation(leftArm, vary(0.3, 0.1, v) * env, 0, 0)

  const rightArm = getBone(vrm, "rightUpperArm")
  if (rightArm) applyRotation(rightArm, vary(0.3, 0.1, v) * env, 0, 0)
}

function animateAngry(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.15, 0.25)
  const leanForward = vary(0.15, 0.05, v) * env
  const tremble = Math.sin(progress * Math.PI * vary(8, 2, v)) * 0.02 * env

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, leanForward + tremble, 0, 0)

  const head = getBone(vrm, "head")
  if (head) applyRotation(head, leanForward * 0.5, tremble, 0)

  const armTense = vary(0.6, 0.15, v) * env
  const leftArm = getBone(vrm, "leftUpperArm")
  if (leftArm) applyRotation(leftArm, armTense * 0.5, 0, armTense * 0.3)

  const rightArm = getBone(vrm, "rightUpperArm")
  if (rightArm) applyRotation(rightArm, armTense * 0.5, 0, -armTense * 0.3)
}

function animatePray(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.2)
  const armAngle = vary(1.0, 0.15, v) * env

  const leftUpper = getBone(vrm, "leftUpperArm")
  if (leftUpper) applyRotation(leftUpper, armAngle, 0, armAngle * 0.6)

  const rightUpper = getBone(vrm, "rightUpperArm")
  if (rightUpper) applyRotation(rightUpper, armAngle, 0, -armAngle * 0.6)

  const leftLower = getBone(vrm, "leftLowerArm")
  if (leftLower) applyRotation(leftLower, -vary(1.2, 0.2, v) * env, 0, 0)

  const rightLower = getBone(vrm, "rightLowerArm")
  if (rightLower) applyRotation(rightLower, -vary(1.2, 0.2, v) * env, 0, 0)

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, vary(0.1, 0.03, v) * env, 0, 0)
}

function animateFlex(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.2, 0.2)
  const raiseAngle = vary(1.8, 0.3, v) * env
  const flexPulse = Math.sin(progress * Math.PI * vary(3, 0.5, v)) * 0.15 * env

  const leftUpper = getBone(vrm, "leftUpperArm")
  if (leftUpper) applyRotation(leftUpper, 0, 0, raiseAngle + flexPulse)

  const rightUpper = getBone(vrm, "rightUpperArm")
  if (rightUpper) applyRotation(rightUpper, 0, 0, -(raiseAngle + flexPulse))

  const curlAngle = vary(1.8, 0.3, v) * env
  const leftLower = getBone(vrm, "leftLowerArm")
  if (leftLower) applyRotation(leftLower, -curlAngle, 0, 0)

  const rightLower = getBone(vrm, "rightLowerArm")
  if (rightLower) applyRotation(rightLower, -curlAngle, 0, 0)

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, -vary(0.08, 0.03, v) * env, 0, 0)
}

function animateSneak(vrm: VRM, progress: number, v: number): void {
  const env = envelope(progress, 0.15, 0.15)
  const crouchDepth = vary(0.06, 0.02, v)
  const stepSpeed = vary(3, 0.5, v)

  const hips = getBone(vrm, "hips")
  if (hips) {
    saveInitialState(hips)
    const initial = getInitialState(hips)
    if (initial) {
      hips.position.set(
        initial.position.x,
        initial.position.y - crouchDepth * env,
        initial.position.z,
      )
    }
  }

  const spine = getBone(vrm, "spine")
  if (spine) applyRotation(spine, vary(0.2, 0.05, v) * env, 0, 0)

  const chest = getBone(vrm, "chest")
  if (chest) applyRotation(chest, vary(0.1, 0.03, v) * env, 0, 0)

  const legBend = vary(0.2, 0.05, v) * env
  const stepPhase = Math.sin(progress * Math.PI * stepSpeed)

  const leftLeg = getBone(vrm, "leftUpperLeg")
  if (leftLeg) applyRotation(leftLeg, -(legBend + Math.max(0, stepPhase) * 0.1 * env), 0, 0)

  const rightLeg = getBone(vrm, "rightUpperLeg")
  if (rightLeg) applyRotation(rightLeg, -(legBend + Math.max(0, -stepPhase) * 0.1 * env), 0, 0)
}

export const ACTION_ANIMATIONS: Readonly<
  Record<NonNullable<AvatarAction>, AnimationFn>
> = {
  jump: animateJump,
  spin: animateSpin,
  wave: animateWave,
  nod: animateNod,
  bow: animateBow,
  shake: animateShake,
  laugh: animateLaugh,
  surprise: animateSurprise,
  think: animateThink,
  dance: animateDance,
  stretch: animateStretch,
  tilt: animateTilt,
  lookLeft: animateLookLeft,
  lookRight: animateLookRight,
  cheer: animateCheer,
  sway: animateSway,
  shrug: animateShrug,
  peek: animatePeek,
  sleep: animateSleep,
  clap: animateClap,
  shy: animateShy,
  angry: animateAngry,
  pray: animatePray,
  flex: animateFlex,
  sneak: animateSneak,
}

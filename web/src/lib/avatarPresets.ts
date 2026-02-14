export interface AvatarPreset {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly modelPath: string
}

export const AVATAR_PRESETS: readonly AvatarPreset[] = [
  {
    id: "avatar_A",
    name: "Avatar A",
    description: "VRoid サンプルモデル A",
    modelPath: "/models/avatar_A.vrm",
  },
  {
    id: "avatar_B",
    name: "Avatar B",
    description: "VRoid サンプルモデル B",
    modelPath: "/models/avatar_B.vrm",
  },
  {
    id: "avatar_C",
    name: "Avatar C",
    description: "VRoid サンプルモデル C",
    modelPath: "/models/avatar_C.vrm",
  },
]

export function getPresetById(id: string): AvatarPreset | undefined {
  return AVATAR_PRESETS.find((p) => p.id === id)
}

export function getModelPath(avatarId: string): string {
  const preset = getPresetById(avatarId)
  return preset?.modelPath ?? AVATAR_PRESETS[0].modelPath
}

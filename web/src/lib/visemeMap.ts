export type VoicevoxPhoneme = "aa" | "ih" | "ou" | "ee" | "oh" | "nn" | "sil"

export type VrmExpression = "aa" | "ih" | "ou" | "ee" | "oh"

const visemeMapping: Record<VoicevoxPhoneme, VrmExpression | null> = {
  aa: "aa",
  ih: "ih",
  ou: "ou",
  ee: "ee",
  oh: "oh",
  nn: null,
  sil: null,
}

export function getVrmExpression(phoneme: string): VrmExpression | null {
  return visemeMapping[phoneme as VoicevoxPhoneme] ?? null
}

export const ALL_VOWEL_EXPRESSIONS: readonly VrmExpression[] = [
  "aa",
  "ih",
  "ou",
  "ee",
  "oh",
] as const

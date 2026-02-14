import type { Viseme, VoicevoxAudioQuery } from "../types/index.js"

const VOWEL_TO_VISEME: Readonly<Record<string, string>> = {
  a: "aa",
  i: "ih",
  u: "ou",
  e: "ee",
  o: "oh",
  N: "nn",
  cl: "nn",
  pau: "sil",
}

function mapVowelToViseme(vowel: string): string {
  return VOWEL_TO_VISEME[vowel] ?? "sil"
}

export function extractVisemes(audioQuery: VoicevoxAudioQuery): Viseme[] {
  let currentTime = audioQuery.prePhonemeLength

  const visemes: Viseme[] = []

  for (const phrase of audioQuery.accent_phrases) {
    for (const mora of phrase.moras) {
      if (mora.consonant_length != null) {
        currentTime += mora.consonant_length
      }

      visemes.push({
        time: currentTime,
        duration: mora.vowel_length,
        vowel: mapVowelToViseme(mora.vowel),
      })

      currentTime += mora.vowel_length
    }

    if (phrase.pause_mora != null) {
      visemes.push({
        time: currentTime,
        duration: phrase.pause_mora.vowel_length,
        vowel: mapVowelToViseme(phrase.pause_mora.vowel),
      })

      currentTime += phrase.pause_mora.vowel_length
    }
  }

  return visemes
}

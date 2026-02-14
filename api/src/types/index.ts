export interface Viseme {
  readonly time: number
  readonly duration: number
  readonly vowel: string
}

export interface ChatResponse {
  readonly transcript: string
  readonly response: string
  readonly audioBase64: string
  readonly visemes: readonly Viseme[]
}

export interface VoicevoxMora {
  readonly text: string
  readonly consonant: string | null
  readonly consonant_length: number | null
  readonly vowel: string
  readonly vowel_length: number
  readonly pitch: number
}

export interface VoicevoxAccentPhrase {
  readonly moras: readonly VoicevoxMora[]
  readonly accent: number
  readonly pause_mora: VoicevoxMora | null
  readonly is_interrogative: boolean
}

export interface VoicevoxAudioQuery {
  readonly accent_phrases: readonly VoicevoxAccentPhrase[]
  readonly speedScale: number
  readonly pitchScale: number
  readonly intonationScale: number
  readonly volumeScale: number
  readonly prePhonemeLength: number
  readonly postPhonemeLength: number
  readonly outputSamplingRate: number
  readonly outputStereo: boolean
  readonly kana: string
}

export interface VoicevoxSynthesisResult {
  readonly audioBuffer: ArrayBuffer
  readonly audioQuery: VoicevoxAudioQuery
}

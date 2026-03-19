export type StoredFileTranscription = {
    title: string,
    comment: string | null
    fileText: WhisperSegment[],
}

export type StoredFileTranslation = {
    title: string
    comment: string | null,
    translatedFile: string
}

export type WhisperSegment = {
  id: number
  seek: number
  start: number
  end: number
  text: string
  tokens: number[]
  temperature: number
  avg_logprob: number
  compression_ratio: number
  no_speech_prob: number
}
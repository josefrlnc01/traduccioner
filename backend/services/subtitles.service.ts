import fs from 'node:fs/promises'
import { VideoService } from './video.service.ts'
import { transcribeWhisperAudio } from '../transcription/whisperTranscribe.ts'
import { getTitleAndLanguage } from '../api/youtube.ts'
import type { VideoSubtitles } from '../types/index.ts'





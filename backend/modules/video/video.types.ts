import { TranscriptionFormatt } from "../transcription/whisper.service.js"

export type VideoSubtitles = {
    youtubeVideoText: TranscriptionFormatt[] | null,
    usedMinutes: number
}


export type RequestProps = {
    videoLink: string
    lang: string
}


export type DataOfId = {
    id: string | undefined;
    service: "youtube" | "vimeo" | "vine" | "videopress" | "microsoftstream" | "tiktok" | "dailymotion" | "loom" | undefined;
}
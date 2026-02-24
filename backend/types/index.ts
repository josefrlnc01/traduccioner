export type VideoSubtitles = {
    subtitles: string
    title: string
}

export type RequestProps = {
    videoLink: string
    lang: string
}

export type DataOfId = {
    id: string | undefined;
    service: "youtube" | "vimeo" | "vine" | "videopress" | "microsoftstream" | "tiktok" | "dailymotion" | "loom" | undefined;
}
export type VideoSubtitles = {
    subtitles: string
    title: string
}

export type UserRegistrationForm = {
    name: string,
    email: string
    password: string,
    password_confirmation: string
}

export type RequestProps = {
    videoLink: string
    lang: string
}

export type DataOfId = {
    id: string | undefined;
    service: "youtube" | "vimeo" | "vine" | "videopress" | "microsoftstream" | "tiktok" | "dailymotion" | "loom" | undefined;
}
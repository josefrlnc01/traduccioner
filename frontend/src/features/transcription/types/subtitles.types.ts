import type { SavedFile } from "@/features/saveds/types/saveds.types"
import type { UseMutationResult } from "@tanstack/react-query"

export type PromiseLink = {
    savedYoutubeFile: SavedFile,
    translatedYoutubeVideo: string,
    usedMinutes: number,
    user: {
        _id: () => string,
        subscription: string,
        name: string,
        email: string
    }
}

export type PromiseFile = {
    savedFile: SavedFile,
    translatedFile: string,
    usedMinutes: number,
    user: {
        _id: () => string,
        subscription: string,
        name: string,
        email: string
    }
}

export type TranscriptionResult = PromiseLink | PromiseFile

export type TranscriptionMutation = UseMutationResult<
    TranscriptionResult | undefined,
    Error,
    void,
    unknown
>

export type SubtitlesViewProps = {
    mutation: TranscriptionMutation,
    inputValue: string | null,
    fileInputValue: FormData | null,
}

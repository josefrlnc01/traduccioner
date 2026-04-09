import type { SavedFile } from "@/features/saveds/types/saveds.types"
import type { UseMutationResult } from "@tanstack/react-query"

export type PromiseLink = {
    youtubeVideoText: SavedFile,
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
    fileText: SavedFile,
    translatedFile: string,
    usedMinutes: number,
    user: {
        _id: () => string,
        subscription: string,
        name: string,
        email: string
    }
}

export type SubtitlesViewProps = {
    mutation: UseMutationResult<PromiseLink  | PromiseFile | undefined, Error, MutationProps, unknown>,
    inputValue: string,
    fileInputValue: FormData | null,
}

export type FileSubtitlesProps = {
    mutation: UseMutationResult< PromiseFile | undefined, Error,  unknown>,
    inputValue: string,
    fileInputValue: FormData | null,

}


export type MutationProps = {
    link: string | null
    formData: FormData | null
}

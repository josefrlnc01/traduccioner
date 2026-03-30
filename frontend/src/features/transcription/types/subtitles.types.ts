import type { UseMutationResult } from "@tanstack/react-query"

import type { PromiseFile, PromiseLink } from "../api/transcriptionApi"

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

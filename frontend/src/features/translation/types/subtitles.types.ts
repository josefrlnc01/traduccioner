import type { UseMutationResult } from "@tanstack/react-query"
import type { MutationProps } from "../components/Form"
import type { PromiseFile, PromiseLink } from "../api/translationApi"

export type SubtitlesViewProps = {
    mutation: UseMutationResult<PromiseLink  | PromiseFile | undefined, Error, MutationProps, unknown>,
    inputValue: string,
    fileInputValue: string,
    language: string | null
}

export type FileSubtitlesProps = {
    mutation: UseMutationResult< PromiseFile | undefined, Error,  unknown>,
    inputValue: string,
    fileInputValue: string,
    language: string | null
}

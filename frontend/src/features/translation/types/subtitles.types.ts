import type { UseMutationResult } from "@tanstack/react-query"
import type { MutationProps } from "../components/Form"
import type { PromiseFile, PromiseLink } from "../api/translationApi"

export type SubtitlesViewProps = {
    mutation: UseMutationResult<PromiseLink  | undefined, Error, MutationProps, unknown>
}

import type { UseMutationResult } from "@tanstack/react-query"
import type { MutationProps } from "../components/Form"

export type SubtitlesViewProps = {
    mutation: UseMutationResult<{
        subtitles: string
        translatedText: string
        title: string
        id: string
    } | undefined, Error, MutationProps, unknown>
}

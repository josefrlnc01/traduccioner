import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import type { SubtitlesViewProps } from "../types/subtitles.types";
import FileSubtitles from '../components/FileSubtitles';
import YoutubeVideoSubtitles from '../components/YoutubeVideoSubtitles';
import TranscriptionSkeleton from '../components/TranscriptionSkeleton';

gsap.registerPlugin(ScrollTrigger)


export default function SubtitlesView({ mutation, inputValue, fileInputValue, language }: SubtitlesViewProps) {
    



    if (mutation.isError) {

        return (
            <aside className="p-4 text-red-400 md:text-center">
                {mutation.error.message}
            </aside>
        )
    }

    if (mutation.isPending) {
        return <TranscriptionSkeleton/>
    }




    if (!mutation.data) return null

    if (!("translatedYoutubeVideo" in mutation.data)) {
        return (
            <FileSubtitles
                mutation={mutation}
                inputValue={inputValue}
                fileInputValue={fileInputValue}
                language={language}
            />
        )
    }


    return (

        <YoutubeVideoSubtitles
            mutation={mutation}
            inputValue={inputValue}
            fileInputValue={fileInputValue}
            language={language}
        />
    )
}

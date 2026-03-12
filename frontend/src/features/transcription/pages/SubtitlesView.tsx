import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import type { SubtitlesViewProps } from "../types/subtitles.types";

import FileSubtitles from '../components/FileSubtitles';
import YoutubeVideoSubtitles from '../components/YoutubeVideoSubtitles';



gsap.registerPlugin(ScrollTrigger)


export default function SubtitlesView({ mutation, inputValue, fileInputValue, language }: SubtitlesViewProps) {
    const [phrase, setPhrase] = useState('')
    const [index, setIndex] = useState(0)
    const [fade, setFade] = useState(true)
    

    const awaitPhrases = ['Cargando traducción, puede tardar un poco...', 'Procesando audio...', 'Extrayendo texto...']

    useEffect(() => {
        if (index >= awaitPhrases.length) return
        const timeOut = setTimeout(() => {
            setFade(false)
            setTimeout(() => {
                setIndex(prev => prev + 1)
                setPhrase(awaitPhrases[index])
                setFade(true)
            }, 300)
        }, 6000)
        return () => clearTimeout(timeOut)
    }, [index, awaitPhrases.length])



    if (mutation.isError) {

        return (
            <aside className="p-4 text-red-400 md:text-center">
                No puedes realizar más traducciones
            </aside>
        )
    }

    if (mutation.isPending) {
        return (
            <aside className="p-6 flex flex-col gap-4 items-center text-white justify-center">
                <Spinner
                    className="size-16 text-white"
                />
                <small className={`text-neutral-200 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"
                    }`}>{phrase}</small>
            </aside>
        )
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

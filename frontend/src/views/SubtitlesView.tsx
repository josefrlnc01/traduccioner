import type { UseMutationResult } from "@tanstack/react-query";
import type { MutationProps } from "./FormView";
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger)

type SubtitlesViewProps = {
    mutation: UseMutationResult<{
        subtitles: string
        translatedText: string
        title: string
    } | undefined, Error, MutationProps, unknown>
}

export default function SubtitlesView({ mutation }: SubtitlesViewProps) {
    const [phrase, setPhrase] = useState('')
    const [index, setIndex] = useState(0)

    const awaitPhrases = ['Cargando traducción, puede tardar un poco...', 'Procesando audio...', 'Extrayendo texto...']
    
    useEffect(() => {
        setIndex(0)
        if (index === awaitPhrases.length) return
        const interval = setInterval(() => {
            setIndex(prev => prev + 1)
            setPhrase(awaitPhrases[index])
            return clearInterval(interval)
        }, 6000)
    }, [index, awaitPhrases.length])


    if (mutation.isPending) {
        return (
            <section className="p-4 flex flex-col gap-3 items-center text-white justify-center">
                <Spinner
                className="size-20"
                />
                <small className="text-gray-100">{phrase}</small>
            </section>
        )
    }

    if (mutation.isError) {
        return (
            <div className="p-4 text-red-500">
                Error al cargar los subtítulos
            </div>
        )
    }

    if (!mutation.isSuccess) {
        return (
            <div className="p-4 text-gray-400">
                Pega un enlace de Youtube y selecciona un idioma para ver la traducción
            </div>
        )
    }

    if (!mutation.data) return null
    const { subtitles, translatedText, title } = mutation.data

    const chunksArray = (words: string[], size: number) => {
        return words.reduce((acc, _, i) => {
            if (i % size === 0) acc.push(words.slice(i, i + size).join(' '))
            return acc
        }, [] as string[])
    }

    
    return (

        <section className='flex flex-col lg:items-center  p-4 rounded-xl  overflow-y-scroll'>
            <aside className='rounded-xl bg-slate-900'>
                <div className='flex flex-col justify-start items-start p-6'>
                    <h2 className='scroll-m-20 text-2xl font-semibold tracking-tight text-gray-200 self-end'>{title}</h2>
                </div>
                {chunksArray(translatedText.toLowerCase().split(' '), 6).map((chunk, i) => (
                    <div  key={i} className='container flex justify-start items-center gap-2 p-6'>
                            <p className='text font-bold text-xl text-gray-200'>{chunk}</p>
                        </div>
                ))}
            </aside>
        </section>
    )
}

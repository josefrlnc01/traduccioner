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
        id: string
    } | undefined, Error, MutationProps, unknown>
}

export default function SubtitlesView({ mutation }: SubtitlesViewProps) {
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


    if (mutation.isPending) {
        return (
            <aside className="p-4 flex flex-col gap-3 items-center text-white justify-center">
                <Spinner
                    className="size-20"
                />
                <small className={`text-gray-100 transition-opacity duration-300 ${
                    fade ? "opacity-100" : "opacity-0"
                }`}>{phrase}</small>
            </aside>
        )
    }

    if (mutation.isError) {
        return (
            <aside className="p-4 text-red-500">
                Error al cargar los subtítulos
            </aside>
        )
    }

    if (!mutation.isSuccess) {
        return (
            <aside className="flex flex-col lg:items-center p-4 text-gray-400">
                Pega un enlace de Youtube y selecciona un idioma para ver la traducción
            </aside>
        )
    }

    if (!mutation.data) return null


    const { translatedText, title, id } = mutation.data
    const chunksArray = (words: string[], size: number) => {
        return words.reduce((acc, _, i) => {
            if (i % size === 0) acc.push(words.slice(i, i + size).join(' '))
            return acc
        }, [] as string[])
    }


    return (

        <section className='flex flex-col lg:items-center p-6 rounded-xl overflow-y-auto'>
            <aside className='w-full max-w-4xl rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-2xl'>

                {/* Video Container */}
                <div className="aspect-video w-full rounded-t-2xl overflow-hidden bg-black">
                    <iframe
                        src={`https://www.youtube.com/embed/${id}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>

                {/* Title Section */}
                <div className='px-8 py-6 border-b border-slate-800'>
                    <h2 className='text-3xl font-bold tracking-tight text-gray-100 leading-tight'>
                        {title}
                    </h2>
                </div>

                {/* Lyrics Section */}
                <div className='px-6 py-3 space-y-6'>
                    {chunksArray(translatedText.toLowerCase().split(' '), 6).map((chunk, i) => (
                        <div
                            key={i}
                            className='group hover:bg-slate-800/40 -mx-2 px-2 py-2 rounded-lg transition-all duration-200'
                        >
                            <p className='text-xl font-semibold text-gray-200 leading-relaxed'>
                                {chunk}
                            </p>
                        </div>
                    ))}
                </div>

            </aside>
        </section>
    )
}

import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import type { SubtitlesViewProps } from "../types/subtitles.types";
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { saveTranscription } from '@/features/stored/storedApi';
import { saveFileTranscription } from '@/features/file/fileApi';



gsap.registerPlugin(ScrollTrigger)


export default function Subtitles({ mutation, inputValue, fileInputValue, language }: SubtitlesViewProps) {
    const [phrase, setPhrase] = useState('')
    const [index, setIndex] = useState(0)
    const [fade, setFade] = useState(true)
    const saveYtFile = useMutation({
        mutationFn: saveTranscription,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })


    const saveFile = useMutation({
        mutationFn: saveFileTranscription,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

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
            <aside className="p-4 text-red-500 md:text-center">
                No puedes realizar más traducciones
            </aside>
        )
    }

    if (mutation.isPending) {
        return (
            <aside className="p-4 flex flex-col gap-3 items-center text-white justify-center">
                <Spinner
                    className="size-20"
                />
                <small className={`text-gray-100 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"
                    }`}>{phrase}</small>
            </aside>
        )
    }



    if (!mutation.isSuccess) {
        return (
            <aside className="flex flex-col text-center md:items-center p-4 text-gray-400 md:hidden">
                Pega un enlace de Youtube y selecciona un idioma para ver la traducción
            </aside>
        )
    }

    if (!mutation.data) return null

    if (!("translatedText" in mutation.data)) {
        const text = mutation.data.text
        const translated = mutation.data.translated
        const handleSave = () => {
            const data = {
                videoId: null,
                title: null,
                text: text,
                translated: translated
            }
            saveFile.mutate(data)
        }
        return (
            <section className='flex flex-col md:items-center p-6 rounded-xl'>
                <button
                    onClick={handleSave}
                    className='p-2 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer'
                    type='button'>Guardar</button>
                <aside className='w-full max-w-3/4 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-2xl'>
                    <section className='flex justify-center items-center p-6 rounded-xl overflow-x-hidden overflow-y-auto gap-4'>
                        <aside className='min-2/4 max-w-2/4 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-2xl p-6'>
                            <h2 className='text-2xl font-bold tracking-tight text-center text-gray-100 leading-tight mb-4'>
                                Transcripción
                            </h2>
                            <p className='text-xl md:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                {mutation.data.text}
                            </p>
                        </aside>
                        {((inputValue || fileInputValue) && language) && <aside className='min-2/4 max-w-2/4 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-2xl p-6'>
                            <h2 className='text-2xl font-bold tracking-tight text-center text-gray-100 leading-tight mb-4'>
                                Traducción
                            </h2>
                            <p className='text-xl text-start md:text-center font-semibold text-gray-200 leading-relaxed'>
                                {mutation.data.translated}
                            </p>
                        </aside>}
                    </section>
                </aside>
            </section>
        )
    }

    const { translatedText, title, id, subtitles } = mutation.data


    const handleSave = () => {
        const data = {
            videoId: id,
            title,
            text: subtitles,
            translated: translatedText
        }
        saveYtFile.mutate(data)
    }


    return (

        <section className='flex flex-col md:items-center p-6 rounded-xl overflow-y-auto'>
            <aside className='w-full max-w-screen rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-2xl'>

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
                <div className='w-full flex justify-end p-3'>
                    <button
                        onClick={handleSave}
                        className='p-2 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 transition-colors cursor-pointer'
                        type='button'>Guardar</button>
                </div>


                {/* Lyrics Section */}
                <section className='flex justify-center items-center p-6 rounded-xl overflow-y-auto gap-4'>
                    <aside className='min-w-2xl max-w-2xl rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-2xl p-6'>
                        <h2 className='text-2xl font-bold tracking-tight text-center text-gray-100 leading-tight mb-4'>
                            Transcripción
                        </h2>
                        <p className='text-xl md:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                            {mutation.data.subtitles}
                        </p>
                    </aside>
                    {((inputValue || fileInputValue) && language) && <aside className='min-w-2xl max-w-2xl rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 shadow-2xl p-6'>
                        <h2 className='text-2xl font-bold tracking-tight text-center text-gray-100 leading-tight mb-4'>
                            Traducción
                        </h2>
                        <p className='text-xl text-start md:text-center font-semibold text-gray-200 leading-relaxed'>
                            {mutation.data.translatedText}
                        </p>
                    </aside>}
                </section>

            </aside>
        </section>
    )
}

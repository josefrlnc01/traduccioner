import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";
import type { SubtitlesViewProps } from "../types/subtitles.types";
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { saveTranscription } from '@/features/stored/storedApi';
import { saveFileTranscription } from '@/features/file/fileApi';
import { generatePDF } from '@/features/document/api/documentApi';



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

    const generatePdf = useMutation({
        mutationFn: generatePDF,
        onError: (error) => {
            toast.error(error.message)
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

    if (!("translatedText" in mutation.data)) {
        const text = mutation.data.text
        const translated = mutation.data.translated
        const handleGenerate = () => {
            generatePdf.mutate(text)
        }
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
            <section className='flex flex-col lg:flex md:items-center rounded-xl'>

                <aside className='w-full flex flex-col lg:flex lg:max-w-3/4 rounded-2xl bg-transparent backdrop-blur-sm borde shadow-2xl'>
                    <div className='w-full flex justify-end p-4 gap-3'>

                    </div>

                    <section className='flex flex-col justify-start lg:flex lg:flex-row gap-2 rounded-xl overflow-x-hidden overflow-y-auto'>
                        <aside className='w-full lg:min-w-2/4 lg:max-w-2/4 flex flex-col gap-2 rounded-md bg-slate-900/80 backdrop-blur-sm shadow-2xl'>
                            <header className='flex justify-between items-center w-full p-4 bg-slate-800/90'>
                                <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                    Transcripción
                                </h2>
                            </header>
                            <div className='p-2 flex flex-col justify-between grow'>
                                <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                    {mutation.data.text}
                                </p>
                                <div className='bg-transparent w-full flex justify-end p-4 gap-3'>
                                <button
                                    onClick={handleGenerate}
                                    className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                    type='button'>Descargar</button>
                                <button
                                    onClick={handleSave}
                                    className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                    type='button'>Guardar</button>
                            </div>
                            </div>
                            
                        </aside>
                        {((inputValue || fileInputValue) && language && translated) &&
                            <aside className='w-full lg:min-w-2/4 lg:max-w-2/4 flex flex-col gap-2 rounded-md bg-slate-900/80 backdrop-blur-sm shadow-2xl'>
                                <header className='flex justify-between items-center w-full p-4 bg-slate-800/90'>
                                    <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                        Traducción
                                    </h2>
                                </header>
                                <div className='p-2 flex flex-col justify-between grow'>
                                <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                    {mutation.data.translated}
                                </p>
                                <div className='bg-transparent w-full flex justify-end p-4 gap-3'>
                                <button
                                    onClick={handleGenerate}
                                    className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                    type='button'>Descargar</button>
                                <button
                                    onClick={handleSave}
                                    className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                    type='button'>Guardar</button>
                            </div>
                            </div>
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
    const handleGenerate = () => {
            generatePdf.mutate(subtitles)
        }

    return (

        <section className='flex flex-col lg:flex md:items-center rounded-xl'>

            <aside className='w-full flex flex-col lg:flex lg:max-w-3/4 rounded-2xl bg-transparent backdrop-blur-sm borde shadow-2xl'>
                <div className='w-full flex justify-end p-4 gap-3'>

                </div>

                <section className='flex flex-col justify-start lg:flex lg:flex-row gap-2 rounded-xl overflow-x-hidden overflow-y-auto'>
                    <aside className='w-full lg:min-w-2/4 lg:max-w-2/4 flex flex-col gap-2 rounded-md bg-slate-900/80 backdrop-blur-sm shadow-2xl'>
                        <header className='flex justify-between items-center w-full p-4 bg-slate-800/90'>
                            <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                Transcripción
                            </h2>
                        </header>
                        <div className='p-4'>
                            <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                {mutation.data.subtitles}
                            </p>
                        </div>
                        <section className='bg-transparent w-full flex justify-end p-4 gap-3'>
                            <button
                                onClick={handleGenerate}
                                className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>Descargar</button>
                            <button
                                onClick={handleSave}
                                className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>Guardar</button>
                        </section>
                    </aside>
                    {((inputValue || fileInputValue) && language && translatedText) &&
                        <aside className='w-full lg:min-w-2/4 lg:max-w-2/4 flex flex-col gap-2 rounded-md bg-slate-900/80 backdrop-blur-sm shadow-2xl'>
                            <header className='flex justify-between items-center w-full p-4 bg-slate-800/90'>
                                <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                    Traducción
                                </h2>
                            </header>
                            <div className='p-4'>
                                <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                    {mutation.data.translatedText}
                                </p>
                            </div>
                            <section className='bg-transparent w-full flex justify-end p-4 gap-3'>
                                <button
                                    onClick={handleSave}
                                    className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                    type='button'>Descargar</button>
                                <button
                                    onClick={handleSave}
                                    className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                    type='button'>Guardar</button>
                            </section>
                        </aside>}
                </section>
            </aside>
        </section>
    )
}

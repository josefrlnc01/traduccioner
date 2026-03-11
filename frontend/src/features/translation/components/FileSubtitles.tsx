import { generatePDF } from '@/features/document/api/documentApi'
import { saveFileTranscription } from '@/features/file/fileApi'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import type { SubtitlesViewProps } from '../types/subtitles.types'
import { Spinner } from '@/shared/components/ui/spinner'
import Subtitles from './Subtitles'

export default function FileSubtitles({ mutation, inputValue, fileInputValue, language }: SubtitlesViewProps) {
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
            </aside>
        )
    }


    if (!mutation.data) return null

    if (("translatedText" in mutation.data)) return <Subtitles mutation={mutation} inputValue={inputValue} fileInputValue={fileInputValue} language={language}/>
    const text = mutation.data.text
    const translated = mutation.data.translated
    const handleGenerateTranscriptionPdf = (text: string) => {
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
        <section className='w-screen flex flex-col lg:flex lg:max-w-3/4 lg:w-3/4  md:items-center rounded-xl'>

            <section className='flex flex-col justify-start lg:flex lg:flex-row gap-2 rounded-xl overflow-x-hidden overflow-y-auto'>
                <aside className='border border-solid border-[#ffffff1a] w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                    <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                        <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                            Transcripción <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                        </h2>
                    </header>
                    <div className='grow bg-slate-800/40 p-4'>
                        <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                            {mutation.data.text}
                        </p>
                    </div>
                    <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                        <button
                            onClick={() => handleGenerateTranscriptionPdf(text)}
                            className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                            type='button'>Descargar</button>
                        <button
                            onClick={handleSave}
                            className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                            type='button'>Guardar</button>
                    </div>

                </aside>
                {((inputValue || fileInputValue) && language && translated) &&
                    <aside className='border border-solid border-[#ffffff1a] w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                        <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                            <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                Traducción <span className="text-xs font-normal text-slate-500 ml-2">({language})</span>
                            </h2>
                        </header>
                        <div className='grow bg-slate-800/40 p-4'>
                            <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                {mutation.data.translated}
                            </p>
                        </div>
                        <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                            <button
                                onClick={() => handleGenerateTranscriptionPdf(translated)}
                                className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>Descargar</button>
                            <button
                                onClick={handleSave}
                                className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>Guardar</button>
                        </div>
                    </aside>}
            </section>
        </section>
    )
}

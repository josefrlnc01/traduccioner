import React from 'react'
import type { SubtitlesViewProps } from '../types/subtitles.types'
import { useMutation } from '@tanstack/react-query'
import { saveTranscription } from '@/features/stored/storedApi'
import { toast } from 'react-toastify'
import { generatePDF } from '@/features/document/api/documentApi'
import FileSubtitles from './FileSubtitles'

export default function YoutubeVideoSubtitles({mutation, inputValue, fileInputValue, language}: SubtitlesViewProps ) {
    
    const saveYtFile = useMutation({
        mutationFn: saveTranscription,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })
    
    if (!mutation.data) return null

    if (!("translatedText" in mutation.data)) return <FileSubtitles mutation={mutation} inputValue={inputValue} fileInputValue={fileInputValue} language={language}/>

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
    const generatePdf = useMutation({
        mutationFn: generatePDF,
        onError: (error) => {
            toast.error(error.message)
        }
    })
    const handleGenerateTranscriptionPdf = (subtitles: string) => {
        generatePdf.mutate(subtitles)
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
                            {mutation.data.subtitles}
                        </p>
                    </div>
                    <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                        <button
                            onClick={() => handleGenerateTranscriptionPdf(subtitles)}
                            className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                            type='button'>Descargar</button>
                        <button
                            onClick={handleSave}
                            className='p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                            type='button'>Guardar</button>
                    </div>

                </aside>
                {((inputValue || fileInputValue) && language && translatedText) &&
                    <aside className='border border-solid border-[#ffffff1a] w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                        <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                            <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                Traducción <span className="text-xs font-normal text-slate-500 ml-2">({language})</span>
                            </h2>
                        </header>
                        <div className='grow bg-slate-800/40 p-4'>
                            <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                {mutation.data.translatedText}
                            </p>
                        </div>
                        <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                            <button
                                onClick={() => handleGenerateTranscriptionPdf(translatedText)}
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

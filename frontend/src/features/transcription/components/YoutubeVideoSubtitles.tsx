import React, { useState } from 'react'
import type { SubtitlesViewProps } from '../types/subtitles.types'
import { useMutation } from '@tanstack/react-query'
import { saveYoutubeTranscription } from '../api/transcriptionApi'
import { toast } from 'react-toastify'
import { generatePDF } from '@/features/document/api/documentApi'
import FileSubtitles from './FileSubtitles'
import { Link } from 'react-router'
import { Button } from '@headlessui/react'
import SaveTranscriptionForm from './SaveTranscriptionForm'

export default function YoutubeVideoSubtitles({ mutation, inputValue, fileInputValue, language }: SubtitlesViewProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isSavingYtTranscription, setIsSavingYtTranscription] = useState(false)
    function openForSave() {
        setIsSavingYtTranscription(true)
        setIsOpen(true)
    }
    function open() {
        setIsOpen(true)
    }

    const generatePdf = useMutation({
        mutationFn: generatePDF,
        onError: (error) => {
            toast.error(error.message)
        }
    })

    if (!mutation.data) return null

    if (!("translatedYoutubeVideo" in mutation.data)) return <FileSubtitles mutation={mutation} inputValue={inputValue} fileInputValue={fileInputValue} language={language} />

    const { translatedYoutubeVideo, youtubeVideoText } = mutation.data

    
    const handleGenerateTranscriptionPdf = (subtitles: string) => {
        generatePdf.mutate(subtitles)
    }

    return (
        <section className='w-screen flex flex-col lg:flex lg:max-w-3/4 lg:w-3/4  md:items-center rounded-xl'>
            <SaveTranscriptionForm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                fileText={null}
                youtubeVideoText={youtubeVideoText}
                translatedFile={null}
                translatedYoutubeVideo={translatedYoutubeVideo}
                isSavingFileTranscription={undefined}
                setIsSavingFileTranscription={undefined}
                isSavingYtTranscription={isSavingYtTranscription}
                setIsSavingYtTranscription={setIsSavingYtTranscription}
            />
            <section className='flex flex-col justify-start lg:flex lg:flex-row gap-2 rounded-xl overflow-x-hidden overflow-y-auto'>
                <aside className='border border-solid border-[#ffffff1a] w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                    <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                        <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                            Transcripción <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                        </h2>
                    </header>
                    <div className='grow bg-slate-800/40 p-4'>
                        <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                            {youtubeVideoText}
                        </p>
                    </div>
                    <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                        <button
                            onClick={() => handleGenerateTranscriptionPdf(youtubeVideoText)}
                            className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                            type='button'>Descargar</button>
                        <Button
                            onClick={openForSave}
                            className="p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                            Guardar
                        </Button>

                    </div>

                </aside>
                {((inputValue || fileInputValue) && language && translatedYoutubeVideo) &&
                    <aside className='border border-solid border-[#ffffff1a] w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                        <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                            <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                Traducción <span className="text-xs font-normal text-slate-500 ml-2">({language})</span>
                            </h2>
                        </header>
                        <div className='grow bg-slate-800/40 p-4'>
                            <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                {translatedYoutubeVideo}
                            </p>
                        </div>
                        <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                            <button
                                onClick={() => handleGenerateTranscriptionPdf(translatedYoutubeVideo)}
                                className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>Descargar</button>
                            <Button
                            onClick={open}
                            className="p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                            Guardar
                        </Button>

                        </div>
                    </aside>}
            </section>
        </section>
    )
}

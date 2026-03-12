import { generatePDF } from '@/features/document/api/documentApi'
import { saveFileTranscription } from '../api/transcriptionApi'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import type { SubtitlesViewProps } from '../types/subtitles.types'
import { Spinner } from '@/shared/components/ui/spinner'
import Subtitles from '../pages/SubtitlesView'
import { Link } from 'react-router'
import { useState } from 'react'
import { Button } from '@headlessui/react'
import SaveTranscriptionForm from './SaveTranscriptionForm'

export default function FileSubtitles({ mutation, inputValue, fileInputValue, language }: SubtitlesViewProps) {
    const [isOpen, setIsOpen] = useState(false)
    function open() {
        setIsOpen(true)
    }

    const generatePdf = useMutation({
        mutationFn: generatePDF,
        onError: (error) => {
            toast.error(error.message)
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

    if (("translatedYoutubeVideo" in mutation.data)) return <Subtitles mutation={mutation} inputValue={inputValue} fileInputValue={fileInputValue} language={language} />
    const fileText = mutation.data.fileText
    const translatedFile = mutation.data.translatedFile
    const handleGenerateTranscriptionPdf = (text: string) => {
        generatePdf.mutate(text)
    }
    

    return (
        <section className='w-screen flex flex-col lg:flex lg:max-w-3/4 lg:w-3/4  md:items-center rounded-xl'>
            <SaveTranscriptionForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            fileText={fileText}
            youtubeVideoText={null}
            translatedFile={translatedFile}
            translatedYoutubeVideo={null}
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
                            {fileText}
                        </p>
                    </div>
                    <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                        <button
                            onClick={() => handleGenerateTranscriptionPdf(fileText)}
                            className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                            type='button'>Descargar</button>
                        <Button
                            onClick={open}
                            className="p-3 pl-4 pr-4 grow bg-slate-800 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer"
                        >
                            Guardar
                        </Button>
                    </div>

                </aside>
                {((inputValue || fileInputValue) && language && translatedFile) &&
                    <aside className='border border-solid border-[#ffffff1a] w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                        <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                            <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                Traducción <span className="text-xs font-normal text-slate-500 ml-2">({language})</span>
                            </h2>
                        </header>
                        <div className='grow bg-slate-800/40 p-4'>
                            <p className='text-xl lg:text-center wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                {translatedFile}
                            </p>
                        </div>
                        <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                            <button
                                onClick={() => handleGenerateTranscriptionPdf(translatedFile)}
                                className='p-3 pl-4 pr-4 grow text-white font-bold rounded-md bg-blue-700 hover:bg-blue-900 transition-colors cursor-pointer'
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

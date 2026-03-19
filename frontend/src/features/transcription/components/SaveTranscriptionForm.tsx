import React, { useState } from 'react'
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useMutation } from '@tanstack/react-query'
import { saveFileTranscription, saveFileTranslation, saveYoutubeTranscription, saveYoutubeTranslation } from '../api/transcriptionApi'
import { toast } from 'react-toastify'
import type { WhisperSegment } from '../types/file.types'

type TranscriptionProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    fileText: WhisperSegment[] | null,
    youtubeVideoText: string | null,
    translatedFile: string | null,
    translatedYoutubeVideo: string | null,
    isSavingFileTranscription?: boolean,
    setIsSavingFileTranscription?: React.Dispatch<React.SetStateAction<boolean>>,
    isSavingYtTranscription?: boolean,
    setIsSavingYtTranscription?: React.Dispatch<React.SetStateAction<boolean>>
}
export default function SaveTranscriptionForm({ isOpen, setIsOpen, fileText, youtubeVideoText, translatedFile, translatedYoutubeVideo, isSavingFileTranscription, setIsSavingFileTranscription, isSavingYtTranscription, setIsSavingYtTranscription }: TranscriptionProps) {
    const [inputValue, setInputValue] = useState('')
    const [textAreaValue, setTextAreaValue] = useState('')
    const saveFileTranscript = useMutation({
        mutationFn: saveFileTranscription,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const saveFileTransl = useMutation({
        mutationFn: saveFileTranslation,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const saveYtVideoTranscript = useMutation({
        mutationFn: saveYoutubeTranscription,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const saveYtVideoTransl = useMutation({
        mutationFn: saveYoutubeTranslation,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })


    const handleInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => {
        setTextAreaValue(e.target.value)
    }

    



    function handleSaveTranscription() {
        console.log(fileText)
        console.log(translatedFile)
        console.log(youtubeVideoText)
        if (fileText && isSavingFileTranscription === true && setIsSavingFileTranscription) {
            console.log('save transcription')
            const data = {
                title: inputValue,
                comment: textAreaValue,
                fileText: fileText,
            }
            saveFileTranscript.mutate(data)
            setIsSavingFileTranscription(false)
        }
        if (translatedFile && isSavingFileTranscription === false) {
            console.log('save translation')
            const data = {
                title: inputValue,
                comment: textAreaValue,
                translatedFile: translatedFile
            }
            saveFileTransl.mutate(data)
        }
        if (youtubeVideoText && isSavingYtTranscription === true && setIsSavingYtTranscription) {
            const data = {
                title: inputValue,
                comment: textAreaValue,
                youtubeVideoText: youtubeVideoText
            }
            saveYtVideoTranscript.mutate(data)
            setIsSavingYtTranscription(false)
        }

        if (translatedYoutubeVideo && isSavingYtTranscription === false) {
            const data = {
                title: inputValue,
                comment: textAreaValue,
                translatedYoutubeVideo: translatedYoutubeVideo
            }
            saveYtVideoTransl.mutate(data)
        }
    }

    function close() {
        handleSaveTranscription()
        setIsOpen(false)
    }
    return (
        <>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={() => setIsOpen(false)}>
                <div className="fixed inset-0 z-10 w-screen min-w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-lg font-medium text-white pl-1 mb-1">
                                Guardar Transcripción
                            </DialogTitle>
                            <form className='w-full min-w-full mx-auto space-y-6 p-8 bg-zinc-950/60 border border-zinc-800 rounded-xl shadow-xl'>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-semibold text-zinc-300 ml-1'>Título</label>
                                    <input
                                        onChange={handleInput}
                                        type='text'
                                        className='w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className='text-sm font-semibold text-zinc-300 ml-1'>Comentarios</label>
                                    <textarea
                                        onChange={handleTextArea}
                                        className='w-full p-3 min-h-20 h-20 max-h-20 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'></textarea>
                                </div>
                                <Button
                                    onClick={close}
                                    className="w-full gap-2 rounded-md bg-gray-700 p-2 text-center text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700 cursor-pointer"

                                >
                                    Guardar
                                </Button>
                            </form>

                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

        </>

    )
}

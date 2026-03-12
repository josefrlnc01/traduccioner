import React, { useState } from 'react'
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

type TranscriptionProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function SaveTranscriptionForm({ isOpen, setIsOpen }: TranscriptionProps) {
    const [inputValue, setInputValue] = useState('')
    const [textAreaValue, setTextAreaValue] = useState('')

    const handleInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleTextArea = (e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => {
        setTextAreaValue(e.target.value)
    }


    function close() {

        setIsOpen(false)
    }


    function handleSaveTranscription() {

    }
    return (
        <>

            <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
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

                                    className="w-full gap-2 rounded-md bg-gray-700 p-2 text-center text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700 cursor-pointer"
                                    onClick={close}
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

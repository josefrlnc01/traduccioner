import { useEffect, useState } from "react";
import { sendLink, type PromiseFile, type PromiseLink } from "../api/transcriptionApi";
import SubtitlesView from "../pages/SubtitlesView";
import InputIcon from "../../../assets/input.svg"
import { getAbbreviateLanguage } from "@/shared/utils/lang";
import { useMutation } from "@tanstack/react-query";
import { minutesStore } from "@/shared/stores/minutes.store";
import { formatMinutes } from "@/shared/utils/minutes";

export type MutationProps = {
    link: string | null
    lang: string | null,
    formData: FormData | null
}
export default function Form() {
    const [inputValue, setInputValue] = useState('')
    const [usedMinutes, setUsedMinues] = useState<number | null>(minutesStore.get())
    const [language, setLanguage] = useState<string | null>(null)
    const [fileInputValue, setFileInputValue] = useState<FormData | null>(null)
    const langForTranslate = getAbbreviateLanguage(language)
    const [formData, setFormData] = useState<FormData | null>(null)
    const [changed, setChanged] = useState(false)

    
    console.log('changed', changed)
    const mutation = useMutation<
        PromiseLink | PromiseFile | undefined,
        Error,
        MutationProps
    >({
        mutationFn: ({ link, lang, formData }) => sendLink(link, lang, formData),
        onSuccess: (data) => {
            
            setUsedMinues(data?.usedMinutes!)
        }
    })
    

    const handleForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if (!inputValue && formData) {
            mutation.mutate({ link: null, lang: langForTranslate, formData })
            setFileInputValue(null)
            setChanged(false)
            return
        }

        mutation.mutate({ link: inputValue, lang: langForTranslate, formData: null })
        setInputValue('')
        setChanged(false)
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        
        const file = e.currentTarget.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append('audio', file)
        setFormData(formData)
        
        console.log(formData)
        setFileInputValue(formData)
    }

    //Drag and drop para archivos del usuario
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const data = event.dataTransfer.files[0]
        if (!data) return
        const formData = new FormData()
        formData.append('audio', data)
        setFormData(formData)
        setChanged(true)
        setFileInputValue(formData)
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
    }

    console.log('fileinput', fileInputValue)
    console.log('input', inputValue)

    return (
        <>

            <section className="p-8 relative grow flex flex-col justify-center items-center mb-15">

                <aside className="hidden w-full mx-auto lg:items-center p-4 text-gray-400 lg:flex lg:flex-col lg:gap-4">
                    <h2 className="text-xl font-semibold text-white">
                        Nueva transcripción
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Sube un archivo de audio/vídeo o introduce un enlace de YouTube
                    </p>
                </aside>
                <div className="w-full md:w-2/4 flex flex-col gap-6 md:flex-row md:gap-3 justify-center items-center mb-6">
                    <div className="relative w-full bg-slate-800 rounded-full h-2">
                        <div
                            className="relative h-2 rounded-full overflow-hidden bg-blue-500 transition-all duration-500"
                            style={{ width: `${(usedMinutes! / 10) * 100}%` }}
                        >
                            <div
                                className="shimmer absolute inset-y-0 h-full w-1/3"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                                    left: 0
                                }}
                            />
                        </div>
                    </div>
                    <span className="text-slate-400 text-sm shrink-0">
                        <span className="text-blue-500">{formatMinutes(usedMinutes!)}</span> / 10 min usados
                    </span>
                </div>
                <aside className="w-screen relative mt-0 lg:w-2/4 self-auto lg:min-h-2/5 lg:h-2/5 bg-slate-800/30 flex flex-col justify-center items-center lg:justify-center rounded-2xl p-8 mb-12 shadow-2xl backdrop-blur">

                    <form className="w-full flex flex-col  p-2 gap-6">

                        {!inputValue &&
                            <div id="targ"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className={`flex p-12 flex-col grow-2 gap-4 md:gap-1 hover:scale-105 hover:backdrop-blur-md transition-transform ease-in-out duration-500 rounded-xl border ${!fileInputValue ? 'border-dashed bg-slate-800/20 border-slate-700' : 'border-solid bg-slate-800/40 border-blue-500/70'} justify-center items-center`}>
                                <img src={InputIcon} />
                                <label className="text-2xl font-bold">Sube tu archivo</label>
                                <p className="text-lg text-gray-400 text-center">Selecciona un video o audio de tu dispositivo</p>
                                <p className="hidden lg:block text-md text-gray-500 mb-4">Arrastra un archivo de vídeo/audio</p>
                                <label htmlFor="fileUpload" className="w-full md:w-1/4 md:min-w-2/4 lg:w-1/4 p-3 text-center rounded-md font-bold text-white bg-blue-600 hover:bg-blue-500  transition-colors ease duration-300 cursor-pointer">
                                    {fileInputValue ? 'Actualizar archivo' : 'Seleccionar archivo'}
                                </label>

                                <input type="file"
                                    onChange={handleInputFile}
                                    onClick={(e) => {
                                        e.currentTarget.value = ''
                                        setFileInputValue(null)
                                    }}
                                    name="audio"
                                    id="fileUpload"
                                    accept="video/*,audio/*"
                                    formEncType="multipart/form-data"
                                    className="hidden" />

                            </div>}
                            {(!fileInputValue && !inputValue) && <span className="text-center text-sm text-gray-300">O</span>}
                        <div className="grow flex flex-col justify-center items-center gap-15">
                            {!fileInputValue &&
                                <div className="w-full flex flex-col justify-around gap-2">
                                    <label className=" text-gray-400 pl-1">Introduce un enlace de youtube</label>
                                    <input onChange={handleInput}
                                        onClick={(e) => {
                                            e.currentTarget.value = ''
                                            setInputValue('')
                                        }}
                                        placeholder="Pega tu enlace aquí"
                                        type='text'
                                        className='min-w-full w-full lg:w-1/4 p-3 hover:backdrop-blur-md text-gray-300 rounded-xl focus:outline-none  bg-slate-800 hover:bg-slate-800/80 transition-colors duration-100 ease-in' />

                                </div>}
                        </div>
                        {(changed && fileInputValue) && 
                        <span className="text-sm text-shadow-white font-semibold text-center">Archivo preparado</span>}
                        <button
                            type="submit"
                            onClick={handleForm}
                            className={`${(fileInputValue || inputValue) && changed ? 'bg-blue-500/90 animate-pulse' : 'bg-blue-600'} pl-6 pr-6 pb-3 pt-3 rounded-xl font-semibold text-white hover:bg-blue-500 transition-colors ease duration-300 cursor-pointer`}>
                            Transcribir</button>


                    </form>

                </aside>
                <SubtitlesView
                    mutation={mutation}
                    inputValue={inputValue}
                    fileInputValue={fileInputValue}
                    language={language}

                />
            </section>
        </>
    )

}

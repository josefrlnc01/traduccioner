import { useEffect, useState } from "react";
import { sendLink } from "../api/transcriptionApi";
import SubtitlesView from "../pages/SubtitlesView";
import InputIcon from "../../../assets/input.svg"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatMinutes } from "@/shared/utils/minutes";
import { suscriptionStore } from "@/shared/stores/user-suscription.store";
import { useTheme } from "@/shared/context/ThemeContext";
import type { MutationProps, PromiseFile, PromiseLink } from "../types/subtitles.types";
import { minutesStore } from "@/shared/stores/minutes.store";



export default function Form() {
    const [inputValue, setInputValue] = useState('')
    const [usedMinutes, setUsedMinues] = useState<number>(Number(minutesStore.get() ?? Number(localStorage.getItem('usedMinutes'))))
    const [fileInputValue, setFileInputValue] = useState<FormData | null>(null)
    const [formData, setFormData] = useState<FormData | null>(null)
    const [changed, setChanged] = useState(false)
    const queryClient = useQueryClient()
    const {theme} = useTheme()
    const mutation = useMutation<
        PromiseLink | PromiseFile | undefined,
        Error,
        MutationProps
    >({
        mutationFn: ({ link, formData }) => sendLink(link, formData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['allSaveds'] })
            setUsedMinues(data?.usedMinutes!)
            localStorage.setItem('usedMinutes', String(data?.usedMinutes))
        }
    })

    //Movimiento de scroll hacia el elemento de transcripción cuando se realiza una 
    useEffect(() => {
        if (!mutation.data) return
        requestAnimationFrame(() => {
            const element =
                document.getElementById('file-result') ??
                document.getElementById('yt-result')

            element?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        })

    }, [mutation.data])

    //Obtención de minutos usados al montar componente
    useEffect(() => {
        const stored = Number(minutesStore.get())
        if (stored) setUsedMinues(stored)
    }, [])

    //Tipo de suscripción del usuario
    const suscription = suscriptionStore.get()

    /*Condicional para ejecutar una petición de transcripción 
    de archivo de usuario o de youtube en vase a elementos del dom seleccionados*/
    const handleForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (!inputValue && formData) {
            mutation.mutate({ link: null, formData })
            setFileInputValue(null)
            setChanged(false)
            return
        }
        mutation.mutate({ link: inputValue, formData: null })
        setInputValue('')
        setChanged(false)
    }

    //Guardado de valor del input tipo texto
    const handleInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    //Guardado del valor del input tipo archivo 
    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append('audio', file)
        setFormData(formData)
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

    

    return (
        <>

            <section className="p-2 lg:p-8 relative grow flex flex-col justify-center items-center mb-15">
                {suscription === 'free' && <div className="w-full md:w-2/4 flex flex-col gap-6 md:gap-3 justify-center items-center mb-6 mt-4">
                    <div className={`relative w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-full h-2`}>
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
                    <span className={`${theme === 'dark' ? 'text-slate-400 ' : 'text-slate-900'} text-sm shrink-0`}>
                        <span className="text-blue-500">{formatMinutes(usedMinutes!)}</span> / 10 min usados
                    </span>
                </div>}
                {suscription === 'pro' && <div className="w-full md:w-2/4 flex flex-col gap-6 md:gap-3 justify-center items-center mb-6 mt-4">
                    <div className={`relative w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-full h-2`}>
                        <div
                            className="relative h-2 rounded-full overflow-hidden bg-blue-500 transition-all duration-500"
                            style={{ width: `${(usedMinutes! / 180) * 100}%` }}
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
                    <span className={`${theme === 'dark' ? 'text-slate-400 ' : 'text-slate-900'} text-sm shrink-0`}>
                        <span className="text-blue-500">{formatMinutes(usedMinutes!)}</span> / 3h
                    </span>
                </div>}
                {suscription === 'business' && <div className="w-full md:w-2/4 flex flex-col gap-4 md:gap-3 justify-center items-center mb-6 mt-4">
                    <div className={`relative w-full ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} rounded-full h-2`}>
                        <div
                            className="relative h-2 rounded-full overflow-hidden bg-blue-500 transition-all duration-500"
                            style={{ width: `${(usedMinutes! / 600) * 100}%` }}
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
                    <span className={`${theme === 'dark' ? 'text-slate-400 ' : 'text-slate-900'} text-sm shrink-0`}>
                        <span className="text-blue-500">{formatMinutes(usedMinutes!)}</span> / 10h
                    </span>
                </div>}
                

                <aside className={`w-full relative mt-0 lg:w-2/4 md:w-3/4 self-auto min-h-128 ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-white shadow-sm border border-slate-200'} flex flex-col justify-center items-center lg:justify-center rounded-2xl p-2 py-6 lg:p-8 mb-12 shadow-md backdrop-blur`}>

                    <form className="w-full flex flex-col  lg:p-2 gap-6 min-h-3/4">

                        {!inputValue &&
                            <div id="targ"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className={`flex p-12 w-full flex-col grow-2 gap-4 md:gap-1 hover:scale-105 hover:backdrop-blur-md transition-transform ease-in-out duration-500 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/20' : 'bg-blue-50  border-blue-200'} ${!fileInputValue ? 'border-dashed  border-slate-700' : 'border-solid border-blue-500/70'}  justify-center items-center`}>
                                <img src={InputIcon} />
                                <label className="text-lg md:text-2xl font-bold">Sube tu archivo</label>
                                <p className="text-sm md:text-xl text-gray-400 text-center">Selecciona un video o audio de tu dispositivo</p>
                                <p className="hidden lg:block text-md text-gray-500 mb-4">Arrastra un archivo de vídeo/audio</p>
                                <label htmlFor="fileUpload" className="w-full text-md md:w-1/4 md:min-w-2/4 lg:w-1/4 p-3 text-center rounded-md font-bold text-white bg-blue-600 hover:bg-blue-500  transition-colors ease duration-300 cursor-pointer">
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
                        {(!fileInputValue && !inputValue) && <span className={`${theme === 'dark' ? ' text-gray-300' : 'text-slate-950'} text-center text-sm md:text-xl`}>O</span>}
                        <div className="grow flex flex-col justify-center items-center gap-15">
                            {!fileInputValue &&
                                <div className="w-full flex flex-col justify-around gap-2 mb-5">
                                    <label className={`${theme === 'dark' ? ' text-gray-400' : 'text-slate-950'} pl-1 text-sm md:text-xl`}>Introduce un enlace de youtube</label>
                                    <input onChange={handleInput}
                                        onClick={(e) => {
                                            e.currentTarget.value = ''
                                            setInputValue('')
                                        }}
                                        placeholder="Pega tu enlace aquí"
                                        type='text'
                                        className={`min-w-full w-full lg:w-1/4 p-3 hover:backdrop-blur-md text-sm text-gray-300 rounded-xl focus:outline-none ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-800/80' : 'bg-slate-200  border-slate-300 text-slate-900 placeholder:text-slate-400'} transition-colors duration-100 ease-in`} />

                                </div>}
                        </div>
                        {(changed && fileInputValue) &&
                            <span className="text-sm text-shadow-white font-semibold text-center">Archivo preparado</span>}
                        <button
                            type="submit"
                            onClick={handleForm}
                            className={`${(fileInputValue || inputValue) && changed ? 'bg-blue-500/90 animate-pulse' : 'bg-blue-600'} pl-6 pr-6 pb-3 pt-3 rounded-xl font-semibold text-white hover:bg-blue-500 hover:animate-none transition-colors ease duration-300 cursor-pointer`}>
                            Transcribir</button>


                    </form>

                </aside>

                <SubtitlesView
                    mutation={mutation}
                    inputValue={inputValue}
                    fileInputValue={fileInputValue}
                />


            </section>
        </>
    )

}

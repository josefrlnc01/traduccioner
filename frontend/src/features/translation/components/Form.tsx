import { useState } from "react";
import { sendLink, type PromiseFile, type PromiseLink } from "../api/translationApi";
import Subtitles from "./Subtitles";
import InputIcon from "../../../assets/input.svg"
import { getAbbreviateLanguage } from "@/shared/utils/lang";
import { useMutation } from "@tanstack/react-query";

export type MutationProps = {
    link: string | null
    lang: string | null,
    formData: FormData | null
}
export default function Form() {
    const [inputValue, setInputValue] = useState('')
    const [language, setLanguage] = useState<string | null>(null)
    const [fileInputValue, setFileInputValue] = useState('')
    const langForTranslate = getAbbreviateLanguage(language)
    const [formData, setFormData] = useState<FormData | null>(null)
    const mutation = useMutation<
        PromiseLink | PromiseFile | undefined,
        Error,
        MutationProps
    >({
        mutationFn: ({ link, lang, formData }) => sendLink(link, lang, formData)
    })
    const handleInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if (!inputValue && formData) {
            mutation.mutate({ link: null, lang: langForTranslate, formData })
            return
        }

        mutation.mutate({ link: inputValue, lang: langForTranslate, formData: null })
    }

    const handleInputFile = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('audio', file)
        setFormData(formData)
        console.log(formData)
        setFileInputValue(e.currentTarget.value)
    }


    return (
        <>
        <aside className="hidden w-full mx-auto lg:items-center p-4 text-gray-400 lg:flex lg:flex-col lg:gap-4 mb-10">
            <h2 className="hidden text-5xl font-bold  text-white text-center lg:block">Transcribe cualquier vídeo o audio en <span className="text-blue-600">segundos</span></h2>
            
                <span className="text-xl">Selecciona un idioma si quieres ver su traducción</span>
            </aside>
            <section className="w-screen lg:w-3/4 lg:m-auto lg:max-w-3/4 lg:min-h-2/5 lg:h-2/5 bg-slate-800/30 flex flex-col justify-center items-center lg:justify-center rounded-2xl p-8 mb-12 shadow-2xl backdrop-blur">

                <form className="w-full flex p-2 gap-6">

                    {!inputValue &&
                        <div className="flex p-12 flex-col grow-2 gap-1 rounded-xl border-dashed border justify-center items-center border-slate-700 bg-slate-800/20">
                            <img src={InputIcon}/>
                            <label className="text-xl font-bold">Sube tu archivo</label>
                            <p className="text-lg text-gray-400 mb-4">Selecciona un video o audio de tu dispositivo</p>
                            <label htmlFor="fileUpload" className="w-1/4 min-w-1/4 lg:w-1/4 p-3 text-center rounded-md font-bold text-white bg-slate-800 hover:bg-slate-900/80 transition-colors cursor-pointer">
                                Seleccionar archivo
                            </label>
                            
                            <input type="file"
                                onChange={handleInputFile}
                                name="audio"
                                id="fileUpload"
                                accept="video/*"
                                formEncType="multipart/form-data"
                                className="hidden" />

                        </div>}
                    <div className="grow flex flex-col justify-end items-center gap-15">
                        {!fileInputValue &&
                            <div className="w-full flex flex-col justify-around gap-2">
                                <label className=" text-gray-400 pl-1">Introduce un enlace de youtube</label>
                                <input onChange={handleInput}
                                    placeholder="Pega tu enlace aquí"
                                    type='text'
                                    className='min-w-full w-full lg:w-1/4 p-3 text-gray-300 rounded-xl  bg-slate-800 hover:bg-slate-800/80 transition-colors' />

                            </div>}
                        <button
                            type="submit"
                            onClick={handleForm}
                            className="bg-blue-600 w-full min-w-full pl-6 pr-6 pb-3 pt-3 rounded-xl font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer">
                                Transcribir</button>
                    </div>
                </form>
            </section>
            <Subtitles
                mutation={mutation}
                inputValue={inputValue}
                fileInputValue={fileInputValue}
                language={language}

            />
        </>
    )

}

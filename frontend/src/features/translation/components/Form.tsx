import { useState } from "react";
import { sendLink, type PromiseFile, type PromiseLink } from "../api/translationApi";
import { ComboboxMultiple } from "./ComboboxMultiple";
import Subtitles from "./Subtitles";

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

    console.log(langForTranslate)

    return (
        <>
            <aside className="w-screen lg:w-2/4 lg:m-auto lg:max-w-2/4  lg:min-h-2/5 lg:h-2/5 flex flex-col justify-center items-center lg:justify-center">
                <h2 className="hidden text-2xl font-bold text-white text-center lg:block">Transcribe cualquier vídeo o audio en segundos</h2>
                <aside className="hidden lg:items-center p-4 text-gray-400 lg:flex lg:flex-col">
                    Selecciona un idioma si quieres ver su traducción
                </aside>
                <form className="w-96 lg:w-3/4 flex flex-col p-2 gap-6">
                    {!fileInputValue && 
                    <div className="w-full flex flex-col justify-around gap-2">
                        <label className=" text-gray-400 pl-1">Introduce un enlace de youtube</label>
                        <input onChange={handleInput}
                            placeholder="Copia tu enlace aqui"
                            type='text'
                            className='min-w-full w-full lg:w-1/4 p-3 text-gray-300 rounded-xl bg-slate-900' />

                    </div>}
                        {(!inputValue && !fileInputValue) && <span className="text-center">O</span>}
                    {!inputValue && 
                    <div className="w-full flex flex-col gap-2">
                        <label className=" text-gray-400 pl-1">Selecciona un vídeo/audio de tu dispositivo</label>
                        <input type="file"
                            onChange={handleInputFile}
                            name="audio"
                            accept="video/*"
                            formEncType="multipart/form-data"
                            className="min-w-full w-full lg:w-1/4 p-3 text-gray-300 rounded-xl bg-slate-900" />

                    </div>}
                    <div className="w-full flex gap-2 justify-between items-center">
                        <ComboboxMultiple
                            language={language}
                            setLanguage={setLanguage}
                        />
                        <button
                            type="submit"
                            onClick={handleForm}
                            className="bg-blue-600 min-w-2/4 pl-6 pr-6 pb-3 pt-3 rounded-xl font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer">Transcribir</button>
                    </div>
                </form>
            </aside>
            <Subtitles
            mutation={mutation}
            inputValue={inputValue}
            fileInputValue={fileInputValue}
            language={language}
                
            />
        </>
    )

}

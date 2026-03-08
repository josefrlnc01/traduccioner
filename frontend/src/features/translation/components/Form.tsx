import { useState } from "react";
import { sendLink } from "../api/translationApi";
import { ComboboxMultiple } from "./ComboboxMultiple";
import Subtitles from "./Subtitles";

import { getAbbreviateLanguage } from "@/shared/utils/lang";
import { useMutation } from "@tanstack/react-query";

export type MutationProps = {
    link: string
    lang: string | null
}
export default function Form() {
    const [inputValue, setInputValue] = useState('')
    const [language, setLanguage] = useState<string | null>(null)

    const langForTranslate = getAbbreviateLanguage(language)

    const mutation = useMutation<
        {
            subtitles: string
            translatedText: string
            title: string
            id: string
        } | undefined,
        Error,
        MutationProps
    >({
        mutationFn: ({ link, lang }) => sendLink(link, lang)
    })
    const handleInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        mutation.mutate({ link: inputValue, lang: langForTranslate })
    }



    return (
        <>
            <aside className="w-screen md:w-2/4 md:mx-auto  md:min-h-2/5 md:h-2/5 flex flex-col justify-center items-center md:justify-center">
            <h2 className="hidden text-2xl font-bold text-white text-center md:block">Traduce cualquier canción en segundos</h2>
            <aside className="hidden md:items-center p-4 text-gray-400 md:flex md:flex-col">
                Pega un enlace de Youtube y selecciona un idioma para ver la traducción
            </aside>
                <form className="w-96 md:w-3/4 flex flex-col p-2 gap-6">
                    <div className="w-full flex justify-around gap-2">
                    <input onChange={handleInput}
                        placeholder="Copia tu enlace aqui"
                        type='text'
                        className='min-w-full w-full md:w-1/4 p-3 text-gray-300 rounded-xl bg-slate-900' />
                        <button
                            type="submit"
                            onClick={handleForm}
                            className="hidden bg-blue-600 pl-6 pr-6 pb-2 pt-2 rounded-xl font-semibold text-white md:block hover:bg-blue-500 transition-colors cursor-pointer">Traducir</button>
                    </div>

                    <div className="w-full flex gap-2 justify-between items-center">
                        <ComboboxMultiple
                            language={language}
                            setLanguage={setLanguage}
                        />
                        <button
                            type="submit"
                            onClick={handleForm}
                            className="bg-blue-600 pl-6 pr-6 pb-2 pt-2 rounded-xl font-semibold text-white md:hidden">Traducir</button>
                    </div>
                </form>
            </aside>
            <Subtitles
                mutation={mutation}
            />
        </>
    )

}

import { useState } from "react";
import { sendLink } from "../services/video.service";
import { ComboboxMultiple } from "src/components/ComboboxMultiple";
import SubtitlesView from "./SubtitlesView";

import { getAbbreviateLanguage } from "src/utils/getAbbreviateLang";
import { useMutation } from "@tanstack/react-query";

export type MutationProps = {
    link: string
    lang: string | null
}
export default function FormView() {
    const [inputValue, setInputValue] = useState('')
    const [language, setLanguage] = useState<string | null>(null)
    

    console.log(language)
    const langForTranslate = getAbbreviateLanguage(language)
    
    const mutation = useMutation<
    {subtitles: string
    translatedText: string
    title: string
    id: string
    } | undefined,
    Error,
    MutationProps
    >({
        mutationFn : ({link, lang}) => sendLink(link,lang)
    })
    const handleInput = (e:React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        mutation.mutate({link:inputValue, lang:langForTranslate})
    }

    
    
    
  return (
    <>
    <aside className="w-full lg:w-96 lg:mx-auto lg:max-w-96 flex flex-col justify-center items-center">
        <form className="w-96 md:w-full flex flex-col p-2 gap-6">
        <input onChange={handleInput} 
        placeholder="Copia tu enlace aqui" 
        type='text' 
        className='min-w-full w-full lg:w-6/12 p-3 text-gray-300 rounded-md bg-slate-900'/>
        <div className="w-full flex gap-2 justify-between items-center">
            <ComboboxMultiple
            language={language}
            setLanguage={setLanguage}
            />
        <button 
        type="submit" 
        onClick={handleForm}
        className="bg-blue-600 pl-6 pr-6 pb-2 pt-2 rounded-xl font-semibold text-white">Traducir</button>
        </div>
        
    </form>
    
    </aside>
    <SubtitlesView
    mutation={mutation}
    />
    </>
    )
    
}

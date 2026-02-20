import { useState } from "react";
import { sendLink } from "../services/sendLink";
import { ComboboxMultiple } from "@/components/ComboboxMultiple";
import SubtitlesView from "./SubtitlesView";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getAbbreviateLanguage } from "@/components/utils/getAbbreviateLang";

export default function FormView() {
    const [inputValue, setInputValue] = useState('')
    const [message, setMessage] = useState('')
    const [language, setLanguage] = useState<string | null>(null)
    

    console.log(language)
    const lang = getAbbreviateLanguage(language)
    console.log(lang)

    const queryClient = useQueryClient()
    const { data, isError, isLoading } = useQuery({
        queryKey: ['subtitles', inputValue],
        retry: 1,
        enabled: !!inputValue,
        queryFn: () => sendLink(inputValue, lang)
    })

    const handleInput = (e:React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        queryClient.invalidateQueries({queryKey:['subtitles', inputValue]})
        setInputValue(e.target.value)
    }


  return (
    <>
    <aside className="w-full lg:w-96 lg:mx-auto lg:max-w-96  p-5 flex flex-col">
        <form className="w-96 md:w-full flex flex-col gap-4">
        <input onChange={handleInput} 
        placeholder="Copia tu enlace aqui" 
        type='text' 
        className='w-full min-w-full lg:w-6/12 p-3 text-gray-300 rounded-md bg-slate-900'/>
        <div className="w-full flex gap-2 justify-between items-center">
            <ComboboxMultiple
            language={language}
            setLanguage={setLanguage}
            />
        <button type="submit" className="w-2/4 grow-0 bg-blue-600 pb-2 pt-2 rounded-xl font-semibold text-white">Traducir</button>
        </div>
        
    </form>
    
    </aside>
    <SubtitlesView
    data={data}
    isError={isError}
    isLoading={isLoading}
    />
    </>
  )
}

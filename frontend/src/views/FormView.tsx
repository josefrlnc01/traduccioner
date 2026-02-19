import { useState } from "react";
import { sendLink } from "../services/sendLink";
import { ComboboxMultiple } from "@/components/ComboboxMultiple";


export default function FormView() {
    const [inputValue, setInputValue] = useState('')
    const [message, setMessage] = useState('')
    const languages = {
        Español: "es",
        Ingles: "en",
        Frances: "fr",
        Italiano: "it"
    }

    const handleInput = (e:React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleSubmit = async (e:React.ChangeEvent<HTMLFormElement, HTMLFormElement>) => {
        e.preventDefault()
        const result = await sendLink(inputValue)
        if (result) {
            const { message} = result
            setMessage(message)
        }
    }

  return (
    <>
    <aside className="w-full lg:w-96 lg:mx-auto lg:max-w-96  p-5 flex flex-col">
        <form onSubmit={handleSubmit} className="w-96 md:w-full flex flex-col gap-4">
        <input onChange={handleInput} 
        placeholder="Copia tu enlace aqui" 
        type='text' 
        className='w-full min-w-full lg:w-6/12 p-3 text-gray-300 rounded-md bg-slate-900'/>
        <div className="w-full flex gap-2 justify-between items-center">
            <ComboboxMultiple/>
        <button type="submit" className="w-2/4 grow-0 bg-blue-600 pb-2 pt-2 rounded-xl font-semibold text-white">Traducir</button>
        </div>
        
    </form>
    </aside>
    
    </>
  )
}

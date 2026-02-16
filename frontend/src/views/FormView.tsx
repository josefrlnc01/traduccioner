import { useState } from "react";
import { sendLink } from "../services/sendLink";


export default function FormView() {
    const [inputValue, setInputValue] = useState('')
    const languages = {
        Español: "es",
        Ingles: "en",
        Frances: "fr",
        Italiano: "it"
    }
  
    const handleInput = (e:React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement, HTMLFormElement>) => {
        e.preventDefault()
        sendLink(inputValue)
    }

    console.log(inputValue)
  return (
    <>
    <aside className="mx-auto w-full min-w-full p-5 flex flex-col  ">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input onChange={handleInput} placeholder="Copia tu enlace aqui" type='text' className='w-full min-w-full p-3 text-gray-300 rounded-md bg-slate-900'/>
        <div className="w-full flex justify-between">
            <select className="bg-slate-900 rounded-xl pb-1 pt-1 pr-2 pl-2">
                <option className="text-gray-500" value="">Lenguaje</option>
                    {Object.entries(languages).map(([label, code]) => (
                        <option key={code} value={code}>{label}</option>
                    ))}
            </select>
        <button type="submit" className="w-2/4 grow-0 bg-blue-600 pb-2 pt-2 rounded-xl font-semibold text-white">Traducir</button>
        </div>
        
    </form>
    </aside>
    
    </>
  )
}

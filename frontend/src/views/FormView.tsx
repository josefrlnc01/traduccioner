import { useState } from "react";
import { sendLink } from "../services/sendLink";


export default function FormView() {
    const [inputValue, setInputValue] = useState('')
    
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
    <form onSubmit={handleSubmit} className='mx-auto w-96 h-72 flex flex-col justify-center items-center min-w-96 border-2 border-solid border-black'>
        <input onChange={handleInput} type='text' className='w-full'/>
        <button type="submit" className="w-2/4 border-2 border-solid border-black">Enviar</button>
    </form>
    </>
  )
}

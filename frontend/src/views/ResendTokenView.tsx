import { resendToken } from "@/api/AuthApi"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"


export default function ResendTokenView() {
    const [email, setEmail] = useState('')
    const {mutate} = useMutation({
        mutationFn: resendToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })


    const handleInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) =>  {
        e.preventDefault()
        mutate(email)
    }



  return (
    <>
    <form 
    onSubmit={handleSubmit}
    className="max-w-md mx-auto space-y-6 p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl">
        <div className="space-y-4 flex flex-col">
            <label className="text-sm font-semibold text-zinc-300 ml-1">Email</label>
            <input 
            onChange={handleInput}
            type="email" 
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"/>
        </div>
        <input 
        value={'Reenviar código'}
        type="submit"
        className="w-full p-3 mt-4 cursor-pointer bg-white hover:bg-zinc-200 text-black font-bold rounded-lg transition-colors shadow-lg"/>
    </form>
    </>
  )
}

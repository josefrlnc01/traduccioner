import { confirmAccount } from "@/features/auth/api/authApi"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from 'react-toastify'

import type { TokenConfirmation } from "@/features/token/types/token.types"
import { Link } from "react-router"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp"


export default function ConfirmAccountView() {
  const [token, setToken] = useState<TokenConfirmation['token']>('')

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
    }
  })

  const handleChange = (token: TokenConfirmation['token']) => {
    setToken(token)
  }

  const handleComplete = (token: TokenConfirmation['token']) => {
    mutate(token)
  }

  return (
    <>
      <section 
      className="max-w-md mx-auto space-y-6 p-8 flex flex-col justify-center items-center">
        <aside className="p-12 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl">
        <InputOTP value={token} maxLength={6} onChange={handleChange} onComplete={handleComplete}>
          <InputOTPGroup className="text-white font-bold">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <nav className="mt-10 flex flex-col space-y-4">
          <Link
            to='/auth/request-code'
            className="text-center text-gray-300 font-normal"
          >
            Solicitar un <span className="text-indigo-400 font-medium">nuevo código</span>
          </Link>
        </nav>
        </aside>
      </section>
    </>

  )
}

import { confirmAccount } from "@/api/AuthApi"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import type { TokenConfirmation } from "src/types"

export default function ConfirmAccountView() {
    const [token, setToken] = useState<TokenConfirmation['token']>('1234')


    const {mutate} = useMutation({
        mutationFn: confirmAccount,
        onError : (error) => {
            console.log(error)
        },
        onSuccess : (data) => {
            console.log(data)
        }
    })

    const handleChange = (token: TokenConfirmation['token']) => {
        setToken(token)
    }

    const handleComplete = (token: TokenConfirmation['token']) => {
        mutate(token)
    }

   return (
    <InputOTP value={token} maxLength={6} onChange={handleChange} onComplete={handleComplete}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

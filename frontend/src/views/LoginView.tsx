import { authenticateAccount } from '@/api/AuthApi'
import ErrorMessage from '@/components/ErrorMessage'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import {useForm} from 'react-hook-form'
import { toast } from 'react-toastify'

type UserLoginForm = {
    email: string
    password: string
}

export default function LoginView() {
    const initialValues: UserLoginForm = {
        email: '',
        password: ''
    }
    const {mutate} = useMutation({
        mutationFn: authenticateAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const {register, handleSubmit, formState : {errors} } = useForm({defaultValues: initialValues})

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
        <form className='space-y-3 p-4 bg-black rounded-md' onSubmit={handleSubmit(handleLogin)}>
            <div className='flex flex-col gap-5'>
                <label className='text-2xl'>Email</label>
                <input
                id='email'
                type='email' 
                className='w-full p-4'
                {...register("email", {
                    required: 'El email es obligatorio',
                    pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
                },
                })}/>
                {errors && (
                    <ErrorMessage>{errors.email?.message}</ErrorMessage>
                )}
            </div>
            <div className='flex flex-col gap-5'>
            <label className='text-2xl'>Contraseña</label>
                <input type='password'
                className='w-full p-4'
                {...register('password', {
                    required: 'La contraseña es obligatoria',
                    
                })}
                />
            </div>

            <input type='submit'
            value='Iniciar sesión'
            className='w-full p-2 cursor-pointer bg-white text-black'
            />
            {errors && (
                    <ErrorMessage>{errors.password?.message}</ErrorMessage>
                )}
        </form>
    </>
  )
}

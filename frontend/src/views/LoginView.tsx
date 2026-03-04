import { authenticateAccount } from '@/api/AuthApi'
import ErrorMessage from '@/components/ErrorMessage'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'react-toastify'

type UserLoginForm = {
    email: string
    password: string
}

export default function LoginView() { 

    const navigate = useNavigate()
    const initialValues: UserLoginForm = {
        email: '',
        password: ''
    }
    const { mutate } = useMutation({
        mutationFn: authenticateAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            navigate('/')
        }
    })


    

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

    return (
        <>
            <form 
    className='max-w-md mx-auto space-y-6 p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl' 
    onSubmit={handleSubmit(handleLogin)}
    noValidate
>
    {/* Header o Título opcional */}
    <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
        <p className="text-zinc-400 mt-2">Ingresa tus credenciales para acceder</p>
    </div>

    <div className='flex flex-col gap-2'>
        <label className='text-sm font-semibold text-zinc-300 ml-1' htmlFor='email'>
            Correo Electrónico
        </label>
        <input
            id='email'
            type='email'
            placeholder="ejemplo@correo.com"
            className='w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
            {...register("email", {
                required: 'El email es obligatorio',
                pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "E-mail no válido",
                },
            })} 
        />
        {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
        )}
    </div>

    <div className='flex flex-col gap-2'>
        <label className='text-sm font-semibold text-zinc-300 ml-1' htmlFor='password'>
            Contraseña
        </label>
        <input 
            id='password'
            type='password'
            placeholder="••••••••"
            className='w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'
            {...register('password', {
                required: 'La contraseña es obligatoria',
            })}
        />
        {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
    </div>

    <input 
        type='submit'
        value='Iniciar sesión'
        className='w-full p-3 mt-4 cursor-pointer bg-white hover:bg-zinc-200 text-black font-bold rounded-lg transition-colors shadow-lg'
    />

    <nav className='mt-6 flex flex-col items-center'>
        <Link
            className="text-sm text-zinc-400 hover:text-white transition-colors"
            to={'/auth/register'}
        >
            ¿No tienes cuenta? <span className="text-indigo-400 font-medium">Crea una aquí</span>
        </Link>
    </nav>
</form>
        </>
    )
}

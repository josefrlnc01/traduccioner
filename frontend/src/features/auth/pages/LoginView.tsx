import { authenticateAccount, authenticateGoogle } from '@/features/auth/api/authApi'
import ErrorMessage from '@/components/ErrorMessage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import type { UserLoginForm } from '../types/auth.types'



export default function LoginView() {
    const queryClient = useQueryClient()
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
            queryClient.invalidateQueries({queryKey: ['user']})
            navigate('/')
        }
    })

    const loginGoogle = useMutation({
        mutationFn: authenticateGoogle,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            navigate('/')
        }
    })

    const handleLoginGoogle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        loginGoogle.mutate()
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

    return (
        <>
            <section className='w-full min-h-full h-full pt-6 pb-6'>
                <form
                    className='max-w-md 
                mx-auto 
                space-y-6 
                p-8  
                bg-slate-900/60
                border border-slate-700
                rounded-2xl
                backdrop-blur
                shadow-xl'
                    onSubmit={handleSubmit(handleLogin)}
                    noValidate
                >
                    {/* Header o Título opcional */}
                    <div className="text-center mb-8 flex flex-col justify-center items-center gap-4">

                        <div className='flex flex-col'>
                            <h1 className="text-4xl font-bold text-white">Aud<span className='text-blue-600/80'>Wave</span></h1>
                            <p className="text-zinc-400 mt-2">Transcribe audio con IA</p>

                        </div>
                        <h2 className='text-3xl font-bold text-white'>Iniciar sesión</h2>
                    </div>

                    <button
                        type='submit'
                        onClick={handleLoginGoogle}
                        className='w-full py-3 rounded-xl
                    bg-white text-gray-800
                    font-medium
                    flex items-center justify-center gap-3
                    hover:bg-gray-100 hover:scale-[1.02] transition cursor-pointer'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                            <path fill="#FFC107" d="M43.611 20.083h-1.611V20H24v8h11.303C33.91 32.657 29.354 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.964 3.036l5.657-5.657C34.053 6.053 29.278 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.964 3.036l5.657-5.657C34.053 6.053 29.278 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                            <path fill="#4CAF50" d="M24 44c5.235 0 9.96-2.009 13.527-5.273l-6.245-5.285C29.201 34.889 26.715 36 24 36c-5.333 0-9.876-3.317-11.29-7.946l-6.523 5.025C9.503 39.556 16.227 44 24 44z" />
                            <path fill="#1976D2" d="M43.611 20.083h-1.611V20H24v8h11.303c-1.106 3.303-3.343 5.936-6.021 7.442l.01-.007 6.245 5.285C33.29 42.091 44 36 44 24c0-1.341-.138-2.651-.389-3.917z" />
                        </svg>
                        Continuar con Google</button>

                    <div className="flex items-center gap-4 my-6 text-slate-500">
                        <div className="flex-1 h-px bg-slate-700"></div>
                        <span className="text-sm">o</span>
                        <div className="flex-1 h-px bg-slate-700"></div>
                    </div>


                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-semibold text-zinc-300 ml-1' htmlFor='email'>
                            Email
                        </label>
                        <input
                            id='email'
                            type='email'
                            placeholder="ejemplo@correo.com"
                            className='w-full px-4 py-3 rounded-xl
                        bg-slate-900/60
                        border border-slate-700
                        focus:border-blue-500
                        focus:ring-2 focus:ring-blue-500/30
                        outline-none
                        transition text-white'
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
                            className='w-full px-4 py-3 rounded-xl
                        bg-slate-900/60
                        border border-slate-700
                        focus:border-blue-500
                        focus:ring-2 focus:ring-blue-500/30
                        outline-none
                        transition text-white'
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
                        className='w-full py-3 rounded-xl
                    bg-linear-to-r from-blue-500 to-indigo-500
                    text-white font-semibold
                    hover:scale-[1.02] transition cursor-pointer'
                    />

                    <nav className='mt-6 flex flex-col items-center gap-3'>
                        <p className='text-sm text-zinc-400 transition-colors'>¿No tienes una cuenta aún? <span className="text-indigo-400 font-medium hover:text-indigo-300 cursor-pointer"><Link
                            to={'/auth/register'}
                        >Crea una aquí</Link></span></p>
                        {import.meta.env.DEV && <p className='text-sm text-zinc-400 transition-colors'>¿Has olvidado tu contraseña? <span className="text-indigo-400 font-medium hover:text-indigo-300 cursor-pointer"><Link
                            to={'/auth/forgot-password'}
                        >Solicita una nueva</Link></span></p>}
                    </nav>
                </form>
            </section>
        </>
    )
}

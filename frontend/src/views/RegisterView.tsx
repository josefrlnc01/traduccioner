import { createAccount } from "@/api/AuthApi"
import ErrorMessage from "@/components/ErrorMessage"
import type { RegistrationForm } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"

export default function RegisterView() {
    const navigate = useNavigate()
    const initialValues: RegistrationForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    }

    const { mutate } = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/auth/login')
        }
    })

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const handleRegister = (formData: RegistrationForm) => mutate(formData)


    return (
        <>
            <form className="w-full lg:max-w-md lg:mx-auto  space-y-6 p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl" onSubmit={handleSubmit(handleRegister)}>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Traduccioner</h2>
                    <p className="text-zinc-400 mt-2">Crea una cuenta nueva</p>
                </div>
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-zinc-300 ml-1">Nombre</label>
                    <input
                        type="text"
                        {...register('name', {
                            required: 'El campo nombre es necesario'
                        })}
                        className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                    {errors && (
                        <ErrorMessage>{errors.name?.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-zinc-300 ml-1">Email</label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'El campo email es obligatorio'
                        })}
                        className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                    {errors && (
                        <ErrorMessage>{errors.email?.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-zinc-300 ml-1">Contraseña</label>
                    <input
                        type="password"
                        {...register('password', {
                            required: 'El campo de contraseña es obligatorio'
                        })}
                        className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                    {errors && (
                        <ErrorMessage>{errors.password?.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-zinc-300 ml-1">Repite la contraseña</label>
                    <input
                        type="password"
                        {...register('password_confirmation', {
                            required: 'El campo de confirmación de contraseña es obligatorio'
                        })}
                        className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" />
                    {errors && (
                        <ErrorMessage>{errors.password_confirmation?.message}</ErrorMessage>
                    )}
                </div>
                <input type="submit" className="w-full p-3 m-auto cursor-pointer bg-white hover:bg-zinc-200 text-black font-bold rounded-lg transition-colors shadow-lg" value={'Registrarme'} />

                <nav className='mt-10 flex flex-col space-y-3'>
                    <Link
                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                        to={'/auth/login'}>¿Tienes ya una cuenta? <span className="text-indigo-400 font-medium">Iniciar sesión</span> </Link>
                </nav>
            </form>
        </>
    )
}

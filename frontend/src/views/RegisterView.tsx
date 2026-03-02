import { createAccount } from "@/api/AuthApi"
import ErrorMessage from "@/components/ErrorMessage"
import type { RegistrationForm } from "@/types"
import { useMutation} from "@tanstack/react-query"
import {useForm} from "react-hook-form"
import { toast } from "react-toastify"

export default function RegisterView() {

    const initialValues: RegistrationForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    }

    const {mutate} = useMutation({
        mutationFn: createAccount,
        onError : (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})

    const handleRegister = (formData: RegistrationForm) => mutate(formData)

    
  return (
    <>
        <form className="space-y-8 p-10" onSubmit={handleSubmit(handleRegister)}>
            <div className="flex flex-col gap-5">
                <label className="text-md">Nombre</label>
                <input 
                type="text"
                {...register('name', {
                    required: 'El campo nombre es necesario'
                })}
                className="w-full p-4"/>
                {errors && (
                    <ErrorMessage>{errors.name?.message}</ErrorMessage>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <label className="text-md">Email</label>
                <input 
                type="email"
                {...register('email', {
                    required: 'El campo email es obligatorio'
                })}
                className="w-full p-4"/>
                {errors && (
                    <ErrorMessage>{errors.email?.message}</ErrorMessage>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <label className="text-md">Contraseña</label>
                <input 
                type="password"
                {...register('password', {
                    required: 'El campo de contraseña es obligatorio'
                })}
                className="w-full p-4"/>
                {errors && (
                    <ErrorMessage>{errors.password?.message}</ErrorMessage>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <label className="text-md">Repite la contraseña</label>
                <input 
                type="password"
                {...register('password_confirmation', {
                    required: 'El campo de confirmación de contraseña es obligatorio'
                })}
                className="w-full p-4"/>
                {errors && (
                    <ErrorMessage>{errors.password_confirmation?.message}</ErrorMessage>
                )}
            </div>
            <input type="submit" className="w-full p-6" value={'Registrarme'}/>
        </form>
    </>
  )
}

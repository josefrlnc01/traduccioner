import { useState } from "react"
import NewPasswordToken from "../components/NewPasswordToken"
import NewPasswordFormComponent from "../components/NewPasswordFormComponent"

export default function NewPasswordView() {
    const [token, setToken] = useState('')
    const [isValidToken, setIsValidToken] = useState(false)

    return (
        <>
            <aside className="w-full min-h-screen md:w-3/4 lg:w-3/4 m-auto py-20">
                <h1 className="text-5xl text-center font-black text-white">Reestablecer  contraseña</h1>
                <p className="text-2xl text-center font-light text-white mt-5">
                    Ingresa el código que recibiste {''}
                    <span className=" text-blue-600 font-bold"> por email</span>
                </p>
                {!isValidToken ?
                    <NewPasswordToken
                        token={token}
                        setToken={setToken}
                        setIsValidToken={setIsValidToken} />
                    :
                    <NewPasswordFormComponent
                        token={token}
                    />}
            </aside>
        </>
    )
}
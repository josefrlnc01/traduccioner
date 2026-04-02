import { useTheme } from '@/shared/context/ThemeContext'
import { useEffect, useState } from 'react'

//Frases de espera en transcripción
const awaitPhrase = [
    "Analizando archivo, puede tardar un poco...", "Transcribiendo audio...", "Procesando texto..."
]

export default function TranscriptionSkeleton() {
    //Tema actual 
    const { theme } = useTheme()
    //Índice del array de frases
    const [index, setIndex] = useState(0)
    //Estado para cambiar estilos del texto
    const [fade, setFade] = useState(true)
    

    //Hook para mostrar frases de espera con fade del texto y espera de 6 segundos entre frase
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false)

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % awaitPhrase.length)
                setFade(true)
            }, 300)
        }, 6000)

        return () => clearInterval(interval)
    }, [awaitPhrase.length])

    //Frase actual
    const phrase = awaitPhrase[index]


    return (
        <section className={`w-full h-full fixed inset-0 flex flex-col items-center justify-center z-30 ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-slate-200'} backdrop-blur-md p-8`}>


            <div className='flex items-center gap-3 mb-8'>
                <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>Procesando transcripción</p>
            </div>


            <div className="space-y-4 w-full max-w-2xl">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-start">
                        <div className="w-12 h-4 bg-slate-700/80 rounded animate-pulse shrink-0" />
                        <div
                            className="h-4 bg-slate-700/80 rounded animate-pulse"
                            style={{ width: `${Math.random() * 40 + 50}%` }}
                        />
                    </div>
                ))}
            </div>

            <small
                className={`mt-8 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900'} transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {phrase}
            </small>

        </section>
    )
}

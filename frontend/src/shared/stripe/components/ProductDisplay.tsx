import { tokenStore } from "@/lib/token.store"
import { toast } from "react-toastify"
import Header from "@/features/transcription/components/Header"
import Footer from "@/features/transcription/components/Footer"
import { subscriptionStore } from "@/shared/stores/user-suscription.store"
import { useTheme } from "@/shared/context/ThemeContext"




export default function ProductDisplay() {
    const urlBackend = import.meta.env.VITE_API_URL
    const { theme } = useTheme()
    const subscription = subscriptionStore.get()
    const handleCheckout = async (price_id: string) => {
        const accessToken = tokenStore.get()

        if (!accessToken) {
            console.error('No hay access token para iniciar checkout')
            return
        }

        const res = await fetch(`${urlBackend}/stripe/create-checkout-session`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({ price_id: price_id })
        })

        const data = await res.json()
        if (data.message) {
            toast.success(data.message)
        }
        if (data?.url) {
            window.location.href = data.url
        }


    }

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const accessToken = tokenStore.get()
        const response = await fetch(`${urlBackend}/stripe/cancel-subscription`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        const data = await response.json()
        if (data.success) {
            toast.success(data.message)
        } else {
            toast.error(data.error)
        }

    }



    return (
        <>

            <Header />
            <section className={`w-full min-w-full p-6 flex flex-col justify-center items-center grow gap-8 md:gap-2 py-14 md:py-10 lg:py-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/10' : 'bg-slate-50'}`}>

                {/* --- INDICADOR DE SUSCRIPCIÓN ACTIVA --- */}
                {subscription !== 'free' && (
                    <aside className={`mb-8 p-4 rounded-2xl flex flex-col sm:row items-center gap-4 animate-fade-in transition-all duration-300 
            ${theme === 'dark'
                            ? 'bg-slate-800/60 border border-blue-500/30 shadow-xl backdrop-blur-md'
                            : 'bg-white border border-blue-200 shadow-sm'}`}>

                        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-colors
                ${theme === 'dark'
                                ? 'bg-blue-500/10 border-blue-500/20'
                                : 'bg-blue-50 border-blue-100'}`}>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
                                Suscripción <span className="text-blue-600 font-bold uppercase tracking-tight">{subscription}</span> activa
                            </p>
                        </div>

                        <button
                            className={`text-xs font-semibold transition-colors duration-200 cursor-pointer underline underline-offset-4 
                    ${theme === 'dark'
                                    ? 'text-slate-400 hover:text-red-400 decoration-slate-700 hover:decoration-red-400/50'
                                    : 'text-slate-500 hover:text-red-600 decoration-slate-300 hover:decoration-red-600/50'}`}
                            onClick={handleDelete}
                            type="button"
                        >
                            Cancelar plan actual
                        </button>
                    </aside>
                )}

                {/* --- GRILLA DE PRECIOS --- */}
                <aside className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 w-full md:w-3/4 lg:w-3/4 m-auto p-0 md:p-10 lg:p-14'>

                    {/* PLAN BÁSICO */}
                    <div className={`pricing-card p-8 rounded-2xl flex flex-col h-full border-2 transition-all hover:scale-[1.02] 
            ${theme === 'dark'
                            ? 'bg-slate-800/40 border-transparent hover:border-[#0d59f2]'
                            : 'bg-white border-slate-200 shadow-sm hover:border-[#0d59f2]'}`}>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Básico</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className={`text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>$0</span>
                                <span className="text-gray-400 ml-1">/mes</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 grow">
                            {["10 mins gratis/mes", "Transcripción original", "TXT, PDF SRT, VTT"].map((item, i) => (
                                <li key={i} className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* PLAN PRO (RECOMENDADO) */}
                    <div className={`pricing-card relative p-8 rounded-2xl flex flex-col h-full border-2 scale-105 z-10 transition-all
            ${theme === 'dark'
                            ? 'bg-slate-800/60 border-[#0d59f2] shadow-2xl shadow-blue-900/20'
                            : 'bg-white border-[#0d59f2] shadow-xl shadow-blue-500/10'}`}>
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold bg-[#0d59f2] text-white rounded-full py-1 px-4 shadow-lg">RECOMENDADO</span>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold uppercase text-[#0d59f2] tracking-widest">PRO</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className={`text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>$6</span>
                                <span className="text-gray-400 ml-1">/mes</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 grow">
                            {["3 horas/mes", "Transcripción multilingüe", "TXT, PDF SRT, VTT"].map((item, i) => (
                                <li key={i} className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleCheckout(import.meta.env.VITE_PRICE_ID_PRO)}
                            className="w-full py-3 rounded-xl font-bold text-white bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 shadow-lg cursor-pointer"
                        >
                            Mejorar a PRO
                        </button>
                    </div>

                    {/* PLAN BUSINESS */}
                    <div className={`pricing-card p-8 rounded-2xl flex flex-col h-full border-2 transition-all hover:scale-[1.02]
            ${theme === 'dark'
                            ? 'bg-slate-800/40 border-transparent hover:border-[#0d59f2]'
                            : 'bg-white border-slate-200 shadow-sm hover:border-[#0d59f2]'}`}>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">BUSINESS</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className={`text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>$15</span>
                                <span className="text-gray-400 ml-1">/mes</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 grow">
                            {["10 horas/mes", "Transcripción multilingüe", "Todos los formatos", "Resumen IA"].map((item, i) => (
                                <li key={i} className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                                    <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleCheckout(import.meta.env.VITE_PRICE_ID_BUSINESS)}
                            className={`w-full py-3 rounded-xl font-semibold transition-all cursor-pointer
                    ${theme === 'dark'
                                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'}`}
                        >
                            Elegir Business
                        </button>
                    </div>
                </aside>
            </section>

            <Footer />
        </>


    )
}

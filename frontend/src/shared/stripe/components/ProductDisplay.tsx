import { tokenStore } from "@/lib/token.store"
import { toast } from "react-toastify"
import Header from "@/features/transcription/components/Header"
import Footer from "@/features/transcription/components/Footer"
import { subscriptionStore } from "@/shared/stores/user-suscription.store"




export default function ProductDisplay() {
    const urlBackend = import.meta.env.VITE_API_URL
    
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
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${accessToken}`
            }
        })

        const data = await response.json()
        if (data.success) {
            toast.success(data.message)
        } else {
            toast.error(data.error)
        }
        
    }

    console.log(subscription)

    return (
        <>

        <Header/>
            <section className=' bg-slate-800/30 w-full min-w-full  p-6 flex flex-col justify-center items-center grow gap-8 md:gap-4 py-14 md:py-10 lg:py-4'>
                {subscription !== 'free' && <button
                    className='mx-auto bg-blue-600 px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-500 transition-colors ease-in-out'
                    onClick={handleDelete} type="submit">
                    Cancelar suscripción
                </button>}
                <aside className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 w-full md:w-3/4 md:max-w-3/4 lg:w-3/4 ld:max-w-3/4 m-auto p-0 md:p-10 lg:p-14'>
                
                    <div className="pricing-card p-8 rounded-custom bg-slate-800/40 flex flex-col h-full border-2 border-solid border-transparent rounded-md hover:scale-[1.02]  hover:border-[#0d59f2] transition-all opacity-100">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Básico</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold">$0</span>
                                <span className="text-gray-400 ml-1">/mes</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 grow">
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                10 mins gratis/mes
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                Transcripción a idioma original
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                TXT, PDF SRT, VTT
                            </li>
                        </ul>


                    </div>

                    <div className="pricing-card relative p-8 rounded-custom bg-slate-800/40 flex flex-col h-full border-2 border-solid rounded-md scale-105 border-[#0d59f2] transition-all opacity-100">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2  text-sm justify-center items-center font-bold bg-[#0d59f2] rounded-3xl pt-1 pb-1 pr-3 pl-3">RECOMENDADO</span>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold uppercase text-[#0d59f2] tracking-widest">PRO</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold">$6</span>
                                <span className="text-gray-400 ml-1">/mes</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 grow">
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                3 horas/mes
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                Transcripción multilingüe
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                TXT, PDF SRT, VTT
                            </li>
                        </ul>
                        <button
                            onClick={() => handleCheckout(import.meta.env.VITE_PRICE_ID_PRO)}
                            className="w-full py-3 rounded-xl font-semibold text-white
                        bg-linear-to-r from-blue-600 to-indigo-800
                        hover:from-blue-400 hover:to-indigo-400
                        transition-all duration-200 shadow-lg cursor-pointer ease-in">Mejorar a PRO</button>
                    </div>

                    <div className="pricing-card p-8 rounded-custom bg-slate-800/40 flex flex-col h-full border-2 border-solid border-transparent rounded-md hover:scale-[1.02] hover:border-[#0d59f2] transition-all opacity-100">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">BUSINESS</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold">$15</span>
                                <span className="text-gray-400 ml-1">/mes</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8 grow">
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                10 horas/mes
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                Transcripción multilingüe
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                TXT, PDF SRT, VTT, DOCX, CSV, JSON
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                Resumen IA
                            </li>
                        </ul>
                        <button
                            onClick={() => handleCheckout(import.meta.env.VITE_PRICE_ID_BUSINESS)}
                            className="w-full py-3 rounded-xl font-semibold
                    bg-slate-700 text-white
                    hover:bg-slate-600 transition cursor-pointer">Elegir Business</button>
                    </div>
                </aside>
            </section>

            <Footer/>
        </>


    )
}

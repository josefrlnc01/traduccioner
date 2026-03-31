import { Link } from "react-router";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger)


export default function Pricing() {
    useGSAP(() => {
        gsap.to(".pricing-box", {
            scrollTrigger: {
                trigger: ".pricing-box",
                start: "top 80%"
            },
            opacity: 1,
            duration: 0.8
        })
    })


    return (
        <section className='pricing-box bg-slate-800/30 w-full min-w-full p-6 flex flex-col justify-center items-center grow gap-8 md:gap-4 py-14 md:py-10 lg:py-4 opacity-0'>
            <aside className="flex flex-col items-center gap-4">
                <h3 className='text-3xl md:text-4xl text-white font-bold text-center'>Planes diseñados a medida</h3>
                <p className='max-w-2xl mx-auto text-sm md:text-lg text-gray-500 text-center leading-relaxed'>Escoge lo que mejor se adapte a tus necesidades.</p>
            </aside>
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

                    <Link className="w-full flex justify-center items-center py-3 rounded-xl font-semibold
                    border border-slate-500 text-slate-200
                    hover:bg-slate-800 cursor-pointer transition-colors duration-200 ease-in" to={'/auth/register'}>
                        <span className="text-center">Probar gratis</span>
                    </Link>
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
                    <button className="w-full py-3 rounded-xl font-semibold text-white
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
                    <button className="w-full py-3 rounded-xl font-semibold
                    bg-slate-700 text-white
                    hover:bg-slate-600 transition cursor-pointer">Elegir Business</button>
                </div>
            </aside>
        </section>
    )
}

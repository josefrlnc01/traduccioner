import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';


gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger) // register the hook to avoid React version discrepancies 

export default function FeaturesSection() {


    useGSAP(() => {
        gsap.from(".card", {
            scrollTrigger: {
                trigger: ".box",
                start: "top 80%"
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        })

        gsap.utils.toArray(".card").forEach((card: any) => {

            card.addEventListener("mouseenter", () => {
                gsap.to(card, {
                    y: -6,
                    scale: 1.02,
                    duration: 0.2,
                    ease: "power2.out"
                })
            })

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.2
                })
            })

        })
    });




    return (
        <section className='box w-full bg-slate-800/30 min-w-screen p-6 flex flex-col gap-4 justify-center items-center mt-9 grow'>
            <aside className="flex flex-col gap-4">
                <h3 className='font-bold text-4xl text-white text-center pt-8'>Potencia tu flujo de trabajo</h3>
                <p className='max-w-2xl mx-auto text-sm md:text-lg text-center text-gray-500 leading-relaxed'>Todo lo que necesitas para transcribir audios profesionalmente.</p>
            </aside>
            <aside className='w-full p-0 py-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-6  md:p-10 lg:p-14'>
                <div className=' p-8 w-full md:w-auto lg:w-auto rounded-custom flex flex-col justify-start items-center bg-[#111827] border border-solid border-[#1f2937] rounded-md'>
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-start self-start mb-6 bg-[#0d59f2]/20 text-[#0d59f2] group-hover:bg-[#0d59f2] group-hover:text-white transition-colors">
                        <svg className="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </div>
                    <div className="w-full">
                        <h4 className='text-xl font-bold mb-3'>Transcripción automática con IA</h4>
                        <p className='text-gray-400 text-sm leading-relaxed'>Convierte cualquier vídeo de YouTube o archivo de audio/vídeo de tu dispositivo en texto en segundos usando Whisper de OpenAI.</p>
                    </div>
                </div>
                <div className='card p-8 md:w-auto lg:w-auto rounded-custom flex flex-col justify-start items-center bg-[#111827] border border-solid border-[#1f2937] rounded-md'>
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-start self-start mb-6 bg-[#0d59f2]/20 text-[#0d59f2] group-hover:bg-[#0d59f2] group-hover:text-white transition-colors">
                        <svg className="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.39 7.313 15.5 3 15.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </div>
                    <div className="w-full">
                        <h4 className='text-xl font-bold mb-3'>Traducción multiidioma instantánea</h4>
                        <p className='text-gray-400 text-sm leading-relaxed'>Traduce el contenido transcrito a español, inglés, francés e italiano en el mismo flujo, sin pasos extra.</p>
                    </div>
                </div>

                <div className='card p-8 md:w-auto lg:w-auto rounded-custom flex flex-col justify-start items-center bg-[#111827] border border-solid border-[#1f2937] rounded-md'>
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-start self-start mb-6 bg-[#0d59f2]/20 text-[#0d59f2] group-hover:bg-[#0d59f2] group-hover:text-white transition-colors">
                        <svg className="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM13 3v6h6" />
                        </svg>
                    </div>
                    <div className="w-full">
                        <h4 className='text-xl font-bold mb-3'>Exporta/Descarga tu contenido</h4>
                        <p className='text-gray-400 text-sm leading-relaxed'>Descarga y comparte tus documentos en segundos.</p>
                    </div>
                </div>

                <div className='card p-8 md:w-auto lg:w-auto rounded-custom flex flex-col justify-start items-center bg-[#111827] border border-solid border-[#1f2937] rounded-md'>
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-start self-start mb-6 bg-[#0d59f2]/20 text-[#0d59f2] group-hover:bg-[#0d59f2] group-hover:text-white transition-colors">
                        <svg className="w-6 h-6 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    </div>
                    <div className="w-full">
                        <h4 className='text-xl font-bold mb-3'>Guarda y gestiona tu historial</h4>
                        <p className='text-gray-400 text-sm leading-relaxed'>Almacena tus transcripciones y traducciones para acceder a ellas cuando quieras.</p>
                    </div>
                </div>
            </aside>
        </section>
    )
}

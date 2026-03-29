

export default function HowItWorks() {
    return (
        <section className="w-full min-w-full p-6 flex flex-col justify-center items-center grow gap-8 md:gap-6 lg:gap-4">
            <aside className="flex max-w-4/5 flex-col justify-center items-center gap-4 mb-10 md:mb-2 lg:mb-0">
                <h4 className="text-3xl font-bold text-white">¿Cómo funciona?</h4>
                <p className="text-sm md:text-lg text-gray-500 leading-relaxed">3 pasos para una transcripción eficiente de tus audios.</p>
            </aside>
            <aside className="flex p-4 gap-12 flex-col lg:flex-row justify-center items-start">
                <div className="max-w-lg text-center">
                    <div className="w-24 h-24 rounded-full bg-[#0a0e17] border-4 border-[#0d59f2]/40 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-primary/20">
                        <span className="text-3xl font-black">1</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Sube tu archivo/Copia tu enlace de Youtube</h4>
                    <p className="text-gray-400 text-sm">Arrastra y suelta MP4, MP3, WAV o M4A directamente en el panel o introduce cualquier link de youtube.</p>
                    
                </div>

                <div className="max-w-lg text-center">
                    <div className="w-24 h-24 rounded-full bg-[#0a0e17] border-4 border-[#0d59f2]/40 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-primary/20">
                        <span className="text-3xl font-black">2</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Procesamiento IA</h4>
                    <p className="text-gray-400 text-sm">Whisper v3 analiza el audio, Gpt-4 corrige y mejora semánticamente el resultado.</p>
                </div>

                <div className="max-w-lg text-center">
                    <div className="w-24 h-24 rounded-full bg-[#0a0e17] border-4 border-[#0d59f2]/40 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-primary/20">
                        <span className="text-3xl font-black">3</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Edita y Exporta</h4>
                    <p className="text-gray-400 text-sm">Revisa el texto, traduce si es necesario y guárdalo en línea o descárgalo en diferentes formatos (PDF, SRT, VTT, TXT...).</p>
                </div>

            </aside>
        </section>
    )
}

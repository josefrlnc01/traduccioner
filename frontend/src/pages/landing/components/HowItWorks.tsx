

export default function HowItWorks() {
    return (
        <section className="w-full min-w-full p-6 flex flex-col justify-center items-center grow gap-8 md:gap-6 lg:gap-4">
            <aside className="flex flex-col gap-4 mb-10 md:mb-2 lg:mb-0">
                <h4 className="text-3xl text-center font-bold text-white">¿Cómo funciona?</h4>
                <p className="max-w-2xl mx-auto text-sm md:text-lg text-gray-500 text-center leading-relaxed">3 pasos para una transcripción eficiente de tus audios.</p>
            </aside>
            <aside className="relative flex p-0 md:p-10 lg:p-14 gap-20 flex-col lg:flex-row justify-between items-startr">
                <div className="hidden lg:block absolute top-26 left-0 md:w-full h-0.5 bg-linear-to-r from-[#0d59f2]/10 via-[#0d59f2]/40 to-[#0d59f2]/10 -z-10"></div>
                <div className="flex-1 text-center">
                    <div className="w-24 h-24 rounded-full bg-[#0a0e17] border-4 border-[#0d59f2]/40 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-primary/20">
                        <span className="text-3xl font-black">1</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Sube tu archivo/Copia tu enlace de Youtube</h4>
                    <p className="text-gray-400 text-sm px-4">Arrastra y suelta MP4, MP3, WAV o M4A directamente en el panel o introduce cualquier link de youtube.</p>
                    
                </div>

                <div className="flex-1 text-center">
                    <div className="w-24 h-24 rounded-full bg-[#0a0e17] border-4 border-[#0d59f2]/40 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-primary/20">
                        <span className="text-3xl font-black">2</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Procesamiento IA</h4>
                    <p className="text-gray-400 text-sm px-4">Whisper v3 analiza el audio, Gpt-4 corrige y mejora semánticamente el resultado.</p>
                </div>

                <div className="flex-1 text-center">
                    <div className="w-24 h-24 rounded-full bg-[#0a0e17] border-4 border-[#0d59f2]/40 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-primary/20">
                        <span className="text-3xl font-black">3</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Trabaja con tus documentos</h4>
                    <p className="text-gray-400 text-sm px-4">Visualiza tu resultado y exportalo, tradúcelo o genera un resumen sobre ello. Cada transcripción es guardada automáticamente para poder acceder a ella en cualquier momento.</p>
                </div>

            </aside>
        </section>
    )
}

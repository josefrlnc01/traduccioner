
export default function Pricing() {
    return (
        <section className='bg-slate-800/30 w-screen min-w-screen p-6 flex flex-col justify-center items-center grow gap-4'>
            <aside>
                <h3 className='text-3xl text-white font-bold text-center'>Planes diseñados a medida</h3>
                <p className='max-w-2xl mx-auto text-sm md:text-lg text-gray-500 text-center leading-relaxed'>Escoge lo que mejor se adapte a tus necesidades.</p>
            </aside>
            <aside className='grid grid-cols-1 md:grid-cols-2 gap-8 w-3/4 max-w-3/4 m-auto p-14'>
                <div className="p-8 rounded-custom bg-slate-800/40 flex flex-col h-full border-2 border-solid border-transparent rounded-md hover:scale-105 hover:border-[#0d59f2] transition-all">
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Básico</h3>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-extrabold">$0</span>
                            <span className="text-gray-400 ml-1">/mes</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8 grow">
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                            6 mins gratis/mes
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                            Solo YouTube (sin subida de archivos propios)
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                            Solo exportaciones en formato PDF
                        </li>
                    </ul>
                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-bold transition-all">Empezar ya</button>
                </div>
            </aside>
        </section>
    )
}

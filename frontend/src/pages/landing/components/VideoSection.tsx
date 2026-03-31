import video from '@/assets/presentation.webm'
import poster from '@/assets/poster.webp'
export default function VideoSection() {

    return (
        <section className='w-full min-w-screen px-6 py-20 flex flex-col justify-center items-center'>
            <aside className='w-full max-w-7xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>

                {/* Texto izquierda */}
                <div className='flex-1 flex flex-col gap-6'>
                    <span className='text-xs font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full w-fit'>
                        Interfaz diseñada para profesionales
                    </span>
                    <h3 className='font-bold text-3xl lg:text-4xl text-white leading-tight'>
                        Una experiencia de transcripción{' '}
                        <span className='text-blue-500'>limpia y sin distracciones</span>
                    </h3>
                    <p className='text-slate-400 text-lg leading-relaxed'>
                        Cada detalle ha sido pensado para que puedas centrarte en lo que importa: tu contenido. Timestamps precisos, traducción integrada y exportación en múltiples formatos.
                    </p>
                    <ul className='flex flex-col gap-3'>
                        {[
                            'Timestamps por segmento con Whisper',
                            'Traducción a 133 idiomas en un click',
                            'Exporta en PDF, SRT, VTT, DOCX y más'
                        ].map((item) => (
                            <li key={item} className='flex items-center gap-3 text-sm text-slate-300'>
                                <svg className='w-4 h-4 text-blue-500 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Video derecha */}
                <div className='flex-1 w-full relative'>
                    {/* glow detrás del video */}
                    <div className='absolute inset-0 bg-blue-600/20 blur-3xl rounded-3xl -z-10' />
                    <video
                        poster={poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload='none'
                        className='w-full rounded-2xl shadow-2xl border border-slate-700/50'
                        src={video}
                    />
                </div>

            </aside>
        </section>
    )
}

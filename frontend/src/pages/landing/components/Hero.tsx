import { useNavigate } from "react-router"


export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className='relative  w-screen min-w-screen flex flex-col p-8 justify-center items-center gap-8 grow'>
      <div className="absolute overflow-hidden top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0d59f2]/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>
      <aside className="w-full md:w-3/4 lg:w-2/4 flex flex-col justify-center gap-2 items-center mb-4">
        <div className="flex justify-center items-center bg-[#0d59f2]/10 border border-solid border-[#0d59f2]/20 gap-2 px-3 py-1 rounded-full text-xs font-bold text-blue-700/90">
          <span className="flex h-2 w-2 rounded-full bg-[#0d59f2]"></span>
          Impulsado por Whisper v1
        </div>
        <h2 className='text-4xl text-center lg:text-7xl text-white font-bold tracking-tight mb-6'>Convierte audios y vídeos en texto con <strong className='text-blue-600/80 text-center'>precisión</strong></h2>
        <p className='max-w-2xl mx-auto text-lg md:text-xl text-center text-gray-400 mb-10 leading-relaxed'>Sube tu archivo y obtén resultados en cuestión de minutos. Soporte de múltiples idiomas, traducción automática.</p>
        <button
          onClick={() => navigate('/auth/register')}
          className='pt-2 pb-2 pr-4 pl-4 bg-blue-600 cursor-pointer hover:bg-blue-700 rounded-xl font-bold text-lg shadow-xl transition-colors duration-200 ease-in'>
          Empieza gratis
        </button>
      </aside>
      <aside className="w-full h-64">
        <div className="w-full md:w-3/4 lg:w-2/4 h-64 m-auto  bg-slate-800/20 rounded-md">
          <div className="bg-brand-card/50 h-full rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="flex items-center gap-1 h-32">
              <div className="w-2 bg-brand-primary rounded-full animate-[bounce_1.2s_infinite]"></div>
              <div className="w-2 h-16 bg-[#0d59f2]/80  rounded-full animate-[bounce_1.5s_infinite]"></div>
              <div className="w-2 h-24 bg-[#0d59f2]/60 rounded-full animate-[bounce_1.8s_infinite]"></div>
              <div className="w-2 h-12 bg-[#0d59f2]/40 rounded-full animate-[bounce_1.8s_infinite]"></div>
              <div className="w-2 h-32 bg-[#0d59f2]  rounded-full animate-[bounce_1.3s_infinite]"></div>
              <div className="w-2 h-20 bg-[#0d59f2]/70 rounded-full animate-[bounce_1.6s_infinite]"></div>
              <div className="w-2 h-28 bg-[#0d59f2]/50 rounded-full animate-[bounce_1.1s_infinite]"></div>
              <div className="w-2 h-10 bg-[#0d59f2]/30 rounded-full animate-[bounce_1.4s_infinite]"></div>
              <div className="w-2 h-24 bg-[#0d59f2]/90 rounded-full animate-[bounce_1.7s_infinite]"></div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  )
}

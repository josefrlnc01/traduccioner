import { useNavigate } from "react-router"


export default function Hero() {
    const navigate = useNavigate()
  return (
    <section className='w-screen min-w-screen flex flex-col justify-center items-center gap-8'>
        <aside className="w-full flex flex-col justify-center gap-4 items-center">
            <div className="flex justify-center items-center bg-[#0d59f2]/10 border border-solid border-[#0d59f2]/20 gap-2 px-3 py-1 rounded-full text-xs font-bold text-blue-700/90">
            <span className="flex h-2 w-2 rounded-full bg-[#0d59f2]"></span>
            Impulsado por Whisper v3
            </div>
            <h2 className='text-7xl text-white font-bold tracking-tight mb-6'>Convierte audios y vídeos en texto con <strong className='text-blue-600/80 text-center'>precisión</strong></h2>
            <p className='max-w-2xl mx-auto text-lg md:text-xl text-center text-gray-400 mb-10 leading-relaxed'>Sube tu archivo y obtén resultados en cuestión de minutos. Soporte de múltiples idiomas, traducción automática.</p>
            <button
            onClick={() => navigate('/auth/register')} 
            className='pt-2 pb-2 pr-4 pl-4 bg-[#0d59f2] cursor-pointer hover:bg-blue-600 rounded-xl font-bold text-lg shadow-xl transition-colors'>
            Empieza gratis
            </button>
        </aside>
        <aside className="w-full">
            <div className="w-2/4 h-64 m-auto  bg-slate-800/20 rounded-md">

            </div>
        </aside>
    </section>
  )
}

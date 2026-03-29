
import { Link, Outlet, useNavigate } from 'react-router'
import { ToastContainer } from 'react-toastify'

export default function LegalLayout() {
    const navigate = useNavigate()
  return (
     <main className='min-h-screen bg-[#0a0e17] text-white flex flex-col'>
            
            <header className='w-full border-b border-slate-800/60 px-6 py-4 shrink-0'>
                <div className='max-w-5xl mx-auto flex items-center justify-between'>
                    <Link to='/landing-page' className='font-bold text-xl'>
                        Aud<span className='text-blue-500'>Wave</span>
                    </Link>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer'
                    >
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18'/>
                        </svg>
                        Volver
                    </button>
                </div>
            </header>

            <section className='flex-1'>
                <Outlet />
            </section>

            <footer className='border-t border-slate-800/60 px-6 py-6 shrink-0'>
                <div className='max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500'>
                    <span>©2026 AudWave</span>
                    <div className='flex items-center gap-6'>
                        <Link to='/support' className='hover:text-white transition-colors'>Soporte</Link>
                        <Link to='/privacy' className='hover:text-white transition-colors'>Privacidad</Link>
                    </div>
                </div>
            </footer>

            <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false}/>
        </main>
  )
}

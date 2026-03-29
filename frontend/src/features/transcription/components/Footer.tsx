import { useTheme } from "@/shared/context/ThemeContext"
import { Link } from 'react-router'

export default function Footer() {
  const { theme } = useTheme()
  return (
    <footer className={`${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-400/40 text-slate-900'} grow-0 w-full px-8 py-4 md:py-8 border-t border-slate-800`}>
      <div className='max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500'>
        <div className='grow-0'>
          <h2 className='text-lg font-bold self-start'><span>Aud</span><span className="text-blue-500">Wave</span></h2>
        </div>
        <div className='flex items-center gap-6'>
          <Link to='/support' className='hover:text-white transition-colors'>Soporte</Link>
          <Link to='/privacy' className='hover:text-white transition-colors'>Privacidad</Link>
          <Link to='/dashboard' className='hover:text-white transition-colors'>Inicio</Link>
        </div>
      </div>
    </footer>
  )
}

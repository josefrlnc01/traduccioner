import { useTheme } from "@/shared/context/ThemeContext"
import { Link } from 'react-router'

export default function Footer() {
  const { theme } = useTheme()
  return (
    <footer className={`${theme === 'dark' ? 'bg-slate-950 border-slate-800/90' : 'bg-white  text-slate-900 border-slate-200'} grow-0 w-full px-8 py-4 md:py-8 border-t `}>
      <div className='max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500'>
        <div className='grow-0'>
          <h2 className='text-lg font-bold self-start'><span>Aud</span><span className="text-blue-500">Wave</span></h2>
        </div>
        <div className='flex items-center gap-6'>
          <Link to='/support' className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-blue-500'} transition-colors ease`}>Soporte</Link>
          <Link to='/privacy'className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-blue-500'} transition-colors ease`}>Privacidad</Link>
          <Link to='/dashboard' className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-blue-500'} transition-colors ease`}>Inicio</Link>
        </div>
      </div>
    </footer>
  )
}

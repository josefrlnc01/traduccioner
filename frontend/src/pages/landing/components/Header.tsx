import { useNavigate } from 'react-router'
export default function Header() {
  const navigate = useNavigate()

  return (
    <header className='w-full bg-slate-950 border-b border-slate-800/60 px-6 py-4 shrink-0'>
      <div className='max-w-5xl mx-auto flex items-center justify-between'>
        <h1 className="font-bold text-4xl text-white">Aud<span className="text-blue-600/80">Wave</span></h1>
        <div className=' flex justify-start'>
          <button
            onClick={() => navigate('/auth/login')}
            className='pt-2 pb-2 pr-4 pl-4 bg-blue-600 cursor-pointer hover:bg-blue-700 rounded-xl font-bold text-lg shadow-xl transition-colors duration-200 ease-in'
          >Iniciar sesión</button>
        </div>
      </div>
    </header>

  )
}

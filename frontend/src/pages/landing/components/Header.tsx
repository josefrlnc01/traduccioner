import {  useNavigate } from 'react-router'
export default function Header() {
  const navigate = useNavigate()

  return (
    <header className='w-full min-w-full p-4 border-b border-slate-800 grow-0'>
      <div className='w-full flex justify-between items-center px-6'>
        <h1 className='font-bold text-xl'>AudWave</h1>
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

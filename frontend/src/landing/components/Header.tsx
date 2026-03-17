import React from 'react'

export default function Header() {
  return (
    <header className='w-screen text-center flex justify-between items-center p-4 border-b border-slate-800'>
      <h1 className='font-bold text-xl'>Transcriber AI</h1>
        <div className=' flex justify-start'>
          <button
          className='pt-2 pb-2 pr-4 pl-4 bg-blue-600 rounded-md font-semibold cursor-pointer hover:bg-blue-600/70 transition-colors'
          >Iniciar sesión</button>
        </div>
    </header>
  )
}

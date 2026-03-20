

export default function Footer() {
  return (
    <footer className='w-screen min-w-screen pl-4 pr-4 pt-4 md:pt-8 pb-4 md:pb-8 bg-transparent flex flex-col md:flex-row justify-between gap-8 md:gap-4 border-t border-slate-800'>
        <h3 className='text-lg text-gray-300'>Transcriber AI</h3>
        <nav  className='flex flex-col md:flex-row justify-between gap-2 md:gap-10 font-semibold'>
            <a className='text-gray-400/50'>Contacto</a>
            <a className='text-gray-400/50'>Términos</a>
            <a className='text-gray-400/50'>Soporte</a>
        </nav>
        <small className='text-gray-400/70 text-end'> ©2026  Transcriber AI. Transcribe videos y audios. </small>
    </footer>
  )
}



export default function Footer() {
    return (
        <footer className='w-screen  border-b border-slate-800 grow-0'>
            <aside className='w-screen pt-5 pb-7 pr-14 pl-14 flex flex-col gap-8'>
                <div className='w-full flex flex-wrap justify-between gap-8 text-sm text-gray-400'>
                    <div className='grow-0'>
                        <h2 className='text-lg font-bold self-start'>Transcriber AI</h2>
                    </div>
                    <div>
                        <nav className='flex gap-2 text-md'>
                            <a className='hover:text-white transition-colors' href=''>Términos</a>
                            <a className='hover:text-white transition-colors' href=''>Soporte</a>
                            <a className='hover:text-white transition-colors' href=''>Privacidad</a>
                            <a className='hover:text-white transition-colors' href=''>Contacto</a>
                        </nav>
                    </div>

                </div>
                <div className='border border-s border-gray-900/90 w-full'></div>
                <div className='w-full flex flex-wrap justify-between gap-8 text-sm text-gray-400'>
                    <small className='text-gray-400'> ©2026  Transcriber AI. Transcribe videos y audios. </small>
                    <span>Desarrollado por José María Sánchez Serna</span>
                </div>
            </aside>

        </footer>
    )
}

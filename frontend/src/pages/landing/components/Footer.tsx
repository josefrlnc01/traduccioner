import { Link } from "react-router";


export default function Footer() {
    return (
        <footer className='bg-slate-950 border-t border-slate-800/60 px-6 py-6 shrink-0 '>
                <div className='max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500'>
                    <div className='grow-0'>
                        <h2 className='text-lg font-bold self-start'><span>Aud</span><span className="text-blue-500">Wave</span></h2>
                    </div>
                    <div className='flex items-center gap-6'>
                        <Link to='/support' className='hover:text-white transition-colors'>Soporte</Link>
                        <Link to='/privacy' className='hover:text-white transition-colors'>Privacidad</Link>
                    </div>
                </div>
            </footer>
    )
}

import React from 'react'

export type SummaryProps = {
    summary: string
}

export default function Summary({summary} : SummaryProps) {

    const text = summary.split('. ').map((s:string )=> s)
    return (
        <aside className='h-auto 
                    min-h-auto
                    w-full
                    md:w-3/4
                    lg:w-2/4 
                    flex 
                    flex-col  
                    bg-slate-900/60
                    rounded-xl
                    border-b

                    border-slate-800/90
                    backdrop-blur
                    shadow-xl'>
            <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                    Resumen
                </h2>
                
            </header>

            <div className='w-full min-w-full flex flex-col gap-2 bg-[#101622] p-6'>
        {text.map(s => (
                        <p key={s}>{s}</p>
                    ))}
            </div>

        </aside>
    )
}

import { tokenStore } from '@/lib/token.store'
import { isAxiosError } from 'axios'
import React, { useState } from 'react'
import { motion } from 'motion/react'
export type SummaryProps = {
    summary: string,
    isLoading: boolean
}

export default function SummarySection({ summary, isLoading }: SummaryProps) {


    return (
        <aside className='h-auto min-h-auto w-full md:w-3/4 lg:w-2/4 flex flex-col bg-slate-900/60 rounded-xl border border-slate-800/50 backdrop-blur shadow-xl overflow-hidden'>

            <header className='flex justify-between items-center w-full px-5 py-4 bg-linear-to-r from-slate-800/80 to-slate-700/40 border-b border-slate-700/50'>
                <div className='flex items-center gap-3'>
                    {/* icono IA */}
                    <div className='w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0'>
                        <svg className='w-4 h-4 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                        </svg>
                    </div>
                    <div>
                        <h2 className='text-sm font-semibold text-gray-100 leading-tight'>Resumen IA</h2>
                        <p className='text-xs text-slate-500'>Generado por GPT-4o</p>
                    </div>
                </div>
                {/* badge estado */}
                {isLoading && (
                    <span className='flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full'>
                        <span className='w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse' />
                        Generando
                    </span>
                )}
                {summary && !isLoading && (
                    <span className='flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full'>
                        <span className='w-1.5 h-1.5 rounded-full bg-green-400' />
                        Completado
                    </span>
                )}
            </header>

            <div className='w-full flex flex-col gap-3 bg-[#0d1117] p-6'>
                {!summary && !isLoading && (
                    <p className='text-slate-600 text-sm text-center py-4'>
                        Pulsa el botón para generar un resumen del contenido
                    </p>
                )}
                {summary && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className='relative p-5 bg-slate-800/40 rounded-xl border border-slate-700/50'
                    >
                        {/* línea decorativa lateral */}
                        <div className='absolute left-0 top-4 bottom-4 w-0.5 bg-blue-500/50 rounded-full' />
                        <p className='text-slate-300 leading-relaxed text-sm pl-3'>
                            {summary}
                            {isLoading && (
                                <span className='inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse align-middle' />
                            )}
                        </p>
                    </motion.div>
                )}
            </div>

        </aside>
    )
}

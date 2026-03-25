import { tokenStore } from '@/lib/token.store'
import { isAxiosError } from 'axios'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useSummary } from '../hooks/useSummary'
export type SummaryProps = {
    summary: string,
    isLoading: boolean,
    handleGenerateIaSummary: () => Promise<void>
}

export default function SummarySection({ summary, isLoading, handleGenerateIaSummary }: SummaryProps) {
    console.log(isLoading)

    return (
        <div className='flex flex-col w-full lg:w-72 shrink-0'>
            <div className='px-5 py-3 border-b border-slate-700/30 flex items-center justify-between'>
                <div>
                    <h3 className='text-xs font-semibold text-slate-400 uppercase tracking-widest'>Resumen IA</h3>
                    <p className='text-xs text-slate-600 mt-0.5'>Generado por GPT-4o</p>
                </div>
                <div className='w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center'>
                    <svg className='w-3.5 h-3.5 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                    </svg>
                </div>
            </div>

            <div className='flex-1 p-5 flex flex-col gap-4 overflow-y-scroll max-h-4/5'>
                <button
                    onClick={handleGenerateIaSummary}
                    disabled={isLoading}
                    className='w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer'
                >
                    {isLoading ? 'Generando...' : 'Generar Resumen'}
                </button>

                {!summary && !isLoading && (
                    <p className='text-slate-600 text-xs text-center leading-relaxed'>
                        Pulsa el botón para generar un resumen del contenido
                    </p>
                )}

                {(summary || isLoading) && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='border-l-2 border-blue-500/40 pl-3'
                    >
                        <p className='text-slate-300 text-sm leading-relaxed'>
                            {summary}
                            {isLoading && (
                                <span className='inline-block w-0.5 h-3.5 bg-blue-400 ml-0.5 animate-pulse align-middle' />
                            )}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

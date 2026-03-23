import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { getSaved } from '../api/savedsApi'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router'
import Header from '../components/Header'
import { formatTime } from '@/shared/utils/minutes'
import Footer from '../components/Footer'
import { generatePDF, generateSRT } from '@/features/document/api/documentApi'
import { DropdownMenuBasic } from '@/components/ui/DropdownMenuBasic'

export default function SavedsView() {
    const params = useParams()

    const id = params.id
    console.log(id)
    const { data, error } = useQuery({
        queryKey: ['saveds', id],
        queryFn: () => getSaved(id!),
        enabled: !!id
    })

    const generatePdf = useMutation({
        mutationFn: generatePDF,
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const generateSrt = useMutation({
        mutationFn: generateSRT,
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleGenerateTranscriptionPdf = (text: string) => {
        generatePdf.mutate(text)
    }

    const handleGenerateTranscriptionSrt = (segments: { start: number, end: number, text: string }[]) => {
        generateSrt.mutate(segments)
    }



    if (error) {
        return (
            <aside className="p-4 text-red-400 md:text-center">
                {error.message}
            </aside>
        )
    }

    if (data) {
        const formattedFileText = data[0].segments.map((s: { start: number, end: number, text: string }) => {
            return `[${s.start}:${s.end}] ${s.text}`
        }).join('\n')
        return (
            <>
                <Header />
                <section className='w-full min-h-screen flex flex-col items-center justify-center py-12 md:py-20'>
                    <aside className='w-[90%] md:w-2/3 lg:w-1/2 mx-auto flex flex-col rounded-2xl bg-[#ffffff08] shadow-2xl'>
                        <header className='flex justify-between items-center w-full rounded-t-2xl p-4 bg-slate-700/40  border-b border-slate-800'>
                            <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                {data[0].title}<span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                            </h2>
                            <div className='flex justify-center items-center gap-4'>

                                <DropdownMenuBasic id={data[0].fileId} />
                                <Link className='bg-red-500 pt-2 pb-2 pl-4 pr-4 rounded-xl hover:bg-red-500/80 transition-colors ease duration-200 ' to={`/`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </Link>
                            </div>

                        </header>
                        <div className='grow bg-slate-800/40 p-8'>
                            {data[0].segments.map((s: { start: number, end: number, text: string }) => (
                                <p key={s.start} className='text-start wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                    <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.end.toFixed()))}</span> {s.text}
                                </p>
                            ))}
                        </div>
                        <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] rounded-b-2xl p-3'>
                            <button
                                onClick={() => handleGenerateTranscriptionPdf(formattedFileText)}
                                className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>PDF</button>
                            <button
                                onClick={() => handleGenerateTranscriptionSrt(data[0].segments)}
                                className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>SRT</button>
                        </div>

                    </aside>
                </section>
                <Footer />
            </>
        )
    }

}

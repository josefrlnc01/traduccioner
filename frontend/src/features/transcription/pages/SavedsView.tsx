import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { generateIaSummary, getSaved } from '../api/savedsApi'
import { toast } from 'react-toastify'
import { Link, useParams } from 'react-router'
import Header from '../components/Header'
import { formatTime } from '@/shared/utils/minutes'
import Footer from '../components/Footer'
import { generatePDF, generateSRT } from '@/features/document/api/documentApi'
import { DropdownMenuBasic } from '@/components/ui/DropdownMenuBasic'
import EditFileDialog from '../components/EditFileDialog'
import { motion } from 'motion/react'
import Summary from '../components/SummarySection'
import SummarySection from '../components/SummarySection'
import { isAxiosError } from 'axios'
import { tokenStore } from '@/lib/token.store'



export default function SavedsView() {
    const params = useParams()
    const [isOpen, setIsOpen] = useState(false)
    const [isReadySummary, setIsReadySummary] = useState(false)
    const [summary, setSummary] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const id = params.id
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

    
    
    const handleGenerateIaSummary = async () => {
        const urlBackend = import.meta.env.VITE_API_URL
        const accessToken = tokenStore.get()
        setIsLoading(true)
        setSummary('')
        try {
            const response = await fetch(`${urlBackend}/saveds/${id}/summary`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
            )

            const reader = response.body!.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()

                if (done) break


                const chunk = decoder.decode(value)
                const lines = chunk.split('\n\n').filter(Boolean)

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.replace('data: ', '')

                        if (data === '[DONE]') return
                        const { text } = JSON.parse(data)
                        setSummary(prev => prev + text)
                    }
                }
            }


            setIsLoading(false)

        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error)
            }
        }
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
                {isOpen && <EditFileDialog isOpen={isOpen} setIsOpen={setIsOpen} id={id!} />}
                <Header />
                <section className='w-full min-h-screen flex flex-col items-center justify-center py-12 md:py-20'>
                    <motion.aside
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className='w-[90%] md:w-2/3 lg:w-1/2 mx-auto flex flex-col rounded-2xl bg-[#ffffff08] shadow-2xl'>
                        <header className='flex justify-between items-center w-full rounded-t-2xl p-4 bg-slate-700/40  border-b border-slate-800'>
                            <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                {data[0].title}<span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                            </h2>
                            <div className='flex justify-center items-center gap-4'>

                                <DropdownMenuBasic id={data[0].fileId} setIsOpen={setIsOpen} />
                                <Link className='bg-red-500 pt-2 pb-2 pl-4 pr-4 rounded-xl hover:bg-red-500/80 transition-colors ease duration-200 ' to={`/`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </Link>
                            </div>

                        </header>
                        <motion.div
                            className='grow bg-slate-800/40 p-8'>
                            {data[0].segments.map((s: { start: number, end: number, text: string }) => (
                                <motion.p
                                    whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                    transition={{ duration: 0.15 }}
                                    key={s.start}
                                    className='text-start wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                    <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.end.toFixed()))}</span> {s.text}
                                </motion.p>
                            ))}
                        </motion.div>
                        <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] rounded-b-2xl p-3'>
                            <button
                                onClick={() => handleGenerateTranscriptionPdf(formattedFileText)}
                                className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>PDF</button>
                            <button
                                onClick={() => handleGenerateTranscriptionSrt(data[0].segments)}
                                className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>SRT</button>
                                <button
                                onClick={handleGenerateIaSummary}
                                className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>Resumen</button>
                        </div>

                    </motion.aside>
                    {<SummarySection summary={summary} isLoading={isLoading}/>}
                </section>
                <Footer />
            </>
        )
    }

}

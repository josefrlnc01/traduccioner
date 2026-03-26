import { DropdownMenuBasic } from '@/components/DropdownMenuBasic'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { container, item } from '../stores/motion'
import { formatTime } from '@/shared/utils/minutes'
import { useMutation } from '@tanstack/react-query'
import { generatePDF, generateSRT } from '@/features/document/api/documentApi'
import { toast } from 'react-toastify'
import { useSummary } from '../hooks/useSummary'
import SummarySection from './SummarySection'
import { useTranslate } from '@/features/translation/hooks/useTranslate'
import { Spinner } from '@/components/ui/spinner'
import { freeUserLanguages, languages } from '../stores/languages'
import flecha from './../../../assets/apunta-hacia-abajo.webp'
import type { User } from '../types/user.types'
import { useDocumentAction } from '../hooks/useDocumentAction'

export type SavedFile = {
    duration: string
    fileId: string
    segments: {
        start: number,
        end: number,
        text: string
    }[],
    title: string
    user: string,
    origin: string,
    __v: number
    _id: string
}

type SavedFileProps = {
    data: SavedFile
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    user: User
    id: string
}


export default function SavedFile({ data, setIsOpen, user, id }: SavedFileProps) {
    console.log(user)
    const navigate = useNavigate()
    const { summary, isLoading, handleGenerateIaSummary } = useSummary()
    const { translation, youtubeTranslation, generateFileTranslation, generateYoutubeTranslation, isTranslating, selectedLang, setSelectedLang, setLang, lang } = useTranslate()
    const { generatePdf,
        generateSrt,
        generateTxt,
        generateVtt,
        generateDocX,
        generateJson,
        generateCsv } = useDocumentAction()

    const handleGenerateTranscriptionPdf = (text: string) => {
        generatePdf.mutate(text)
    }

    const handleGenerateTranscriptionSrt = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateSrt.mutate(formData)
    }

    const handleGenerateTranscriptionTxt = (segments: { start: number, end: number, text: string }[]) => {
        generateTxt.mutate(segments)
    }

    const handleGenerateTranscriptionVtt = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateVtt.mutate(formData)
    }

    const handleGenerateTranscriptionDocX = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateDocX.mutate(formData)
    }

    const handleGenerateTranscriptionJson = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateJson.mutate(formData)
    }

    const handleGenerateTranscriptionCsv =  (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateCsv.mutate(formData)
    }

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLang(true)
        setLang(e.target.value)
    }

    const handleTranslate = () => {
        if (data.origin === 'file') {
            const formData = {
                lang,
                fileText: data.segments
            }
            generateFileTranslation.mutate(formData)
        } else {
            const formData = {
                lang,
                youtubeVideoText: data.segments
            }
            generateYoutubeTranslation.mutate(formData)
        }
    }

    console.log(translation)

    const formattedFileText = data.segments.map(s => `${formatTime(Number(s.start.toFixed(2)))}:${formatTime(Number(s.end.toFixed(2)))} ${s.text}`).join('\n')

    return (
        <aside className='w-full md:w-3/4 lg:w-2/4 md:min-w-3/4 lg:min-w-2/4 h-96 min-h-96 max-h-96 md:h-3/4 md:max-h-3/4 flex flex-col items-center bg-slate-900/60 rounded-xl border border-slate-800/50 backdrop-blur shadow-xl overflow-hidden'>

            <header className='flex items-center w-full pr-3 pl-5 py-3.5 bg-slate-800/60 border-b border-slate-700/50'>
                <div className='grow-0 flex items-center gap-4'>
                    <h2 className='text-sm font-semibold text-gray-100 truncate'>
                        {data.title}
                        <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                    </h2>

                </div>
                <div className='flex grow items-center justify-end gap-2'>
                    
                    <DropdownMenuBasic id={data.fileId} setIsOpen={setIsOpen} mutation={null} data={data} />

                    <button onClick={() => navigate('/')} className='p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className='flex flex-col lg:flex-row flex-1 min-h-0'>

                <div className='flex flex-col flex-1 border-r border-slate-700/50'>
                    <div className='px-5 py-3 border-b border-slate-700/30 flex items-center justify-between gap-4'>
                        <h3 className='text-xs font-semibold text-slate-400 uppercase tracking-widest'>Transcripción</h3>
                        <div className="flex items-center justify-center gap-2">
                            <div className='relative'>
                                <select
                                    onChange={handleSelect}
                                    className="bg-slate-800 text-slate-300 text-sm appearance-none px-3 py-1.5 pr-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                >

                                    {(user.suscription === 'business' || user.suscription === 'pro') && languages.map(lang => (
                                        <option key={lang.value} defaultValue={'Traducir a...'} value={lang.value}>{lang.label}</option>
                                    ))}
                                    {user.suscription === 'free' && freeUserLanguages.map(lang => (
                                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                                    ))}

                                </select>
                                <img className='w-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2' src={flecha} />

                            </div>


                            <button
                                onClick={handleTranslate}
                                disabled={!selectedLang || isTranslating}
                                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                {isTranslating ? (
                                    <>
                                        <Spinner className="size-3" />
                                        Traduciendo
                                    </>
                                ) : (
                                    'Traducir'
                                )}
                            </button>
                        </div>
                    </div>
                    <motion.div
                        className='grow bg-slate-800/40 p-8'
                        variants={container}
                        initial='hidden'
                        animate='show'>
                        {(translation.length === 0 && youtubeTranslation.length === 0) && data.segments.map((s, i) => (
                            <motion.p
                                key={i}
                                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                transition={{ duration: 0.15 }}
                                variants={item}
                                className='text-start wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.start.toFixed(2)))}:{formatTime(Number(s.end.toFixed(2)))}</span> {s.text}
                            </motion.p>
                        ))}
                        {translation.length > 0 && translation.map((s, i) => (
                            <motion.p
                                key={i}
                                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                transition={{ duration: 0.15 }}
                                variants={item}
                                className='text-start wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.start.toFixed(2)))}:{formatTime(Number(s.end.toFixed(2)))}</span> {s.text}
                            </motion.p>
                        ))}
                        {youtubeTranslation.length > 0 && youtubeTranslation.map((s, i) => (
                            <motion.p
                                key={i}
                                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                transition={{ duration: 0.15 }}
                                variants={item}
                                className='text-start wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.start.toFixed(2)))}:{formatTime(Number(s.end.toFixed(2)))}</span> {s.text}
                            </motion.p>
                        ))}
                    </motion.div>
                </div>

                {user.suscription === 'business' && <SummarySection summary={summary} isLoading={isLoading} handleGenerateIaSummary={() => handleGenerateIaSummary(id)} id={id} />}
            </div>
        </aside>
    )
}

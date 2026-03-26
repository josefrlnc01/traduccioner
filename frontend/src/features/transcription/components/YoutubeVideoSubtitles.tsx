import type { SubtitlesViewProps } from '../types/subtitles.types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import FileSubtitles from './FileSubtitles'
import { motion } from 'motion/react'
import { useState } from 'react'
import { translateYoutubeText } from '@/features/translation/translationApi'
import type { Translated } from '../types/translared.types'
import { freeUserLanguages, languages } from '../stores/languages'
import { Spinner } from '@/components/ui/spinner'
import { useDocumentAction } from '../hooks/useDocumentAction'
import { container, item } from '../stores/motion'
import { useTranslate } from '@/features/translation/hooks/useTranslate'
import { formatTime } from '@/shared/utils/minutes'
import { DropdownMenuBasic } from '@/components/DropdownMenuBasic'
import SummarySection from './SummarySection'
import { useSummary } from '../hooks/useSummary'
import { useEditFile } from '../hooks/useEditFIle'



export default function YoutubeVideoSubtitles({ mutation, inputValue, fileInputValue }: SubtitlesViewProps) {
    const [lang, setLang] = useState('')
    const [selectedLang, setSelectedLang] = useState(false)

    const { generatePdf, generateSrt, generateTxt, generateVtt } = useDocumentAction()
    const { youtubeTranslation, generateYoutubeTranslation, isTranslating, setIsTranslating } = useTranslate()
    const { summary, handleGenerateIaSummary, isLoading } = useSummary()
    const { setIsOpen } = useEditFile()

    if (mutation.isError) {
        return (
            <aside className="p-4 text-red-400 md:text-center">
                {mutation.error.message}
            </aside>
        )
    }

    if (!mutation.data) return null

    if (!("translatedYoutubeVideo" in mutation.data)) return <FileSubtitles
        mutation={mutation}
        inputValue={inputValue}
        fileInputValue={fileInputValue}
    />
    console.log(mutation.data)
    const youtubeVideoText = mutation.data.youtubeVideoText
    const user = mutation.data.user
    const handleGenerateTranscriptionPdf = (subtitles: string) => {
        generatePdf.mutate(subtitles)
    }

    const handleGenerateTranscriptionSrt = (segments: { start: number, end: number, text: string }[]) => {
        generateSrt.mutate(segments)
    }

    const handleGenerateTranscriptionTxt = (segments: { start: number, end: number, text: string }[]) => {
        generateTxt.mutate(segments)
    }

    const handleGenerateTranscriptionVtt = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: youtubeVideoText.title
        }
        generateVtt.mutate(formData)
    }

    const formattedYoutubeVideoText = youtubeVideoText
        .segments
        .map(s => `[${s.start}:${s.end}] ${s.text}`)
        .join('\n')


    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLang(true)
        setLang(e.target.value)
    }


    const handleTranslate = () => {
        console.log('handle translate')
        const formData = {
            lang,
            youtubeVideoText: youtubeVideoText.segments
        }
        generateYoutubeTranslation.mutate(formData)
        setIsTranslating(true)
    }

    console.log('is translating', isTranslating)


    return (
        <section className='w-screen flex flex-col lg:flex lg:max-w-3/4 lg:w-3/4  md:items-center rounded-xl'>


            <aside className='w-full md:w-3/4  h-96 min-h-96 max-h-96 md:h-3/4 md:max-h-3/4 flex flex-col bg-slate-900/60 rounded-xl border border-slate-800/50 backdrop-blur shadow-xl overflow-hidden'>

                <header className='flex justify-between items-center w-full px-5 py-3.5 bg-slate-800/60 border-b border-slate-700/50'>
                    <div className='grow-0 flex items-center gap-4'>
                        <h2 className='text-sm font-semibold text-gray-100 truncate max-w-xs'>
                            {youtubeVideoText.title}
                            <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                            <select
                                onChange={handleSelect}
                                className="bg-slate-800 text-slate-300 text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                            >
                                <option defaultValue={''} disabled>Traducir a...</option>
                                {(user.suscription === 'business' || user.suscription === 'pro') && languages.map(lang => (
                                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                                ))}
                                {user.suscription === 'free' && freeUserLanguages.map(lang => (
                                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                                ))}
                            </select>

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

                    <div className='flex items-center justify-end gap-2 grow'>
                        <button
                            onClick={() => handleGenerateTranscriptionPdf(formattedYoutubeVideoText)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM13 3v6h6" />
                            </svg>
                            PDF
                        </button>
                        <button
                            onClick={() => handleGenerateTranscriptionSrt(youtubeVideoText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            SRT
                        </button>
                        <button
                            onClick={() => handleGenerateTranscriptionTxt(youtubeVideoText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            TXT
                        </button>
                        <button
                            onClick={() => handleGenerateTranscriptionVtt(youtubeVideoText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            VTT
                        </button>

                        <DropdownMenuBasic id={youtubeVideoText.fileId} setIsOpen={setIsOpen} />


                    </div>
                </header>

                <div className='flex flex-col lg:flex-row flex-1 min-h-0'>

                    <div className='flex flex-col flex-1 border-r border-slate-700/50'>
                        <div className='px-5 py-3 border-b border-slate-700/30'>
                            <h3 className='text-xs font-semibold text-slate-400 uppercase tracking-widest'>Transcripción</h3>
                        </div>
                        <motion.div
                            className='grow bg-slate-800/40 p-8'
                            variants={container}
                            initial='hidden'
                            animate='show'>
                            {youtubeTranslation.length === 0 && youtubeVideoText.segments.map((s, i) => (
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

                    {user.suscription === 'business' && <SummarySection summary={summary} isLoading={isLoading} handleGenerateIaSummary={handleGenerateIaSummary} id={youtubeVideoText.fileId} />}
                </div>
            </aside>
        </section>
    )
}

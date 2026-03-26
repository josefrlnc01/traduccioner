import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import type { SubtitlesViewProps } from '../types/subtitles.types'
import { Spinner } from '@/components/ui/spinner'
import Subtitles from '../pages/SubtitlesView'
import { motion } from 'motion/react'
import { useState } from 'react'
import flecha from './../../../assets/apunta-hacia-abajo.webp'
import type { Translated } from '../types/translared.types'
import { freeUserLanguages, languages } from '../stores/languages'
import { useDocumentAction } from '../hooks/useDocumentAction'
import { container, item } from '../stores/motion'
import { generateIaSummary } from '../api/savedsApi'
import { useTranslate } from '@/features/translation/hooks/useTranslate'
import { formatTime } from '@/shared/utils/minutes'
import { DropdownMenuBasic } from '@/components/DropdownMenuBasic'
import SummarySection from './SummarySection'
import { useSummary } from '../hooks/useSummary'
import { useEditFile } from '../hooks/useEditFIle'
import { useNavigate } from 'react-router'
import EditFileDialog from './EditFileDialog'


export default function FileSubtitles({ mutation, inputValue, fileInputValue }: SubtitlesViewProps) {
    const navigate = useNavigate()
    const { summary, handleGenerateIaSummary } = useSummary()
    const { isLoading } = useSummary()
    const { isOpen, setIsOpen } = useEditFile()
    const { generatePdf,
        generateSrt,
        generateTxt,
        generateVtt,
        generateDocX,
        generateJson,
        generateCsv } = useDocumentAction()

    const { translation,
        isTranslating,
        setIsTranslating,
        generateFileTranslation,
        selectedLang,
        setSelectedLang,
        lang,
        setLang } = useTranslate()


    if (mutation.isError) {

        return (
            <aside className="p-4 text-red-400 md:text-center">
                {mutation.error.message}
            </aside>
        )
    }

    if (mutation.isPending) {
        return (
            <aside className="p-6 flex flex-col gap-4 items-center text-white justify-center">
                <Spinner
                    className="size-16 text-white"
                />
            </aside>
        )
    }


    if (!mutation.data) return null

    if (("translatedYoutubeVideo" in mutation.data)) return <Subtitles
        mutation={mutation}
        inputValue={inputValue}
        fileInputValue={fileInputValue} />
    console.log(mutation.data)
    const fileText = mutation.data.fileText
    const user = mutation.data.user
    console.log(fileText)


    const handleGenerateTranscriptionPdf = (text: string) => {
        generatePdf.mutate(text)
    }

    const handleGenerateTranscriptionSrt = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: fileText.title
        }
        generateSrt.mutate(formData)
    }

    const handleGenerateTranscriptionTxt = (segments: { start: number, end: number, text: string }[]) => {
        generateTxt.mutate(segments)
    }

    const handleGenerateTranscriptionVtt = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: fileText.title
        }
        generateVtt.mutate(formData)
    }

    const handleGenerateTranscriptionDocX = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: fileText.title
        }
        generateDocX.mutate(formData)
    }

    const handleGenerateTranscriptionJson = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: fileText.title
        }
        generateJson.mutate(formData)
    }

    const handleGenerateTranscriptionCsv = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: fileText.title
        }
        generateCsv.mutate(formData)
    }



    const formattedFileText = fileText.segments.map(s => `[${s.start}: ${s.end}]  ${s.text}`).join(`\n`)

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLang(true)
        setLang(e.target.value)
    }


    const handleTranslate = () => {
        console.log('iniciando traducción')
        console.log('lang', lang)
        console.log('segments', fileText.segments)
        const formData = {
            lang,
            fileText: fileText.segments
        }
        generateFileTranslation.mutate(formData)
        setIsTranslating(true)
    }


    return (
        <section className='w-screen flex flex-col lg:flex lg:max-w-3/4 lg:w-3/4  md:items-center rounded-xl'>
            {isOpen && <EditFileDialog isOpen={isOpen} setIsOpen={setIsOpen} id={mutation.data?.fileText.fileId} title={mutation.data?.fileText.title} />}

            <aside className='w-full md:w-3/4  h-96 min-h-96 max-h-96 md:h-3/4 md:max-h-3/4 flex flex-col bg-slate-900/60 rounded-xl border border-slate-800/50 backdrop-blur shadow-xl overflow-hidden'>

                <header className='flex justify-between items-center w-full px-5 py-3.5 bg-slate-800/60 border-b border-slate-700/50'>
                    <div className='grow-0 flex items-center gap-4'>
                        <h2 className='text-sm font-semibold text-gray-100 truncate max-w-xs'>
                            {fileText.title}
                            <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                        </h2>
                    </div>

                    <div className='flex items-center justify-end gap-2 grow'>
                        <button
                            onClick={() => handleGenerateTranscriptionPdf(formattedFileText)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM13 3v6h6" />
                            </svg>
                            PDF
                        </button>
                        <button
                            onClick={() => handleGenerateTranscriptionSrt(fileText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            SRT
                        </button>

                        <button
                            onClick={() => handleGenerateTranscriptionTxt(fileText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11h8M8 14h8M8 17h5M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            TXT
                        </button>
                        <button
                            onClick={() => handleGenerateTranscriptionVtt(fileText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 3h4M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            VTT
                        </button>
                        <button
                            onClick={() => handleGenerateTranscriptionDocX(fileText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11h8M8 14h6M8 17h7M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            DOCX
                        </button>
                        <button
                            onClick={() => handleGenerateTranscriptionCsv(fileText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11h8M8 14h6M8 17h7M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            CSV
                        </button>

                        <button
                            onClick={() => handleGenerateTranscriptionJson(fileText.segments)}
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11h8M8 14h6M8 17h7M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            JSON
                        </button>

                        <DropdownMenuBasic id={fileText.fileId} setIsOpen={setIsOpen} mutation={mutation} data={mutation.data.fileText} />


                    </div>
                </header>

                <div className='flex flex-col lg:flex-row flex-1 min-h-0'>

                    <div className='flex flex-col flex-1 border-r border-slate-700/50'>
                        <div className='px-5 py-3 border-b border-slate-700/30 flex items-center justify-between'>
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
                            {translation.length === 0 && fileText.segments.map((s, i) => (
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
                        </motion.div>
                    </div>

                    {user.suscription === 'business' && <SummarySection summary={summary} isLoading={isLoading} handleGenerateIaSummary={handleGenerateIaSummary} id={fileText.fileId} />}
                </div>
            </aside>
        </section>
    )
}

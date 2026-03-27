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
    const [showSummary, setShowSummary] = useState(false)
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
        <>
        
            {isOpen && <EditFileDialog isOpen={isOpen} setIsOpen={setIsOpen} id={mutation.data?.fileText.fileId} title={mutation.data?.fileText.title} />}

            <aside className='w-full md:w-3/4 lg:w-2/4 md:min-w-3/4 lg:min-w-2/4   flex flex-col items-center bg-slate-900/60 rounded-xl border border-slate-800/50 backdrop-blur shadow-xl overflow-hidden'>

                <header className='flex items-center w-full pr-3 pl-5 py-3.5 bg-slate-800/60 border-b border-slate-700/50'>
                    <div className='grow-0 flex items-center gap-4 min-w-0'>
                        <h2 title={fileText.title} className='text-md font-semibold text-gray-100 truncate max-w-50 lg:max-w-none'>
                            {fileText.title}
                            <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                        </h2>

                    </div>
                    <div className='flex grow items-center justify-end gap-2 self-start'>

                        <DropdownMenuBasic id={fileText.fileId} setIsOpen={setIsOpen} mutation={null} data={fileText} user={user} />
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
                                        defaultValue=''
                                        className="bg-slate-800 text-slate-300 text-sm text-start  px-3 py-1.5 pr-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                    >
                                        <option value="" className='text-sm' disabled>Traducir a...</option>
                                        {(user.suscription === 'business' || user.suscription === 'pro') && languages.map(lang => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}
                                        {user.suscription === 'free' && freeUserLanguages.map(lang => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}

                                    </select>

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
                            className='grow bg-slate-800/40 p-4 md:p-8'
                            variants={container}
                            initial='hidden'
                            animate='show'>
                            {translation.length === 0 && fileText.segments.map((s, i) => (
                                <motion.p
                                    key={i}
                                    whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                    transition={{ duration: 0.15 }}
                                    variants={item}
                                    className='text-start text-sm md:text-md wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                    <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.start.toFixed(2)))}:{formatTime(Number(s.end.toFixed(2)))}</span> {s.text}
                                </motion.p>
                            ))}
                            {translation.length > 0 && translation.map((s, i) => (
                                <motion.p
                                    key={i}
                                    whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                    transition={{ duration: 0.15 }}
                                    variants={item}
                                    className='text-start text-sm wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                    <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.start.toFixed(2)))}:{formatTime(Number(s.end.toFixed(2)))}</span> {s.text}
                                </motion.p>
                            ))}

                        </motion.div>
                    </div>

                    {user.suscription === 'business' && (
                        <div className='border-t border-slate-700/50'>
                            <button
                                onClick={() => setShowSummary(!showSummary)}
                                className='w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors'
                            >
                                <div className='flex items-center gap-2'>
                                    <svg className='w-4 h-4 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                                    </svg>
                                    <span className='text-xs font-semibold uppercase tracking-widest'>Resumen IA</span>
                                </div>
                                <svg
                                    className={`w-4 h-4 transition-transform ${showSummary ? 'rotate-180' : ''}`}
                                    fill='none' stroke='currentColor' viewBox='0 0 24 24'
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                </svg>
                            </button>

                            {showSummary && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className='px-4 pb-4'
                                >
                                    <SummarySection
                                        summary={summary}
                                        isLoading={isLoading}
                                        handleGenerateIaSummary={() => handleGenerateIaSummary(fileText.fileId)}
                                        id={fileText.fileId}
                                    />
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </aside>
       </>
    )
}

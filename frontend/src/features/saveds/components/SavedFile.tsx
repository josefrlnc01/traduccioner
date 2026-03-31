import { DropdownMenuBasic } from '@/components/DropdownMenuBasic'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { formatTime } from '@/shared/utils/minutes'
import { useTranslate } from '@/features/translation/hooks/useTranslate'
import { Spinner } from '@/components/ui/spinner'
import { languages } from '@/features/transcription/stores/languages'
import { useState } from 'react'
import { useEditFile } from '@/features/transcription/hooks/useEditFIle'
import EditFileDialog from '@/features/transcription/components/EditFileDialog'
import { useTheme } from '@/shared/context/ThemeContext'
import { item, savedsContainer } from '@/features/transcription/stores/motion'
import SummarySection from '@/features/transcription/components/SummarySection'
import { useSummary } from '@/features/transcription/hooks/useSummary'
import type { SavedFileProps } from '../types/saveds.types'



export default function SavedFile({ data, user, id }: SavedFileProps) {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [isCopiyng, setIsCopiyng] = useState(false)
    const [showSummary, setShowSummary] = useState(false)
    const { summary, isLoading, handleGenerateIaSummary } = useSummary()
    const { translation, youtubeTranslation, generateFileTranslation, generateYoutubeTranslation, isTranslating, selectedLang, setSelectedLang, setLang, lang } = useTranslate()
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLang(true)
        setLang(e.target.value)
    }
    const { isOpen, setIsOpen } = useEditFile()
    const [editedTitle, setEditedTitle] = useState<string | null>(null)
    const displayTitle = editedTitle ?? data.title

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

    const formattedText = data.segments.map(s => s.text).join('\n')
    const formattedFileTranslation = translation.map(s => s.text).join('')
    const formattedYoutubeTranslation = youtubeTranslation.map(s => s.text).join('')
    const handleCopyText = () => {
        setIsCopiyng(true)
        if (youtubeTranslation.length > 0 && translation.length === 0) {
            navigator.clipboard.writeText(formattedYoutubeTranslation)
        } else if (translation.length > 0 && youtubeTranslation.length === 0) {
            navigator.clipboard.writeText(formattedFileTranslation)
        } else {
            navigator.clipboard.writeText(formattedText)
        }
        setTimeout(() => {
            setIsCopiyng(false)
        }, 2000)

    }

    return (
        <>
            {isOpen && <EditFileDialog isOpen={isOpen} setIsOpen={setIsOpen} id={id!} title={displayTitle} onTitleUpdated={setEditedTitle} />}

            <aside className={`w-full md:w-3/4 lg:w-2/4 md:min-w-3/4 lg:min-w-2/4  flex flex-col ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/50' : 'bg-slate-200 border-slate-300/50'} rounded-xl border  backdrop-blur shadow-xl overflow-hidden`}>

                <header className={`flex items-center w-full pr-3 pl-5 py-3.5 ${theme === 'dark' ? 'bg-slate-800/60 border-b border-slate-700/50' : 'bg-slate-200 border-slate-300/50'}`}>
                    <div className='grow-0 flex items-center gap-4 min-w-0'>
                        <h2 title={`Título: ${displayTitle}`} className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-slate-950'} truncate max-w-50 lg:max-w-none`}>
                            {displayTitle}
                            <span className="text-xs font-normal text-slate-500 ml-1">(Original)</span>
                        </h2>
                        <button
                            title='Copiar texto plano'
                            className={` cursor-pointer`}
                            onClick={handleCopyText}>
                            {isCopiyng
                                ? <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#22c55e" 
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5 text-green-500" 
                                >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                : <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-5 h-5"
                                >
                                    <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            }

                        </button>

                    </div>
                    <div className='flex grow items-center justify-end gap-2 self-start'>

                        <DropdownMenuBasic id={data.fileId} setIsOpen={setIsOpen} mutation={null} data={data} translation={translation ?? youtubeTranslation} user={user} />

                        <button onClick={() => navigate('/dashboard')} className='p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className='flex flex-col lg:flex-row flex-1 min-h-0'>

                    <div className='flex flex-col flex-1 border-r border-slate-700/50'>
                        <div className={`px-5 py-3 border-b ${theme === 'dark' ? 'bg-inherit border-slate-800' : 'bg-white border-slate-200'}  flex items-center justify-between gap-4`}>
                            <h3 className={`text-xs font-semibold  ${theme === 'dark' ? 'text-slate-400' : 'text-slate-800'} uppercase tracking-widest`}>Transcripción</h3>

                            {(user.suscription === 'pro' || user.suscription === 'business') &&
                                <>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className='relative'>
                                            <select
                                                onChange={handleSelect}
                                                defaultValue=''

                                                className={`flex-1  appearance-none text-xs px-2 py-1.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700 focus:outline-none hover:bg-slate-900/90' : 'bg-slate-200 text-slate-900 border-slate-300'}  focus:border-blue-500 cursor-pointer duration-200 transition-colors ease`}
                                            >
                                                <option value="" className='text-sm' disabled>Traducir a...</option>
                                                {languages.map(lang => (
                                                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                                                ))}

                                            </select>

                                        </div>


                                        <button
                                            onClick={handleTranslate}
                                            disabled={!selectedLang || isTranslating}
                                            className={`flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 ${theme === 'dark' ? 'disabled:bg-slate-700 disabled:text-slate-500' : 'disabled:bg-slate-300 disabled:text-slate-500'} disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer`}
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
                                </>
                            }
                        </div>
                        <motion.div
                            className={`grow ${theme === 'dark' ? 'bg-slate-800/40' : 'bg-white text-slate-900'} p-4 md:p-8`}
                            variants={savedsContainer}
                            initial='hidden'
                            animate='show'>
                            {(translation.length === 0 && youtubeTranslation.length === 0) && data.segments.map((s, i) => (
                                <motion.p
                                    key={i}
                                    whileHover={theme === 'dark' ? { backgroundColor: 'rgba(30, 41, 59, 0.8)' } : { backgroundColor: 'rgba(30, 41, 59, 0.1)' }}
                                    transition={{ duration: 0.15 }}
                                    variants={item}
                                    className={`text-start text-sm md:text-md wrap-anywhere font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'} leading-relaxed`}>
                                    <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.start.toFixed(2)))}:{formatTime(Number(s.end.toFixed(2)))}</span> {s.text}
                                </motion.p>
                            ))}
                            {translation.length > 0 && translation.map((s, i) => (
                                <motion.p
                                    key={i}
                                    whileHover={theme === 'dark' ? { backgroundColor: 'rgba(30, 41, 59, 0.8)' } : { backgroundColor: 'rgba(30, 41, 59, 0.1)' }}
                                    transition={{ duration: 0.15 }}
                                    variants={item}
                                    className={`text-start text-sm md:text-md wrap-anywhere font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'} leading-relaxed`}>
                                    <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.start.toFixed(2)))}:{formatTime(Number(s.end.toFixed(2)))}</span> {s.text}
                                </motion.p>
                            ))}
                            {youtubeTranslation.length > 0 && youtubeTranslation.map((s, i) => (
                                <motion.p
                                    key={i}
                                    whileHover={theme === 'dark' ? { backgroundColor: 'rgba(30, 41, 59, 0.8)' } : { backgroundColor: 'rgba(30, 41, 59, 0.1)' }}
                                    transition={{ duration: 0.15 }}
                                    variants={item}
                                    className={`text-start text-sm md:text-md wrap-anywhere font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'} leading-relaxed`}>
                                    <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>{formatTime(Number(s.start.toFixed(2)))}:{formatTime(Number(s.end.toFixed(2)))}</span> {s.text}
                                </motion.p>
                            ))}
                        </motion.div>
                    </div>

                    {user.suscription === 'business' && (
                        <div className={`border-t ${theme === 'dark' ? 'bg-inherit border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                            <button
                                onClick={() => setShowSummary(!showSummary)}
                                className='w-full flex items-center justify-between px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors cursor-pointer'
                            >
                                <div className='flex items-center gap-2'>
                                    <svg className='w-4 h-4 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                                    </svg>
                                    <span className={`text-xs font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-inherit' : 'text-slate-800'}`}>Resumen</span>
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
                                    className={`${theme === 'dark' ? 'bg-inherit' : 'bg-slate-100 border-slate-200'} px-4 pb-4 h-full w-full min-h-full`}
                                >
                                    <SummarySection
                                        summary={summary}
                                        isLoading={isLoading}
                                        handleGenerateIaSummary={() => handleGenerateIaSummary(id)}
                                        id={id}
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

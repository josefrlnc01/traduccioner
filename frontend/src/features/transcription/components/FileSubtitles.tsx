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
        <section className='w-screen flex flex-col lg:flex lg:max-w-3/4 lg:w-3/4  md:items-center rounded-xl'>
            {isOpen && <EditFileDialog isOpen={isOpen} setIsOpen={setIsOpen} id={mutation.data?.fileText.fileId} title={mutation.data?.fileText.title} />}

            <aside className='w-full md:w-3/4  h-96 min-h-96 max-h-96 md:h-3/4 md:max-h-3/4 flex flex-col bg-slate-900/60 rounded-xl border border-slate-800/50 backdrop-blur shadow-xl overflow-hidden'>

                <header className='flex items-center w-full px-5 py-3.5 bg-slate-800/60 border-b border-slate-700/50'>
                    <div className='grow-0 flex items-center gap-4'>
                        <h2 className='text-sm font-semibold text-gray-100 truncate max-w-xs'>
                            {fileText.title}
                            <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                        </h2>
                    </div>

                    <div className='flex items-center justify-end gap-2 grow'>
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

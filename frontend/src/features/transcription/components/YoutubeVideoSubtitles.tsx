import type { SubtitlesViewProps } from '../types/subtitles.types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import FileSubtitles from './FileSubtitles'
import { motion } from 'motion/react'
import { useState } from 'react'
import { translateYoutubeText } from '@/features/translation/translationApi'
import type { Translated } from '../types/translared.types'
import { languages } from '../stores/languages'
import { Spinner } from '@/components/ui/spinner'
import { useDocumentAction } from '../hooks/useDocumentAction'
import { container, item } from '../stores/motion'



export default function YoutubeVideoSubtitles({ mutation, inputValue, fileInputValue}: SubtitlesViewProps) {
    const [lang, setLang] = useState('')
    const [translation, setTranslation] = useState<Translated>([])
    const [selectedLang, setSelectedLang] = useState(false)
    const [isTranslating, setIsTranslating] = useState(false)
    const {generatePdf, generateSrt} = useDocumentAction()
    

    const generateYoutubeTranslation = useMutation({
        mutationFn: translateYoutubeText,
        onSuccess: (data) => {
            setTranslation(data)
            setIsTranslating(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })


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

    const youtubeVideoText = mutation.data.youtubeVideoText

    const handleGenerateTranscriptionPdf = (subtitles: string) => {
        generatePdf.mutate(subtitles)
    }

    const handleGenerateTranscriptionSrt = (segments: { start: number, end: number, text: string }[]) => {
        generateSrt.mutate(segments)
    }
    const formattedYoutubeVideoText = youtubeVideoText
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
            youtubeVideoText
        }
        generateYoutubeTranslation.mutate(formData)
        setIsTranslating(true)
    }




    return (
        <section className='w-screen flex flex-col lg:flex lg:max-w-3/4 lg:w-3/4  md:items-center rounded-xl'>
            <section className='flex flex-col justify-start lg:flex lg:flex-row gap-2 rounded-xl overflow-x-hidden overflow-y-auto'>
                <aside className='border border-solid border-[#ffffff1a] w-full max-w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                    <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                        <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                            Transcripción <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                            <select
                                onChange={handleSelect}
                                className="bg-slate-800 text-slate-300 text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                            >
                                <option defaultValue={''} disabled>Traducir a...</option>
                                {languages.map(lang => (
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
                    </header>
                    <motion.div
                        variants={container}
                        initial='hidden'
                        animate='show'
                        className='grow bg-slate-800/40 p-8'>
                        {translation.length === 0 && youtubeVideoText.map((s, i) => (
                            <motion.p
                                key={i}
                                variants={item}
                                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                transition={{ duration: 0.15 }}
                                className='text-start wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>[{s.start.toFixed(2)}:{s.end.toFixed(2)}]</span> {s.text}
                            </motion.p>
                        ))}
                        {translation.length > 0 && translation.map((s, i) => (
                            <motion.p
                                key={i}
                                variants={item}
                                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                                transition={{ duration: 0.15 }}
                                className='text-start wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                <span className='text-[#0d59f2] text-xs mr-2 font-mono font-semibold'>[{s.start.toFixed(2)}:{s.end.toFixed(2)}]</span> {s.text}
                            </motion.p>
                        ))}
                    </motion.div>
                    <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                        <button
                            onClick={() => handleGenerateTranscriptionPdf(formattedYoutubeVideoText)}
                            className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                            type='button'>PDF</button>
                        <button
                            onClick={() => handleGenerateTranscriptionSrt(youtubeVideoText)}
                            className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                            type='button'>SRT</button>
                    </div>

                </aside>

            </section>
        </section>
    )
}

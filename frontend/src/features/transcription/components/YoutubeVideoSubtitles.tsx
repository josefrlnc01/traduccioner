import type { SubtitlesViewProps } from '../types/subtitles.types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { generatePDF } from '@/features/document/api/documentApi'
import FileSubtitles from './FileSubtitles'
import { motion } from 'motion/react'

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChidlren: 0.30
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function YoutubeVideoSubtitles({ mutation, inputValue, fileInputValue, language, isOpenFile, setIsOpenFile }: SubtitlesViewProps) {
    const generatePdf = useMutation({
        mutationFn: generatePDF,
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
    language={language} 
    isOpenFile={isOpenFile} 
    setIsOpenFile={setIsOpenFile} />


    const { translatedYoutubeVideo } = mutation.data
    const youtubeVideoText = mutation.data.youtubeVideoText
    console.log('video', youtubeVideoText)
    let formatedTranslatedYoutubeVideo
    const handleGenerateTranscriptionPdf = (subtitles: string) => {
        generatePdf.mutate(subtitles)
    }
    const formattedYoutubeVideoText = youtubeVideoText
        .map(s => `[${s.start}:${s.end}] ${s.text}`)
        .join('\n')



    if (formatedTranslatedYoutubeVideo) {
        formatedTranslatedYoutubeVideo = translatedYoutubeVideo.split('. ').map(s => s.endsWith('.') ? s : s + '.')
    }

    return (
        <section className='w-screen flex flex-col lg:flex lg:max-w-3/4 lg:w-3/4  md:items-center rounded-xl'>
            <section className='flex flex-col justify-start lg:flex lg:flex-row gap-2 rounded-xl overflow-x-hidden overflow-y-auto'>
                <aside className='border border-solid border-[#ffffff1a] w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                    <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                        <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                            Transcripción <span className="text-xs font-normal text-slate-500 ml-2">(Original)</span>
                        </h2>
                    </header>
                    <motion.div
                        variants={container}
                        initial='hidden'
                        animate='show'
                        className='grow bg-slate-800/40 p-8'>
                        {youtubeVideoText.map((s, i) => (
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
                            type='button'>Descargar</button>
                    </div>

                </aside>
                {((inputValue || fileInputValue) && language && translatedYoutubeVideo) &&
                    <aside className='border border-solid border-[#ffffff1a] w-full flex flex-col rounded-md bg-[#ffffff08]  backdrop-blur-md shadow-2xl'>
                        <header className='flex justify-between items-center w-full p-4 bg-slate-700/40  border-b border-slate-800'>
                            <h2 className='text-xl font-bold tracking-tight text-gray-100 leading-tight'>
                                Traducción <span className="text-xs font-normal text-slate-500 ml-2">({language})</span>
                            </h2>
                        </header>
                        <div className='grow bg-slate-800/40 p-8'>
                            {formatedTranslatedYoutubeVideo && formatedTranslatedYoutubeVideo.map(p => (
                                <p key={p} className='text-xl text-start wrap-anywhere font-semibold text-gray-200 leading-relaxed'>
                                    {p}
                                </p>
                            ))}

                        </div>
                        <div className='w-full min-w-full flex justify-between gap-2 bg-[#101622] p-3'>
                            <button
                                onClick={() => handleGenerateTranscriptionPdf(translatedYoutubeVideo)}
                                className='p-3 pl-4 pr-4 grow bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors cursor-pointer'
                                type='button'>Descargar</button>
                        </div>
                    </aside>}
            </section>
        </section>
    )
}

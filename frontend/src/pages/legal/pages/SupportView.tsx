import { useState } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'

const faqs = [
    {
        question: '¿Qué formatos de archivo acepta AudWave?',
        answer: 'AudWave acepta archivos de audio y vídeo en los formatos más comunes: MP3, MP4, WAV, M4A, OGG, WEBM y más. También puedes pegar directamente un enlace de YouTube.'
    },
    {
        question: '¿Cuánto tiempo tarda en transcribir un audio?',
        answer: 'El tiempo depende de la duración del archivo. Un audio de 5 minutos suele transcribirse en 30-60 segundos. Archivos más largos pueden tardar proporcionalmente más.'
    },
    {
        question: '¿En qué idiomas puedo transcribir?',
        answer: 'Whisper de OpenAI detecta automáticamente el idioma del audio y lo transcribe. La traducción está disponible a Español, Inglés, Francés e Italiano según tu plan.'
    },
    {
        question: '¿Qué pasa cuando se acaban mis minutos del plan gratuito?',
        answer: 'Cuando alcanzas el límite de 6 minutos del plan gratuito, recibirás un mensaje indicándolo. Puedes esperar al próximo mes para que se reseteen o mejorar a un plan de pago.'
    },
    {
        question: '¿Mis transcripciones se guardan automáticamente?',
        answer: 'Sí, todas las transcripciones se guardan automáticamente en tu historial y puedes acceder a ellas en cualquier momento desde la sección de guardados.'
    },
    {
        question: '¿Qué formatos de exportación están disponibles?',
        answer: 'Dependiendo de tu plan puedes exportar en TXT (gratuito), PDF, SRT, VTT (Pro), y DOCX, JSON, CSV (Business).'
    },
    {
        question: '¿El resumen IA en qué plan está disponible?',
        answer: 'El resumen automático generado por GPT-4o está disponible exclusivamente en el plan Business.'
    },
    {
        question: '¿Puedo cancelar mi suscripción en cualquier momento?',
        answer: 'Sí, puedes cancelar tu suscripción cuando quieras. Seguirás teniendo acceso a las funcionalidades de tu plan hasta el final del período facturado.'
    }
]

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='border border-slate-800/60 rounded-xl overflow-hidden'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/30 transition-colors cursor-pointer'
            >
                <span className='text-sm font-medium text-gray-200 pr-4'>{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className='shrink-0'
                >
                    <ChevronDown className='w-4 h-4 text-slate-400' />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className='overflow-hidden'
                    >
                        <p className='px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3'>
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function SupportView() {
    return (
        <main className='min-h-screen bg-[#0a0e17] text-white'>


            <div className='max-w-3xl mx-auto px-6 py-16'>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className='text-center mb-14'
                >
                    <div className='w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6'>
                        <svg className='w-7 h-7 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' />
                        </svg>
                    </div>
                    <h1 className='text-4xl font-bold text-white mb-3'>Centro de soporte</h1>
                    <p className='text-slate-400 text-lg'>Encuentra respuestas a las preguntas más frecuentes sobre AudWave.</p>
                </motion.div>

                {/* Contacto rápido */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-12'
                >
                    <div className='p-5 bg-slate-900/60 border border-slate-800/60 rounded-xl flex items-start gap-4'>
                        <div className='w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0'>
                            <svg className='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                            </svg>
                        </div>
                        <div>
                            <h3 className='text-sm font-semibold text-white mb-1'>Email</h3>
                            <p className='text-xs text-slate-400 mb-2'>Respuesta en menos de 24 horas</p>
                            <a href='mailto:soporte@audwave.app' className='text-sm text-blue-400 hover:text-blue-300 transition-colors'>
                                soporte@audwave.app
                            </a>
                        </div>
                    </div>

                    <div className='p-5 bg-slate-900/60 border border-slate-800/60 rounded-xl flex items-start gap-4'>
                        <div className='w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0'>
                            <svg className='w-5 h-5 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' />
                            </svg>
                        </div>
                        <div>
                            <h3 className='text-sm font-semibold text-white mb-1'>GitHub</h3>
                            <p className='text-xs text-slate-400 mb-2'>Reporta bugs o solicita features</p>
                            <a
                                href='https://github.com/josefrlnc01/audwave/issues'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-sm text-blue-400 hover:text-blue-300 transition-colors'
                            >
                                Abrir issue →
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <h2 className='text-xl font-bold text-white mb-6'>Preguntas frecuentes</h2>
                    <div className='flex flex-col gap-3'>
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className='mt-14 text-center p-8 bg-slate-900/40 border border-slate-800/60 rounded-2xl'
                >
                    <p className='text-slate-400 text-sm mb-4'>¿No encuentras lo que buscas?</p>
                    <a
                        href='mailto:soporte@audwave.app'
                        className='inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors'
                    >
                        Contactar soporte
                    </a>
                </motion.div>

            </div>
        </main>
    )
}
import React, { useEffect, useState } from 'react'

const awaitPhrases = [ 'Procesando audio...', 'Transcribiendo audio, puede tardar un poco...', 'Extrayendo texto...']

export default function TranscriptionSkeleton() {

    const [phrase, setPhrase] = useState(awaitPhrases[0])
    const [index, setIndex] = useState(0)
    const [fade, setFade] = useState(true)


    

    useEffect(() => {
        if (index >= awaitPhrases.length) return
        const timeOut = setTimeout(() => {
            setFade(false)
            setTimeout(() => {
                setIndex(prev => prev + 1)
                setPhrase(awaitPhrases[index + 1])
                setFade(true)
            }, 300)
        }, 6000)
        return () => clearTimeout(timeOut)
    }, [index, awaitPhrases.length])



    return (
        <section className='w-full mt-0 self-auto h-full bg-slate-800/30 fixed right-0 left-0 top-0 bottom-0 flex flex-col items-center justify-center z-30 rounded-2xl p-8 mb-12 shadow-2xl backdrop-blur'>
            <div className="space-y-3 p-4 flex">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-row gap-4 items-start">
                        <div className="w-10 h-4 bg-slate-700 flex rounded animate-pulse shrink-0" />
                        <div
                            className="h-4 bg-slate-700 rounded animate-pulse"
                            style={{ width: `${Math.random() * 40 + 60}%` }}
                        />
                    </div>
                ))}
            </div>
            <small className={`text-neutral-200 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"
                    }`}>{phrase}</small>
        </section>
    )
}

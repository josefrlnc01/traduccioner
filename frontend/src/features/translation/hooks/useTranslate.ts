import { useMutation } from "@tanstack/react-query"
import { translateText, translateYoutubeText } from "../translationApi"
import { useState } from "react"
import type { Translated } from "@/features/transcription/types/translared.types"
import { toast } from "react-toastify"

export const useTranslate = () => {
    const [lang, setLang] = useState('')
    const [translation, setTranslation] = useState<Translated>([])
    const [youtubeTranslation, setYoutubeTranslation] = useState<Translated>([])
    const [isTranslating, setIsTranslating] = useState(false)
    const [selectedLang, setSelectedLang] = useState(false)
    const generateFileTranslation = useMutation({
        mutationFn: translateText,
        onSuccess: (data) => {
            setTranslation(data)
            setIsTranslating(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const generateYoutubeTranslation = useMutation({
        mutationFn: translateYoutubeText,
        onSuccess: (data) => {
            setYoutubeTranslation(data)
            setIsTranslating(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })


    return {translation, isTranslating, generateFileTranslation, youtubeTranslation, generateYoutubeTranslation, selectedLang, setSelectedLang, lang, setLang}
}
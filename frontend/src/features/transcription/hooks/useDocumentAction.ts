import { generatePDF, generateSRT, generateTXT, generateVTT } from "@/features/document/api/documentApi"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"

export const useDocumentAction = () => {
     const generatePdf = useMutation({
        mutationFn: generatePDF,
        onError: (error) => {
            toast.error(error.message)
        }
    })
    
    const generateSrt = useMutation({
        mutationFn: generateSRT,
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const generateTxt = useMutation({
        mutationFn: generateTXT,
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const generateVtt = useMutation({
        mutationFn: generateVTT,
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return  {generatePdf, generateSrt, generateTxt, generateVtt}
}
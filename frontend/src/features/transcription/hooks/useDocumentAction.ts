import { generatePDF, generateSRT } from "@/features/document/api/documentApi"
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

    return  {generatePdf, generateSrt}
}
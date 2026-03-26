import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import { deleteSaved } from "@/features/transcription/api/savedsApi"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import { useState } from "react"
import type { PromiseFile, PromiseLink } from "@/features/transcription/api/transcriptionApi"
import type { MutationProps } from "@/features/transcription/components/Form"
import { useDocumentAction } from "@/features/transcription/hooks/useDocumentAction"
import type { SavedFile } from "@/features/transcription/components/SavedFile"
import { formatTime } from "@/shared/utils/minutes"

type DropdownProps = {
    id: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    mutation: UseMutationResult<PromiseLink  | PromiseFile | undefined, Error, MutationProps, unknown> | null,
    data: SavedFile
}
export function DropdownMenuBasic({ id,  setIsOpen, mutation, data }: DropdownProps) {
    console.log('id', id)
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const deleteFN = useMutation({
        mutationFn: deleteSaved,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['allSaveds']})
            mutation?.reset()
            toast.success(data)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const { generatePdf,
        generateSrt,
        generateTxt,
        generateVtt,
        generateDocX,
        generateJson,
        generateCsv } = useDocumentAction()

    const handleGenerateTranscriptionPdf = (text: string) => {
        generatePdf.mutate(text)
    }

    const handleGenerateTranscriptionSrt = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateSrt.mutate(formData)
    }

    const handleGenerateTranscriptionTxt = (segments: { start: number, end: number, text: string }[]) => {
        generateTxt.mutate(segments)
    }

    const handleGenerateTranscriptionVtt = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateVtt.mutate(formData)
    }

    const handleGenerateTranscriptionDocX = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateDocX.mutate(formData)
    }

    const handleGenerateTranscriptionJson = (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateJson.mutate(formData)
    }

    const handleGenerateTranscriptionCsv =  (segments: { start: number, end: number, text: string }[]) => {
        const formData = {
            segments,
            title: data.title
        }
        generateCsv.mutate(formData)
    }

    const handleDelete = () => {
        deleteFN.mutate(id)
        navigate('/')
    }

    const handleEdit = () => {
        setIsOpen(true)
    }

    const formattedText = data.segments.map(s => `${formatTime(s.start)}:${formatTime(s.end)} ${s.text}`).join('\n')

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="bg-slate-800 px-3 py-1.5 text-gray-100 hover:bg-slate-700 transition-colors border-mone  cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        // Corregido: w-10 (40px), sin comillas raras y clases válidas
                        className="!w-5 !h-5 !p-1 text-gray-400"
                    >
                        <circle cx="5" cy="12" r="2.5"></circle>
                        <circle cx="12" cy="12" r="2.5"></circle>
                        <circle cx="19" cy="12" r="2.5"></circle>
                    </svg>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Archivo</DropdownMenuLabel>
                    <DropdownMenuItem 
                    onClick={handleEdit}
                    className="cursor-pointer hover:bg-blue-600/80 hover:text-white transition-colors duration-100 ease-in">Editar título</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-100 ease-in">Eliminar</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Descarga</DropdownMenuLabel>
                    <DropdownMenuItem 
                    onClick={() => handleGenerateTranscriptionTxt(data.segments)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer">TXT</DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={() => handleGenerateTranscriptionPdf(formattedText)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer">PDF</DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={() => handleGenerateTranscriptionSrt(data.segments)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer">SRT</DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={() => handleGenerateTranscriptionVtt(data.segments)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer">VTT</DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={() => handleGenerateTranscriptionDocX(data.segments)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer">DOCX</DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={() => handleGenerateTranscriptionJson(data.segments)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer">JSON</DropdownMenuItem>
                    
                    
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
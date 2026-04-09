import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import { deleteSaved } from "@/features/saveds/api/savedsApi"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import type { MutationProps, PromiseFile, PromiseLink } from "@/features/transcription/types/subtitles.types"
import { useDocumentAction } from "@/features/transcription/hooks/useDocumentAction"
import type { SavedFile } from "@/features/saveds/types/saveds.types"
import type { User } from "@/features/transcription/types/user.types"
import { useTheme } from "@/shared/context/ThemeContext"
import type { Translated } from "@/features/transcription/types/translared.types"



type DropdownProps = {
    id: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    mutation: UseMutationResult<PromiseLink | PromiseFile | undefined, Error, MutationProps, unknown> | null,
    data: SavedFile,
    user: User,
    translation: Translated
}
export function DropdownMenuBasic({ id, setIsOpen, mutation, data, user,  translation }: DropdownProps) {
    const { theme } = useTheme()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const deleteFN = useMutation({
        mutationFn: deleteSaved,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['allSaveds'] })
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

    const handleGenerateTranscriptionPdf = (segments: { start: number, end: number, text: string }[]) => {
        let formData 
        if (translation.length > 0) {
            formData = {
                segments: translation,
                title: data.title
            }
        } else {
            formData = {
            segments,
            title: data.title
        }
        }
        
        generatePdf.mutate(formData)
    }

    const handleGenerateTranscriptionSrt = (segments: { start: number, end: number, text: string }[]) => {
        let formData 
        if (translation.length > 0) {
            formData = {
                segments: translation,
                title: data.title
            }
        } else {
            formData = {
            segments,
            title: data.title
        }
        }
        
        generateSrt.mutate(formData)
    }

    const handleGenerateTranscriptionTxt = (segments: { start: number, end: number, text: string }[]) => {
        let formData 
        if (translation.length > 0) {
            formData = {
                segments: translation,
                title: data.title
            }
        } else {
            formData = {
            segments,
            title: data.title
        }
        }
        
        generateTxt.mutate(formData)
    }

    const handleGenerateTranscriptionVtt = (segments: { start: number, end: number, text: string }[]) => {
        let formData 
        if (translation.length > 0) {
            formData = {
                segments: translation,
                title: data.title
            }
        } else {
            formData = {
            segments,
            title: data.title
        }
        }
        
        generateVtt.mutate(formData)
    }

    const handleGenerateTranscriptionDocX = (segments: { start: number, end: number, text: string }[]) => {
        let formData 
        if (translation.length > 0) {
            formData = {
                segments: translation,
                title: data.title
            }
        } else {
            formData = {
            segments,
            title: data.title
        }
        }
        
        generateDocX.mutate(formData)
    }

    const handleGenerateTranscriptionJson = (segments: { start: number, end: number, text: string }[]) => {
        let formData 
        if (translation.length > 0) {
            formData = {
                segments: translation,
                title: data.title
            }
        } else {
            formData = {
            segments,
            title: data.title
        }
        }
        
        generateJson.mutate(formData)
    }

    const handleGenerateTranscriptionCsv = (segments: { start: number, end: number, text: string }[]) => {
        let formData 
        if (translation.length > 0) {
            formData = {
                segments: translation,
                title: data.title
            }
        } else {
            formData = {
            segments,
            title: data.title
        }
        }
        
        generateCsv.mutate(formData)
    }

    const handleDelete = () => {
        deleteFN.mutate(id)
        navigate('/dashboard')
    }

    const handleEdit = () => {
        setIsOpen(true)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className={`${theme === 'dark' ? 'bg-slate-800 text-gray-100 hover:bg-slate-700 ' : 'bg-slate-100 text-slate-900 hover:bg-slate-100/80'} p-1.5 transition-colors border-mone  cursor-pointer`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        // Corregido: w-10 (40px), sin comillas raras y clases válidas
                        className="w-5! h-5! p-1! text-gray-400"
                    >
                        <circle cx="5" cy="12" r="2.5"></circle>
                        <circle cx="12" cy="12" r="2.5"></circle>
                        <circle cx="19" cy="12" r="2.5"></circle>
                    </svg>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`${theme === 'dark' ? 'bg-slate-900 border border-slate-700/50 ' : 'bg-white border-blue-500'}shadow-xl shadow-black/40 p-2 min-w-48`}>

                {/* Acciones */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 pb-1">
                        Archivo
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={handleEdit}
                        className={`flex items-center gap-2 px-2 py-2 text-sm ${theme === 'dark' ? 'text-slate-300 hover:text-white  focus:text-white' : 'text-slate-900'} hover:bg-blue-600  rounded-lg cursor-pointer transition-colors `}
                    >
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar título
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className={`flex items-center gap-2 px-2 py-2 text-sm hover:text-white hover:bg-red-500 ${theme === 'dark' ? 'text-slate-300  focus:text-white' : 'text-slate-900'}  rounded-lg cursor-pointer transition-colors `}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-slate-700/50 my-2" />

                {/* Descargas */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 pb-1">
                        Descargar como
                    </DropdownMenuLabel>

                    {/* TXT - disponible para todos */}
                    <DropdownMenuItem
                        onClick={() => handleGenerateTranscriptionTxt(data.segments)}
                        className={`flex items-center gap-2 px-2 py-2 text-sm ${theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white' : 'text-slate-900 hover:bg-slate-50'}  rounded-lg cursor-pointer transition-colors `}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            TXT
                        </div>
                        <span className={`text-xs text-slate-600 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} px-1.5 py-0.5 rounded border border-blue-500/20`}>Free</span>
                    </DropdownMenuItem>

                    {/* PRO y BUSINESS */}
                    <>
                        <DropdownMenuItem
                            onClick={() => handleGenerateTranscriptionPdf(data.segments)}
                            className={`flex items-center gap-2 px-2 py-2 text-sm ${theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white' : 'text-slate-900 hover:bg-slate-50'}  rounded-lg cursor-pointer transition-colors `}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM13 3v6h6" />
                                </svg>
                                PDF
                            </div>
                            <span className={`text-xs text-slate-600 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} px-1.5 py-0.5 rounded border border-blue-500/20`}>Free</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleGenerateTranscriptionSrt(data.segments)}
                            className={`flex items-center gap-2 px-2 py-2 text-sm ${theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white' : 'text-slate-900 hover:bg-slate-50'}  rounded-lg cursor-pointer transition-colors `}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                SRT
                            </div>
                            <span className={`text-xs text-slate-600 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} px-1.5 py-0.5 rounded border border-blue-500/20`}>Free</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleGenerateTranscriptionVtt(data.segments)}
                            className={`flex items-center gap-2 px-2 py-2 text-sm ${theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white' : 'text-slate-900 hover:bg-slate-50'}  rounded-lg cursor-pointer transition-colors `}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                VTT
                            </div>
                            <span className={`text-xs text-slate-600 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} px-1.5 py-0.5 rounded border border-blue-500/20`}>Free</span>
                        </DropdownMenuItem>
                    </>


                    {/* Solo BUSINESS */}

                    <>
                        <DropdownMenuSeparator className="bg-slate-700/30 my-1" />
                        <DropdownMenuLabel className="text-xs font-semibold text-purple-400/70 uppercase tracking-widest px-2 pb-1">
                            Business
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => handleGenerateTranscriptionDocX(data.segments)}
                            disabled={user.subscription !== 'business'}
                            className={`flex items-center gap-2 px-2 py-2 text-sm ${theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white' : 'text-slate-900 hover:bg-slate-50'}  rounded-lg cursor-pointer transition-colors `}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                DOCX
                            </div>
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">Business</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleGenerateTranscriptionJson(data.segments)}
                            disabled={user.subscription !== 'business'}
                            className={`flex items-center gap-2 px-2 py-2 text-sm ${theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white' : 'text-slate-900 hover:bg-slate-50'}  rounded-lg cursor-pointer transition-colors `}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                JSON
                            </div>
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">Business</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleGenerateTranscriptionCsv(data.segments)}
                            disabled={user.subscription !== 'business'}
                            className={`flex items-center gap-2 px-2 py-2 text-sm ${theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white' : 'text-slate-900 hover:bg-slate-50'}  rounded-lg cursor-pointer transition-colors `}
                        >
                            <div className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M14 3v18" />
                                </svg>
                                CSV
                            </div>
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">Business</span>
                        </DropdownMenuItem>
                    </>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

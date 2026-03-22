import { Button } from "@/shared/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { deleteSaved } from "@/features/transcription/api/savedsApi"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"

type DropdownProps = {
    id: string
}
export function DropdownMenuBasic({ id }: DropdownProps) {
    const navigate = useNavigate()
    const deleteFN = useMutation({
        mutationFn: deleteSaved,
        onSuccess: (data) => {
            toast.success(data)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })


    const handleDelete = () => {
        deleteFN.mutate(id)
        navigate('/')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" className="bg-slate-800 text-gray-100 p-2 hover:bg-slate-700 transition-colors border-mone  cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        // Corregido: w-10 (40px), sin comillas raras y clases válidas
                        className="!w-10 !h-10 !p-2 text-gray-400"
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
                    <DropdownMenuItem className="cursor-pointer hover:bg-blue-600/80 hover:text-white transition-colors duration-100 ease-in">Editar</DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-100 ease-in">Eliminar</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
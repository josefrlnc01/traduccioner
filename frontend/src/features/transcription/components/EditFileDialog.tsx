import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { editTitle } from '../api/savedsApi'
import { toast } from 'react-toastify'

type EditFileDialogProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: string,
    title: string
}
export default function EditFileDialog({isOpen, setIsOpen, id, title}: EditFileDialogProps) {
    const [newTitle, setNewTitle] = useState(title)
    const queryClient = useQueryClient()
    const editTitleFN = useMutation({
        mutationFn:editTitle,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['saveds']})
            toast.success(data)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }) 
    
    const handleTitle = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setNewTitle(e.target.value)
    }

    const handleEdit = () => {
        const formData = {
            id,
            newTitle
        }
        editTitleFN.mutate(formData)
        setIsOpen(false)
    }

    console.log('isopen', isOpen)
  return (
    <>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
        <button>Abrir</button>
    </DialogTrigger>
    <DialogContent className='bg-white'>
        <DialogHeader>
            <DialogTitle>Nuevo título</DialogTitle>
            <DialogDescription>
                <input onChange={handleTitle} type='text' value={newTitle} className='w-full p-2'/>
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <button className='flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer' onClick={() => setIsOpen(false)}>Cancelar</button>
            <button className='flex items-center gap-1.5 px-3 py-1.5 bg-blue-700/90 text-slate-300 hover:text-white hover:bg-blue-600 text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer' onClick={handleEdit}>Actualizar</button>
        </DialogFooter>
    </DialogContent>
</Dialog>
    </>
  )
}

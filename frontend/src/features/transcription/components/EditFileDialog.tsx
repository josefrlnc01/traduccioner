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
    id: string
}
export default function EditFileDialog({isOpen, setIsOpen, id}: EditFileDialogProps) {
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
    const [title, setTitle] = useState('')
    const handleTitle = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleEdit = () => {
        const formData = {
            id,
            title
        }
        editTitleFN.mutate(formData)
        setIsOpen(false)
    }
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
                <input onChange={handleTitle} type='text' className='w-full p-2'/>
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <button onClick={() => setIsOpen(false)}>Cancelar</button>
            <button onClick={handleEdit}>Actualizar</button>
        </DialogFooter>
    </DialogContent>
</Dialog>
    </>
  )
}

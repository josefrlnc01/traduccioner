import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog'
type ConfirmActionDialogProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    onConfirm: () => void,
    confirmText: string,
    children: React.ReactNode
}
export default function ConfirmActionDialog({ isOpen, setIsOpen, title, onConfirm, confirmText = 'Confirmar', children }: ConfirmActionDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        setIsOpen(false)
    }
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {/* El children es el trigger (el botón de "Eliminar", "Logout", etc.) */}
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>

                <DialogContent className='bg-slate-800 border-slate-700'>
                    <DialogHeader>
                        <DialogTitle className='text-white mb-3'>
                            {title}
                        </DialogTitle>
                    </DialogHeader>

                    <DialogFooter className='flex justify-around gap-2'>
                        <button
                            className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer'
                            onClick={() => setIsOpen(false)}
                        >
                            Cancelar
                        </button>

                        <button
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer bg-red-700/90 hover:bg-blue-600"`}
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

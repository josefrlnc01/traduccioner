import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
type ConfirmActionDialogProps = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    onConfirm: () => void,
    confirmText: string,
}
export default function ConfirmActionDialog({ isOpen, setIsOpen, title, onConfirm, confirmText = 'Confirmar'}: ConfirmActionDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        setIsOpen(false)
    }
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                
                <DialogContent className='bg-slate-900 border border-slate-700/50 text-white'>
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-600/50 cursor-pointer bg-red-700/90 hover:bg-red-600/90`}
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

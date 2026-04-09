import { useTheme } from '@/shared/context/ThemeContext'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Navigate, Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { subscriptionStore } from '@/shared/stores/user-suscription.store';
//Estilos para react toastify
const contextClass = {
    success: "bg-slate-900 border border-green-500/30 text-green-400",
    error: "bg-slate-900 border border-red-500/30 text-red-400",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
};
export default function PayLayout() {
    const {theme} = useTheme()
    const { data, isError, isLoading } = useAuth()
    useEffect(() => {
        subscriptionStore.set(data?.user.subscription!)
    })
    
    if (isLoading) {
        return (
            <aside className={`p-4 min-h-screen max-w-screen h-screen ${theme === 'dark' ? 'bg-[#101622]' : 'bg-slate-200'} flex flex-col gap-3 items-center text-white justify-center`}>
                <Spinner className="size-20" />
            </aside>
        )
    }

    if (isError) {
        return <Navigate to="/landing-page" replace />
    }

    if (!data) {
        return null
    }

    return (
        <>
        <main className={`min-w-screen max-w-screen overflow-x-hidden flex flex-col max-h-screen min-h-screen ${theme === 'dark' ? 'bg-[#101622] text-white' : 'bg-slate-100 text-slate-900'} `}>
            <Outlet />
        </main>
         <ToastContainer
                toastClassName={(context) =>
                    contextClass[context?.type || "default"] +
                    " relative flex items-center text-white min-w-10 min-h-10 rounded-xl px-6 py-3 mb-2 cursor-pointer shadow-xl border border-slate-700/50 text-white text-sm font-medium overflow-hidden"
                }
                closeButton={false}
                position='bottom-right'
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
        
    )
}

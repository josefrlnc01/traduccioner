import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Navigate } from 'react-router'
import { Outlet } from 'react-router'
import { Spinner } from '@/shared/components/ui/spinner'
import { SidebarProvider } from '@/shared/components/ui/sidebar'
import { AppSidebar } from '@/shared/components/AppSidebar'
import { tokenStore } from '@/lib/token.store'
import { useEffect } from 'react'
import { minutesStore } from '@/shared/stores/minutes.store'

export default function AppLayout({ children }: { children?: React.ReactNode }) {
    const { data, isError, isLoading } = useAuth()
    if (isLoading) {
        return (
            <aside className="p-4 min-h-screen max-w-screen h-screen bg-[#101622] flex flex-col gap-3 items-center text-white justify-center">
                <Spinner
                    className="size-20"
                />
            </aside>
        )
    }

    if (isError || !data) return <Navigate to={'/landing-page'} replace />

    console.log(data)
    if (data) {

        return (
            <>
                <SidebarProvider
                    defaultOpen={false}>
                    <AppSidebar />
                    
                    <main className='min-w-screen max-w-screen overflow-x-hidden max-h-screen min-h-screen bg-[#101622] text-white'>
                        
                        <Outlet />

                        {children}
                    </main>

                    <ToastContainer
                        pauseOnHover={false}
                        pauseOnFocusLoss={false}
                    />
                </SidebarProvider>
            </>
        )
    }

    return null
}


import { Outlet } from 'react-router'

export default function LandingLayout() {
    return (
        <main className='min-w-screen max-w-screen overflow-x-hidden max-h-screen min-h-screen bg-[#101622] text-white flex flex-col gap-20'>

            <Outlet />

        </main>
    )
}

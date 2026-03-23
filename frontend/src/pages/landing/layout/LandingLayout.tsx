
import { Outlet } from 'react-router'

export default function LandingLayout() {
    return (
        <main className='min-w-screen max-w-screen min-h-screen text-white flex flex-col gap-18'>

            <Outlet />

        </main>
    )
}

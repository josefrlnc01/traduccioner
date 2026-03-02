import { Outlet } from "react-router"
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export default function AuthLayout() {
    return (
        <>
            <section className='bg-gray-800 min-h-screen min-w-screen flex flex-col justify-center items-center lg:block h-screen w-screen overflow-x-hidden'>
                <aside className='p-2 lg:p-8 w-full lg:py-20 mx-auto'>

                    <div className='mt-10'>
                        <Outlet />
                    </div>
                </aside>
            </section>
        <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        />
        </>
    )
}

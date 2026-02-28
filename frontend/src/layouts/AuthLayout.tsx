import { Outlet } from "react-router"
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export default function AuthLayout() {
    return (
        <>
            <div className='bg-gray-800 min-h-screen'>
                <div className='py-10 lg:py-20 mx-auto w-112.5'>

                    <div className='mt-10'>
                        <Outlet />
                    </div>
                </div>
            </div>
        <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        />
        </>
    )
}

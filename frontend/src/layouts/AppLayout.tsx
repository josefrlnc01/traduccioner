
import { useAuth } from 'src/hooks/useAuth'
import { Link, Navigate } from 'react-router'
import { Outlet } from 'react-router'
export default function AppLayout() {
  const {data, isError, isLoading} = useAuth()

  if (isLoading) return 'Cargando...'
  
  if (isError) <Navigate to={'/auth/login'}/>


  if (data) {
    return (
    <>
    <header
    className='bg-gray-800 py-5'
    >
        <div className='max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center'>

            <div className='w-64'>
                <Link to={'/'}>
                
                </Link>
                
            </div>

        </div>

        
    </header>

    <section className='max-w-screen-2xl mx-auto mt-10 p-5'>
        <Outlet/>
    </section>
    

    <footer className='py-5'>
        <p className='text-center'>Derechos reservados</p>
    </footer>
    
    
    </>
)
  }
}

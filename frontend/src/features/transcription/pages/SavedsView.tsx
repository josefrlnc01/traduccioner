import { useQuery } from '@tanstack/react-query'
import { getSaved } from '../api/savedsApi'
import { useParams } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SavedFile from '../components/SavedFile'



export default function SavedsView() {
    const params = useParams()
    const id = params.id
    const { data, error } = useQuery({
        queryKey: ['saveds', id],
        queryFn: () => getSaved(id!),
        enabled: !!id
    })

    if (error) {
        return (
            <aside className="p-4 text-red-400 md:text-center">
                {error.message}
            </aside>
        )
    }

    if (data) {
        const file = data.file[0]
        if (!file) return

        return (
            <>
                
                <Header />
                <section className='w-full min-h-screen flex flex-col items-center justify-center p-2 md:p-0 py-12 md:py-20'>
                    <SavedFile data={file}  user={data.user} id={id!}/>
                </section>
                <Footer />
            </>
        )
    }
}

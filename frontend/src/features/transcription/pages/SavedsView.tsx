import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { generateIaSummary, getSaved } from '../api/savedsApi'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router'
import Header from '../components/Header'
import { formatTime } from '@/shared/utils/minutes'
import Footer from '../components/Footer'
import { generatePDF, generateSRT } from '@/features/document/api/documentApi'
import { DropdownMenuBasic } from '@/components/DropdownMenuBasic'
import EditFileDialog from '../components/EditFileDialog'
import { motion } from 'motion/react'
import Summary from '../components/SummarySection'
import SummarySection from '../components/SummarySection'
import { isAxiosError } from 'axios'
import { tokenStore } from '@/lib/token.store'
import { useSummary } from '../hooks/useSummary'
import { container, item } from '../stores/motion'
import SavedFile from '../components/SavedFile'
import { useEditFile } from '../hooks/useEditFIle'



export default function SavedsView() {
    const {isOpen, setIsOpen} = useEditFile()
    const [isReadySummary, setIsReadySummary] = useState(false)
    const { id } = useSummary()
    
    const { data, error } = useQuery({
        queryKey: ['saveds', id],
        queryFn: () => getSaved(id!),
        enabled: !!id
    })


    console.log(data)

   

    if (error) {
        return (
            <aside className="p-4 text-red-400 md:text-center">
                {error.message}
            </aside>
        )
    }

    if (data) {
        return (
            <>
                {isOpen && <EditFileDialog isOpen={isOpen} setIsOpen={setIsOpen} id={id!} title={data[0].title} />}
                <Header />
                <section className='w-full min-h-screen flex flex-col items-center justify-center py-12 md:py-20'>
                    <SavedFile data={data.file} setIsOpen={setIsOpen} user={data.user}/>
                </section>
                <Footer />
            </>
        )
    }

}

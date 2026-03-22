import Form from '@/features/transcription/components/Form'
import Footer from '@/features/transcription/components/Footer'

import Header from '../components/Header'
import SavedsList from '../components/SavedsList'

export default function MainView() {
  
  return (
    <>
    <section className='bg-[#101622] min-h-full flex flex-col justify-between'>
    <Header/>
    <Form/>
    <SavedsList/>
    <Footer/>
    </section>
    </>
  )
}

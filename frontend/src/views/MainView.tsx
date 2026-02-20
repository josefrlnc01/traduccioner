import React from 'react'
import FormView from './FormView'
import Header from '../components/Header'
import SubtitlesView from './SubtitlesView'

export default function MainView() {
  return (
    <>
    <main className='h-dvh h-vh max-h-vh w-vw bg-slate-950 flex flex-col'>
    <Header/>
    <FormView/>
   
    </main>
    </>
  )
}

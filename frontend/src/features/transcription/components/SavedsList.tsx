import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getSaveds } from '../api/savedsApi'
import { toast } from 'react-toastify'
import { file } from 'zod'
import { Link } from 'react-router'

export type Saveds = {
   _id: string,
  title: string,
  segments: {
    start:number,
    end:number,
    text:string
  }[],
  user: string,
 
}[]


export default function SavedsList() {
  const [files, setFiles] = useState<Saveds>([])
  const getSavedsFN = useMutation({
    mutationFn: getSaveds,
    onSuccess: (data) => {
      console.log(data.youtubeFiles)
      setFiles(data.youtubeFiles)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })


  useEffect(() => {
    getSavedsFN.mutate()
  }, [])

  
  return (
    <section className='w-1/2 min-w-1/2 m-auto flex flex-col justify-center items-center mb-10'>
        <div className='w-full flex flex-col gap-4'>
          {files.map(file => (
            <Link to={`/saveds/${file._id}`} className='bg-slate-800/70 p-6 rounded-md hover:bg-slate-700/90 hover:scale-105 transition-all duration-200 ease cursor-pointer' key={file._id}>
              {file.title}
            </Link>
          ))}
        </div>
    </section>
  )
}

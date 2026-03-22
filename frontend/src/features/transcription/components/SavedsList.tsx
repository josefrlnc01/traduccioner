import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getSaveds } from '../api/savedsApi'
import { toast } from 'react-toastify'
import { file } from 'zod'
import { Link } from 'react-router'

export type Saveds = {
   _id: string,
   fileId: string,
  title: string,
  segments: {
    start:number,
    end:number,
    text:string
  }[],
  duration: string,
  user: string,
}[]


export default function SavedsList() {
  const [files, setFiles] = useState<Saveds>([])
  const [youtubeFiles, setYoutubeFiles] = useState<Saveds>([])
  const getSavedsFN = useMutation({
    mutationFn: getSaveds,
    onSuccess: (data) => {
      setYoutubeFiles(data.youtubeFiles)
      setFiles(data.files)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })


  useEffect(() => {
    getSavedsFN.mutate()
  }, [])

  console.log(files)

  
  return (
    <section className='w-1/2 min-w-1/2 m-auto flex flex-col justify-center items-center mb-10'>
        <div className='w-full flex flex-col gap-4'>
          {files.map(file => (
            <Link to={`/saveds/${file.fileId}`} className='bg-slate-800/70 p-6 rounded-md hover:bg-slate-700/90 flex justify-between items-center hover:scale-105 transition-all duration-200 ease cursor-pointer' key={file._id}>
              <span>{file.title}</span>
              <span className='text-white min-w-18 flex justify-center items-center bg-blue-600 pt-1 pb-1 pl-3 pr-3 rounded-2xl'>{file.duration}</span>
            </Link>
          ))}
          {youtubeFiles.map(file => (
            <Link to={`/saveds/${file.fileId}`} className='bg-slate-800/70 p-6 rounded-md hover:bg-slate-700/90 flex justify-between items-center hover:scale-105 transition-all duration-200 ease cursor-pointer' key={file._id}>
              <span>{file.title}</span>
              <span className='text-white min-w-18 flex justify-center items-center bg-blue-600 pt-1 pb-1 pl-3 pr-3 rounded-2xl'>{file.duration}</span>
            </Link>
          ))}
        </div>
    </section>
  )
}

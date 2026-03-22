import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getSaveds } from '../api/savedsApi'
import { toast } from 'react-toastify'
import { file } from 'zod'

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
    <section className='w-4/5 min-w-4/5'>
        <ul>
          {files.map(file => (
            <li key={file._id}>${file.title}</li>
          ))}
        </ul>
    </section>
  )
}

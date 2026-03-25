import { useQuery } from '@tanstack/react-query'
import { getSaveds } from '../api/savedsApi'
import { Link } from 'react-router'

export type Saveds = {
  _id: string,
  fileId: string,
  title: string,
  segments: {
    start: number,
    end: number,
    text: string
  }[],
  duration: string,
  origin:string,
  user: string,
}[]


export default function SavedsList() {
  
  const {data} = useQuery({
    queryFn: getSaveds,
    queryKey: ['allSaveds']
  })
  

  if (!data) return <p>No hay datos</p>

    const files: Saveds = data.files
    const youtubeFiles: Saveds = data.youtubeFiles
    return (
    <aside className='w-full min-w-full p-4 md:p-0 md:w-3/4 md:min-w-3/4 lg:1/2 lg:min-w-1/2 m-auto flex flex-col justify-center items-center mb-10'>

      <div className='w-full flex flex-col gap-4'>

        {files.map(file => (
          <button key={file._id}>
            <Link to={`/saveds/${file.fileId}`} className='bg-slate-800/70 p-6 rounded-md hover:bg-slate-700/90 flex justify-between items-center hover:scale-105 transition-all duration-200 ease cursor-pointer' key={file._id}>
              <span>{file.title}</span>
              <span className='text-white min-w-18 flex justify-center items-center bg-blue-600 pt-1 pb-1 pl-3 pr-3 rounded-2xl'>{file.duration}</span>
            </Link>
          </button>
        ))}
        {youtubeFiles.map(file => (
          <button key={file._id}>
            <Link to={`/saveds/${file.fileId}`} className='bg-slate-800/70 p-6 rounded-md hover:bg-slate-700/90 flex justify-between items-center hover:scale-105 transition-all duration-200 ease cursor-pointer' key={file._id}>
              <span>{file.title}</span>
              <span className='text-white min-w-18 flex justify-center items-center bg-blue-600 pt-1 pb-1 pl-3 pr-3 rounded-2xl'>{file.duration}</span>
            </Link>
          </button>


        ))}
      </div>
    </aside>
  )
  

}

import { useQuery } from '@tanstack/react-query'
import { getSaveds } from '../api/savedsApi'
import { Link } from 'react-router'
import { useState } from 'react'
import { useTheme } from '@/shared/context/ThemeContext'

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
  origin: string,
  user: string,
}[]

type SavedsList = {
  files: Saveds,
  youtubeFiles: Saveds
}

export default function SavedsList() {
  const { theme } = useTheme()
  const [inputValue, setInputValue] = useState('')
  const { data } = useQuery<SavedsList>({
    queryFn: getSaveds,
    queryKey: ['allSaveds']
  })

  if (data?.files.length === 0 || data?.youtubeFiles.length === 0 || !data) return ''

  

  const files: Saveds = data?.files
  const youtubeFiles: Saveds = data?.youtubeFiles

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
  }

  const filteredsFile = files.filter(file => file.title.toLowerCase().includes(inputValue.toLowerCase()))
  const filteredsYoutube = youtubeFiles.filter(file => file.title.toLowerCase().includes(inputValue))
  const filtereds = filteredsFile.concat(filteredsYoutube)
  return (

      <>
        <section className='w-full p-2 md:p-0'>
          <aside className={`w-full relative mt-0 ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-100 border border-gray-100 shadow'} lg:w-2/4 md:w-3/4 p-4 rounded-xl  m-auto flex flex-col justify-center items-center mb-10`}>
            <div className='flex flex-col gap-2 justify-center items-center mb-6'>
              <h2 className='font-bold text-lg md:text-xl lg:text-2xl'>Archivos transcritos</h2>
              <span className='text-sm md:text-lg text-gray-400'>Pulsa sobre uno para acceder a su contenido</span>
            </div>
            <div className='w-full flex flex-col gap-4'>
              <input
                value={inputValue}
                onChange={handleInputValue}
                placeholder="Buscar archivo..."
                className={`w-full pl-9 pr-3 py-3 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700 text-gray-200' : 'bg-slate-200 text-slate-900'} rounded-lg text-sm  placeholder-slate-400 focus:outline-none focus:border-blue-500`}
              />
              {filtereds.length === 0 &&
                <>

                  {files.map(file => (
                    <button key={file._id}>
                      <Link to={`/saveds/${file.fileId}`} className={`${theme === 'dark' ? 'bg-slate-800/70  hover:bg-slate-700/90' : 'bg-slate-300 hover:bg-slate-200'} p-4 md:p-6 gap-2 rounded-md flex justify-between items-center hover:scale-105 transition-all duration-200 ease cursor-pointer`} key={file._id}>
                        <h4 className='wrap-break-word text-start text-sm md:text-md'>{file.title}</h4>
                        <span className='text-white min-w-20 max-w-xs text-xs md:text-sm flex justify-center items-center bg-blue-600 pt-1 pb-1 pl-2 pr-2 rounded-2xl'>{file.duration}</span>
                      </Link>
                    </button>
                  ))}
                  {youtubeFiles.map(file => (
                    <button key={file._id}>
                      <Link to={`/saveds/${file.fileId}`} className={`${theme === 'dark' ? 'bg-slate-800/70  hover:bg-slate-700/90' : 'bg-slate-300 hover:bg-slate-200'} p-4 md:p-6 gap-2 rounded-md flex justify-between items-center hover:scale-105 transition-all duration-200 ease cursor-pointer`} key={file._id}>
                        <h4 className='wrap-break-word text-start text-sm md:text-md'>{file.title}</h4>
                        <span className='text-white min-w-20 max-w-xs text-xs md:text-sm flex justify-center items-center bg-blue-600 pt-1 pb-1 pl-2 pr-2 rounded-2xl'>{file.duration}</span>
                      </Link>
                    </button>
                  ))}
                </>}

              {(filtereds.length > 0) &&
                <>
                  <div className="w-full mb-6">
                  </div>
                  {filtereds.map(file => (
                    <button key={file._id}>
                      <Link to={`/saveds/${file.fileId}`} className={`${theme === 'dark' ? 'bg-slate-800/70  hover:bg-slate-700/90' : 'bg-slate-300 hover:bg-slate-200'} p-4 md:p-6 gap-2 rounded-md flex justify-between items-center hover:scale-105 transition-all duration-200 ease cursor-pointer`} key={file._id}>
                        <h4 className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'} max-w-xs wrap-break-word text-start text-sm md:text-md`}>{file.title}</h4>
                        <span className={`text-white min-w-20 text-xs md:text-sm flex justify-center items-center bg-blue-600 pt-1 pb-1 pl-2 pr-2 rounded-2xl`}>{file.duration}</span>
                      </Link>
                    </button>
                  ))}
                </>
              }
            </div>
          </aside>
        </section>
      </>

  )


}

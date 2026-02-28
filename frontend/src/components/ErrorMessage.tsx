import React from 'react'

export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <div className='text-center text-red-500 text-md font-bol'>
      {children}
    </div>
  )
}

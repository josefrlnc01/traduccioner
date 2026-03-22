import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { getSaved } from '../api/savedsApi'
import { toast } from 'react-toastify'
import { useParams } from 'react-router'

export default function SavedsView() {
    const params = useParams()

    const id = params.id
    const { data, error } = useQuery({
        queryKey: ['saveds', id],
        queryFn: () => getSaved(id!),
        enabled: !id
    })

    if (error) {
        return (
            <aside className="p-4 text-red-400 md:text-center">
                {error.message}
            </aside>
        )
    }

    if (data) {
        console.log(data)
        return (
            <section className='w-screen min-w-screen h-full min-h-full'>
                seccion
            </section>
        )
    }

}

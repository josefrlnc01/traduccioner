import { sendLink } from "@/services/sendLink"
import { useQuery } from "@tanstack/react-query"
import type { UseMutationResult} from "@tanstack/react-query";
import type { MutationProps } from "./FormView";
type SubtitlesViewProps = {
    mutation:  UseMutationResult<{
    message: string;
} | undefined, Error, MutationProps, unknown>
}
export default function SubtitlesView({ mutation}: SubtitlesViewProps) {

    

    if (mutation.isPending) {
    return (
      <div className="p-4 text-white">
        Cargando subtítulos...
      </div>
    )
  }

    if (mutation.isError) {
        return (
            <div className="p-4 text-red-500">
                Error al cargar los subtítulos
            </div>
        )
    }

    if (!mutation.isSuccess) {
        return (
            <div className="p-4 text-gray-400">
                Pega un enlace para ver los subtítulos
            </div>
        )
    }


   
    return (

        <section className='flex flex-col lg:items-center  p-4 rounded-xl  overflow-y-scroll'>
            <aside className='rounded-xl bg-slate-900'>
                <div className='flex flex-col justify-start items-start p-6'>
                    <h2 className='scroll-m-20 text-3xl font-semibold tracking-tight text-gray-200 self-end'>Eminem - 8Mille</h2>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-300'>Texto de prueba mas largo de lo corriente</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
                <div className='flex flex-col justify-start items-start p-6'>
                    <p className='font-bold text-2xl text-gray-200'>Texto de prueba</p>
                </div>
            </aside>

        </section>
    )


}

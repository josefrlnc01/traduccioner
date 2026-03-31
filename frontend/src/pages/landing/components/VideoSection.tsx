import video from '@/assets/presentation.webm'
export default function VideoSection() {

    return (
        <section className='w-full min-w-screen p-6 flex flex-col gap-4 justify-center items-center grow mt-10'>
            <video autoPlay muted loop playsInline preload='none' className='w-full max-w-7xl rounded-2xl shadow-2xl border border-slate-800 mx-auto' src={video}></video>
        </section>
    )
}

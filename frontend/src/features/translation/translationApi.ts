import axios, { isAxiosError } from "axios";
const urlBackend = import.meta.env.VITE_API_URL
type TranslateTextProps = {
    lang: string,
    fileText: {
        start:number,
        end:number,
        text:string
    }[]
}

type TranslateYoutubeTextProps = {
    lang: string,
    youtubeVideoText: {
        start:number,
        end:number,
        text:string
    }[]
}

export async function translateText ({lang, fileText}: TranslateTextProps) {
    try {
        console.log('consulta iniciada')
        const {data} = await axios.post(`${urlBackend}/translation/${lang}`, {fileText})

        return data
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errror)
        }
    }
}

export async function translateYoutubeText ({lang, youtubeVideoText}: TranslateYoutubeTextProps) {
    try {
        console.log('petición iniciada')
        const {data} = await axios.post(`${urlBackend}/translation/${lang}/youtube`, {youtubeVideoText})

        return data
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errror)
        }
    }
}
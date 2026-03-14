import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs/promises'

export function getVideoMinutes(data:string){
    const indexM:number = data.indexOf("M")
    const minute = data[indexM - 1]

    //Si el formato pthms tiene mas de 7 caracteres es mayor a 10 min y no continuamos el flujo normal
    if (data.length > 7) {
        throw new Error("Video demasiado largo")
    } else {
        return minute
    }
}


//Conversión de formatos de audio/video a audio.mp3
export async function convertVideoToAudio (audioPath: string) {
    const finalFilePath = 'audioConverted.mp3'
    ffmpeg(audioPath)
        .toFormat("mp3")
        .on('end', () => {
            
            console.log('conversión realizada')
        })
        .on('error', (err) => {
            console.error(err)
        })
        .saveToFile(finalFilePath)

    //Borramos archivo .mp4 que recibimos por multer y guardamos en uploads del input del usuario
    await fs.unlink(audioPath)
    //Devolvemos ruta en la que se guarda el archivo .mp3
    return finalFilePath
} 
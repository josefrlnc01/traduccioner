import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs/promises'
import path from 'node:path'

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
export async function convertVideoToAudio (file: Express.Multer.File): Promise<string> {
    console.log('filepath', file.path)
    const finalFilePath = file.path.replace(path.extname(file.path), '_converted.mp3')
    return new Promise((resolve, reject) => {
        ffmpeg(file.path)
        .toFormat("mp3")
        .on('end', async () => {
            console.log('conversión realizada')
            await fs.unlink(file.path)
            resolve(finalFilePath)
            
        })
        .on('error', (err) => {
            reject(err)
        })
        .saveToFile(finalFilePath)
    })
} 
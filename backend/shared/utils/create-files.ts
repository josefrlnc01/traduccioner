import pdf from 'html-pdf'
import fs from 'node:fs/promises'
import { AppError } from '../../modules/errors/AppError.js'



export async function generatePdf (text: string) {
    const contenido = `<aside>
        ${text}
        </aside>`

    if (!text) {
        throw new AppError('No hay contenido con el que generar el pdf', 400)
    }

    return new Promise ((resolve, reject) => {
        pdf.create(contenido).toFile('document.pdf', (err, res) => {
        if (err) return reject(err)
        const buffer = fs.readFile(res.filename)
        resolve(buffer)
    })
    })
}


export async function generateSrt (segments: {start: number, end:number, text:string}[]) {
    return segments.map((segment,i) => {
        const start = formatSRTTime(segment.start)
        const end = formatSRTTime(segment.end)
        return `${i + 1}\n${start} ---> ${end}\n ${segment.text.trim()}\n`
    }).join('\n')
}


function formatSRTTime (seconds: number):string {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours().toString().padStart(2, '0')
    const mm = date.getUTCMinutes().toString().padStart(2, '0')
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    const ms = date.getUTCMilliseconds().toString().padStart(2, '0')
    return `${hh}:${mm}:${ss},${ms}`
}
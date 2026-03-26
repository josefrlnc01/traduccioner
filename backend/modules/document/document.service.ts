import { AppError } from "../errors/AppError.js"
import pdf from 'html-pdf'
import fs from 'node:fs/promises'
import { formatSRTTime, formatTime, formatVTTTime } from "../../shared/utils/time.js"


export class DocumentService {
    static generatePdf = async (text: string) => {
        const contenido = `<aside>
                ${text}
                </aside>`

        if (!text) {
            throw new AppError('No hay contenido con el que generar el pdf', 400)
        }

        return new Promise((resolve, reject) => {
            pdf.create(contenido).toFile('document.pdf', (err, res) => {
                if (err) return reject(err)
                const buffer = fs.readFile(res.filename)
                resolve(buffer)
            })
        })
    }


    static generateSrt = async (segments: { start: number, end: number, text: string }[]) => {
        return segments.map((segment, i) => {
            const start = formatSRTTime(segment.start)
            const end = formatSRTTime(segment.end)
            return `${i + 1}\n${start} ---> ${end}\n ${segment.text.trim()}\n`
        }).join('\n')
    }


    static generateVtt = async (segments: { start: number, end: number, text: string }[]) => {
        const body = segments.map(s => `
            ${formatVTTTime(s.start)} ---> ${formatVTTTime(s.end)}
            ${s.text}
            `.trim()).join('\n\n')

        return `WEBVTT\n\n${body}`
    }


    static generateTxt = async (segments: { start: number, end: number, text: string }[]) => {
        return segments.map((segment) => {
            const start = formatTime(segment.start)
            const end = formatTime(segment.end)
            return `${start}${end} ${segment.text}`
        }).join('\n')
    }
}
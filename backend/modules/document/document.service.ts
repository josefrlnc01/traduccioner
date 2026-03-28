import { AppError } from "../errors/AppError.js"
import pdf from 'html-pdf'
import { formatSRTTime, formatTime, formatVTTTime } from "../../shared/utils/time.js"
import { Document, Packer, Paragraph, TextRun } from "docx"
import {stringify} from 'csv-stringify/sync'
import fsSync from 'node:fs'

export class DocumentService {
    static generatePdf = async (segments:{start: number, end:number, text: string}[]) => {
        const text = segments.map(s => `${formatTime(s.start)}:${formatTime(s.end)} ${s.text}`)
        const contenido = `<aside>
                ${text}
                </aside>`

        if (!text) {
            throw new AppError('No hay contenido con el que generar el pdf', 400)
        }

        return new Promise((resolve, reject) => {
            pdf.create(contenido).toBuffer((err, buffer) => {
                if (err) return reject(err)
                if (!buffer) return reject(new Error('No se pudo generar el buffer del PDF'))
                resolve(buffer)
            })
        })
    }


    static generateSrt = async (segments: { start: number, end: number, text: string }[]) => {
        return segments.map((segment, i) => {
            const start = formatSRTTime(segment.start)
            const end = formatSRTTime(segment.end)
            return `${i + 1}\n${start} --> ${end}\n${segment.text.trim()}`
        }).join('\n\n')
    }


    static generateVtt = async (segments: { start: number, end: number, text: string }[]) => {
        const body = segments.map(s => `
            ${formatVTTTime(s.start)} --> ${formatVTTTime(s.end)}
            ${s.text}
            `.trim()).join('\n\n')

        return `WEBVTT\n\n${body}`
    }


    static generateTxt = async (segments: { start: number, end: number, text: string }[]) => {
        return segments.map((segment) => {
            const start = formatTime(segment.start)
            const end = formatTime(segment.end)
            return `${start}:${end} ${segment.text}`
        }).join('\n')
    }


    static generateDocX = async (segments:{start:number, end: number, text:string}[]) => {
        const paragraphs = segments.map(seg => 
            new Paragraph({
                spacing: {after: 200},
                children: [
                    new TextRun({
                        text: `${formatTime((seg.start))} `,
                        color: '666666',
                        font: 'Courier New'
                    }),
                    new TextRun({
                        text: seg.text,
                        bold: true,
                        size: 24
                    })
                ]

            })
        )

        const doc = new Document({
            sections: [
                {children: paragraphs}
            ]
        })

        const buffer = await Packer.toBuffer(doc)


        return buffer
    }


    static generateJson = async (segments:{start: number, end: number, text: string}[]) => {
        const document = segments.map(s => {
            const start = s.start
            const end = s.end
            return {
                start,
                end,
                text: s.text
            }
        })

        const jsonDocument = JSON.stringify(document, null, 2)
        return jsonDocument
    }


    static generateCsv = async (segments:{start: number, end: number, text: string }[]) => {
        const rows = segments.map(s => [formatTime(s.start), formatTime(s.end), s.text ])
        const data = stringify([
            ["start", "end", "text"],
            ...rows
        ])
        fsSync.writeFileSync('transcription.csv', data)
        return data
    }
}
import pdf from 'html-pdf'
import fs from 'node:fs/promises'
export async function generatePdf (text: string) {
    console.log('text', text)
    const contenido = `<aside>
        ${text}
        </aside>`

    if (!text) {
        throw new Error('No hay contenido con el que generar el pdf')
    }

    return new Promise ((resolve, reject) => {
        pdf.create(contenido).toFile('document.pdf', (err, res) => {
        if (err) return reject(err)
        const buffer = fs.readFile(res.filename)
        resolve(buffer)
    })
    })
}
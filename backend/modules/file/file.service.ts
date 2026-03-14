import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { InsertFileTranscriptionProps, InsertFileTranslationProps } from './file.types.js'
import FileModel from './file.model.js'
import { error } from 'node:console'


export class FileService {
    static createPathForFile = async (file: Express.Multer.File) => {
        try {
            const __fileName = fileURLToPath(import.meta.url)
            const __dirname = dirname(__fileName)
            const rutaArchivo = path.join(__dirname, '..', '..', 'archivos.json')
            const fileName = file.filename
            const fileIn = await fileExists()
            if (!fileIn) {
                await fs.writeFile(rutaArchivo, JSON.stringify([]), "utf-8")
            }
            //Creación de archivo de control de audios del usuario
            const archivo = await fs.readFile(rutaArchivo, "utf-8")
            const archivoParseado = JSON.parse(archivo)

            const nombreArchivo = {
                nombre: fileName
            }

            //Creación de ruta de audios introducidos por el usuario
            const filePath = path.join(process.cwd(), 'uploads', fileName)
            archivoParseado.push(nombreArchivo)
            await fs.writeFile(rutaArchivo, JSON.stringify(archivoParseado, null, 2), "utf-8")
            return filePath
        } catch {
            throw new Error('Hubo un error al crear el archivo de nombres')
        }
    }

    static insertTranscription = async ({ data, user }: InsertFileTranscriptionProps) => {
        try {
            const fileExists = await FileModel.findOne({
                user: user,
                fileText: data.fileText
            })

            if (fileExists) {
                throw new Error('Este documento ya existe')
            }

            const transcription = new FileModel()
            transcription.title = data.title
            transcription.fileText = data.fileText
            transcription.comment = data.comment
            transcription.user = user._id
            await transcription.save()
        } catch (error: any) {
            if (error?.code === 1100) {
                throw new Error('Este documento ya existe')
            }
            throw new Error('Hubo un error al guardar la transcripción')
        }
    }


    static insertTranslation = async ({ data, user }: InsertFileTranslationProps) => {
        try {
        const fileExists = await FileModel.findOne({
            user: user,
            translatedFile: data.translatedFile
        })

        if (fileExists) {
            throw new Error('Este documento ya existe')
        }

        const translation = new FileModel()

        translation.title = data.title
        translation.comment = data.comment
        translation.translatedFile = data.translatedFile

        translation.user = user._id
        await translation.save()
    } catch (error: any) {
        if (error?.code === 1100) {
            throw new Error('Este documento ya existe')
        }
        console.log(error)
        throw new Error('Hubo un error al guardar la traducción')
    }
    }
}


async function fileExists() {
    try {
        const backendDir = process.cwd();
        const base = path.join(backendDir, 'archivos');
        const filepath = base + '.json';
        console.log(filepath)
        await fs.access(filepath);
        return true;
    }
    catch {
        return false;
    }
}


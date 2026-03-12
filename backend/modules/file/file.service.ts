import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { InsertFileProps } from './file.types.js'
import FileModel from './file.model.js'
import { error } from 'node:console'

export async function createPath(file: Express.Multer.File): Promise<string> {
    try {
        const __fileName = fileURLToPath(import.meta.url)
        const __dirname = dirname(__fileName)
        const rutaArchivo = path.join(__dirname, '..', '..', 'archivos.json')
        const fileName = file.filename
        const fileIn = await fileExists()
        if (!fileIn) {
            await fs.writeFile(rutaArchivo, JSON.stringify([]), "utf-8")
        }

        const archivo = await fs.readFile(rutaArchivo, "utf-8")
        const archivoParseado = JSON.parse(archivo)

        const nombreArchivo = {
            nombre: fileName
        }
        const filePath = path.join(process.cwd(), 'uploads', fileName)
        archivoParseado.push(nombreArchivo)
        await fs.writeFile(rutaArchivo, JSON.stringify(archivoParseado, null, 2), "utf-8")
        return filePath
    } catch  {
        throw new Error('Hubo un error al crear el archivo de nombres')
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


export async function insert ({fileText, translatedFile, user}: InsertFileProps) {
    try {
        const fileExists = await FileModel.findOne({
            user: user,
            fileText: fileText
        })

        if (fileExists) {
            throw new Error('Este documento ya existe')
        }

        const file = new FileModel()
        file.fileText = fileText
        file.translatedFile = translatedFile
        file.user = user._id
        await file.save()
    } catch (error:any) {
        if (error?.code === 1100) {
            throw new Error('Este documento ya existe')
        }
        throw new Error('Hubo un error al guardar la transcripción')
    }
}
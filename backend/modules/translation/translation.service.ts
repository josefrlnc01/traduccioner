import {v2} from "@google-cloud/translate"

const {Translate} = v2

const translate = new Translate({
    projectId: process.env.PROJECT_ID
})

export async function translateText(lang:string | null = null, text:string) {
    console.log('lenguaje', lang)
    if (!lang) return "Debes especificar un lenguaje"

    const [translation] = await translate.translate(text, lang)

    if (!translation) return "Hubo un error durante la traducción"
    return translation
}


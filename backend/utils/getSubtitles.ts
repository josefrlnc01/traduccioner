import {parseSync} from 'subtitle'
import ytdlp from 'yt-dlp-exec'
import axios from 'axios'


export async function getSubtitlesFromVideo (link:string): Promise<Object>{

    try {
        const info = await ytdlp(link, {
            dumpSingleJson:true,
            skipDownload: true,
            writeSub: true,
            subLang:'en'
        })
        const subtitles = (info.requested_subtitles as Record<string, any>)?.en?.url  

        const response = await axios.get(subtitles)
        const parsed = parseSync(response.data)
        return parsed
    } catch (err) {
        console.error(err)
        return {}
    }

}
import { Worker } from "bullmq";
import { convertVideoToAudio } from "../shared/utils/video.js";
import { FileService } from "../modules/file/file.service.js";
import { connection } from "../config/queue.js";
import { YoutubeVideoService } from "../modules/youtube-video/youtube-video.service.js";

export const fileTranscriptionWorker = new Worker('fileTranscription', async (job) => {
    const { file, user, ip, title } = job.data

    const finalFilePath = await convertVideoToAudio(file)


    const { fileText, usedMinutes, audioDuration } = await FileService.getTranscriptionFromAudio(finalFilePath, user, ip)
    const savedFile = await FileService.insertTranscription({ fileText, user, title, duration: audioDuration })

    return { savedFile, usedMinutes, user }
}, {
    connection,
    concurrency: 2
})


fileTranscriptionWorker.on('failed', (error) => {
    console.error(error)
})


export const youtubeTranscriptionWorker = new Worker('youtubeTranscription', async (job) => {
    const {user, ip} = job.data
    const data = await YoutubeVideoService.getTranscriptionFromAudio(user, ip)

    const { youtubeVideoText, usedMinutes, title, audioDuration } = data
    const savedYoutubeFile = await YoutubeVideoService.insertTranscription({ youtubeVideoText, user, title, duration: audioDuration })

    return {savedYoutubeFile, usedMinutes, user}
}, {
    connection,
    concurrency: 2
})

youtubeTranscriptionWorker.on('failed', (error) => {
    console.error(error)
})
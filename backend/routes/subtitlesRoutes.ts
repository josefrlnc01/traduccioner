import {Router} from 'express'
import { SubtitlesController } from '../controllers/SubtitlesController.ts'

export const subtitlesRouter = Router()

subtitlesRouter.get('/:id', SubtitlesController.obtainSubtitles)
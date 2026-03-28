import { Router } from "express";
import { YoutubeVideoController } from "./youtube-video.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { checkQuota } from "../../shared/middlewares/quota.middleware.js";

export const youtubeVideoRoute = Router()

youtubeVideoRoute.post('/', authenticate, checkQuota, YoutubeVideoController.init)
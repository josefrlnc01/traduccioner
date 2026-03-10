import { Router } from "express";
import { LinkController } from "./link.controller.js";
import { validateProcessVideo } from "../../shared/middlewares/video.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { checkQuota } from "../../shared/middlewares/quota.middleware.js";

export const mainRoute = Router()

mainRoute.post('/:lang',authenticate, checkQuota, validateProcessVideo, LinkController.init)


import { Router } from "express";
import { init } from "../controllers/MainController.js";
import { validateProcessVideo } from "../shared/middlewares/video.middleware.js";

export const mainRoute = Router()

mainRoute.post('/', validateProcessVideo, init)


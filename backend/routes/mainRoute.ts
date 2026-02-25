import { Router } from "express";
import { init } from "../controllers/MainController.js";
import { validateProcessVideo } from "../middlewares/corsOptions.js";

export const mainRoute = Router()

mainRoute.post('/', validateProcessVideo, init)


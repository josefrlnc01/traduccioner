import { Router } from "express";
import { init } from "../controllers/MainController.js";

export const mainRoute = Router()

mainRoute.post('/', init)


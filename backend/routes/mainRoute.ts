import { Router } from "express";
import { MainController } from "../controllers/MainController.ts";

export const mainRoute = Router()

mainRoute.post('/', MainController.init)


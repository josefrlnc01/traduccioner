import { Router } from "express";
import { init } from "../controllers/MainController";

export const mainRoute = Router()

mainRoute.post('/', init)


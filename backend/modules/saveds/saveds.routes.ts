import { Router } from "express";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { SavedsController } from "./saveds.controller.js";

export const savedsRoute = Router()

savedsRoute.get('/', authenticate, SavedsController.getSaveds)
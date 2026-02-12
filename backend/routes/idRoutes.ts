import { Router } from "express";
import type { Request, Response } from "express";
import { IdController } from "../controllers/IdController.ts";

export const idRoutes = Router()

idRoutes.post('/', IdController.obtainId)


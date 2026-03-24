import { Router } from "express";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { SavedsController } from "./saveds.controller.js";

export const savedsRoute = Router()

savedsRoute.get('/', authenticate, SavedsController.getSaveds)
savedsRoute.get('/:id', authenticate, SavedsController.getSavedById)
savedsRoute.post('/:id/summary', authenticate, SavedsController.generateIaSummary)
savedsRoute.patch('/:id', authenticate, SavedsController.editTitle)
savedsRoute.delete('/:id', authenticate, SavedsController.deleteOne)
import { Router } from "express";
import { DocumentController } from "./document.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";

export const documentRoute = Router()

documentRoute.post('/create-pdf', authenticate, DocumentController.createPDF)
documentRoute.post('/create-srt', authenticate, DocumentController.createSRT)
documentRoute.post('/create-txt', authenticate, DocumentController.createTXT)
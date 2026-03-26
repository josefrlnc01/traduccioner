import { Router } from "express";
import { DocumentController } from "./document.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";

export const documentRoute = Router()

documentRoute.post('/create-pdf', authenticate, DocumentController.createPDF)
documentRoute.post('/create-srt', authenticate, DocumentController.createSRT)
documentRoute.post('/create-vtt', authenticate, DocumentController.createVTT)
documentRoute.post('/create-txt', authenticate, DocumentController.createTXT)
documentRoute.post('/create-json', authenticate, DocumentController.createJSON)
documentRoute.post('/create-docx', authenticate, DocumentController.createDOCX)
documentRoute.post('/create-csv', authenticate, DocumentController.createCSV)



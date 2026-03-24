import { Router } from "express";
import { TranslationController } from "./translation.controller.js";

export const translationRoutes = Router()

translationRoutes.post('/:lang', TranslationController.getTranslation)
translationRoutes.post('/:lang/youtube', TranslationController.getYoutubeTranslation)
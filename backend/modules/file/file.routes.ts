import { Router } from "express";
import { FileController } from "./file.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { checkQuota } from "../../shared/middlewares/quota.middleware.js";
import { upload } from "./multer/multer.config.js";


export const fileRoute = Router()

fileRoute.post('/', authenticate, checkQuota, upload.single('audio'), FileController.init)
fileRoute.post('/:jobId', authenticate, checkQuota, FileController.getJobStatus)
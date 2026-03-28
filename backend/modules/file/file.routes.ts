import { Router } from "express";
import multer from "multer";
import { FileController } from "./file.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { checkQuota } from "../../shared/middlewares/quota.middleware.js";
import fs from "node:fs";
import path from "node:path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync('uploads', { recursive: true })
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage})
export const fileRoute = Router()

fileRoute.post('/', authenticate, checkQuota, upload.single('audio'), FileController.init)

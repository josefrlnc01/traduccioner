import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authRoute = Router()


authRoute.post('/create-account', AuthController.createAccount)
authRoute.post('/confirm-account', AuthController.confirmAccount)
authRoute.get('/user', AuthController.user)
import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { authenticate } from "../middlewares/auth.js";

export const authRoute = Router()


authRoute.post('/create-account', AuthController.createAccount)
authRoute.post('/confirm-account', AuthController.confirmAccount)
authRoute.post('/authenticate-account', AuthController.authenticateAndLogin)
authRoute.post('/resend-confirmation-token', AuthController.resetAccountConfirmationToken)
authRoute.get('/user',authenticate, AuthController.user)
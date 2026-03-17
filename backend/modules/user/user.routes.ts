import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";

export const userRoutes = Router()

userRoutes.delete('/delete', authenticate, UserController.deleteUser)
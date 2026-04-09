import { Router } from "express";
import { StripeController } from "./stripe.controller.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
export const stripeRoutes = Router()

stripeRoutes.post('/create-checkout-session', authenticate, StripeController.createCheckout)
stripeRoutes.post('/create-portal-session', StripeController.createPortalSession)
stripeRoutes.delete('/cancel-subscription',authenticate, StripeController.cancelSubscription)

import Stripe from 'stripe'
import { getRequiredEnv } from '../../shared/utils/variables.js';
import { Request, Response } from 'express';
import { StripeService } from './stripe.service.js';
import { AppError } from '../errors/AppError.js';



export class StripeController {
    static createCheckout = async (req: Request, res: Response) => {
        try {
            const user = req.user
            const price_id = req.body.price_id
            
            const session = await StripeService.checkout(price_id, user)
            if (!session) {
                return res.status(400).json('Error al procesar el pago')
            }
            if ('updated' in session) {
                return res.status(200).json({message: 'Plan actualizado correctamente'})
            }
            

            
            console.log('session url', session.url)
            res.status(200).json({url: session.url})
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            if (error instanceof Stripe.errors.StripeError) {
                return res.status(error.statusCode || 400).json({ error: error.message })
            }
            console.error('Stripe checkout error:', error)
            return res.status(500).json({ error: 'Hubo un error en el checkout' })
        }
    }


    static createPortalSession = async (req: Request, res: Response) => {
        try {
            const { session_id } = req.body;
            const portalSession = await StripeService.session(session_id)
            if (!portalSession || !portalSession.return_url) {
                return res.status(400).json('Error al procesar el pago')
            }
            console.log('sessiobn id', session_id)
            
            res.status(200).json({url: portalSession.url})
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            if (error instanceof Stripe.errors.StripeError) {
                return res.status(error.statusCode || 400).json({ error: error.message })
            }
            console.error('Stripe portal error:', error)
            return res.status(500).json({ error: 'Hubo un error en el checkout' })
        }
    }



    static createWebHook = async (req: Request, res: Response) => {
        try {
            const signature = req.headers['stripe-signature'];
            const body = req.body
            await StripeService.webHook(signature, body, res)
        } catch (error) {
            return res.status(500).json({error: 'Hubo un error en el webhook'})
        }
    }


    static cancelSubscription = async (req: Request, res: Response) => {
        try {
            const user = req.user
            await StripeService.cancel(user)
            
            return res.status(200).json({message: 'Suscripción cancelada'})
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al cancelar la suscripción'})
        }
    }


}



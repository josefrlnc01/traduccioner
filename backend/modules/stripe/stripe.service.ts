import Stripe from "stripe";
import { getRequiredEnv } from "../../shared/utils/variables.js";
import User, { IUser } from "../user/user.model.js";
import { AppError } from "../errors/AppError.js";
import StripeEvent from "./stripe.model.js";

const isProd = process.env.NODE_ENV === 'production'
const stripeKey = isProd ? getRequiredEnv('STRIPE_SECRET_KEY') : getRequiredEnv('STRIPE_SECRET_KEY_DEV')
const stripe = new Stripe(stripeKey)

type WebhookPayload = string | Buffer;
type CheckoutResult = Stripe.Checkout.Session | { url: null, updated: true }

const urlFrontend = isProd ? process.env.FRONTEND_URL ?? process.env.FRONTEND_URL_WWW : process.env.FRONTEND_URL_DEV
export class StripeService {
    static checkout = async (price_id: string, user: IUser): Promise<CheckoutResult> => {
        if (!urlFrontend) {
            throw new AppError('Falta configurar FRONTEND_URL_DEV en el backend', 500)
        }

        if (!price_id) {
            throw new AppError('Falta el price_id para iniciar el checkout', 400)
        }

        if (user.subscription === 'pro' && price_id === 'price_1TI5NFBjujyKH7kY3CSAJ0fp') {
            throw new AppError('La suscripción ya está activa', 400)
        }

        if (user.subscription === 'business' && price_id === 'price_1TJA7HBjujyKH7kY2UvGiQyk') {
            throw new AppError('La suscripción ya está activa', 400)
        }

        //Si ya hay una suscripción activa y se intenta comprar otra no se crea sesión, directamente se actualiza
        if (user.stripeSubscriptionId) {

            const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)
            await stripe.subscriptions.update(user.stripeSubscriptionId, {
                items: [{
                    id: subscription.items.data[0].id,
                    price: price_id
                }],
                proration_behavior: 'always_invoice'
            })
            const session = {
                url: null,
                updated: true
            } as const
            return session
        } else {
            const session = await stripe.checkout.sessions.create({
                billing_address_collection: 'auto',
                line_items: [
                    {
                        price: price_id,
                        // For usage-based billing, don't pass quantity
                        quantity: 1,

                    },
                ],
                metadata: {
                    userId: user._id.toString(),
                    priceId: price_id
                },
                customer_email: user.email,
                mode: 'subscription',
                success_url: `${urlFrontend}/payment/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${urlFrontend}/payment/?canceled=true`,
            });
            return session
        }
    }


    static session = async (session_id: string) => {
        if (!urlFrontend) {
            throw new AppError('Falta configurar FRONTEND_URL_DEV en el backend', 500)
        }

        if (!session_id) {
            throw new AppError('Falta session_id para abrir el portal de Stripe', 400)
        }

        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

        // URL que redirige al usuario cuando ha terminado de administrar la sesión
        const returnUrl = urlFrontend;

        if (typeof checkoutSession.customer !== 'string') {
            throw new Error('El cliente no es un ID válido para crear el portal');
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: checkoutSession.customer,
            return_url: returnUrl,
        });

        return portalSession
    }


    static webHook = async (signature: string | string[] | undefined, body: WebhookPayload, res: any) => {
        // Definimos event fuera para que tenga el tipo correcto de Stripe
        let event: Stripe.Event;

        const endpointSecret = isProd ? getRequiredEnv('STRIPE_EVENT_SECRET_KEY') : getRequiredEnv('STRIPE_EVENT_SECRET_KEY_DEV'); // Úsalo desde un .env en el futuro


        if (endpointSecret && signature) {
            try {
                // Usamos req.body que ahora es un Buffer gracias a express.raw
                event = stripe.webhooks.constructEvent(
                    body,
                    signature as string,
                    endpointSecret
                );
            } catch (err: any) {
                console.log(`⚠️ Webhook signature verification failed.`, err.message);
                return res.sendStatus(400);
            }
        } else {
            // Si no hay secret o firma (solo para pruebas locales sin validación)
            // Ojo: en producción esto debería dar error siempre
            if (isProd) {
                return res.status(400).send('Falta la firma')
            } else {
                try {
                    event = JSON.parse(body.toString());
                } catch (e) {
                    return res.sendStatus(400);
                }
            }

        }

        // Ahora event ya es un objeto de Stripe y el switch funcionará
        try {

            const pricePlanMap: Record<string, string> = {
                "price_1TI5NFBjujyKH7kY3CSAJ0fp": "pro",
                "price_1TJA7HBjujyKH7kY2UvGiQyk": "business"
            }
            const stripeEventExists = await StripeEvent.findOne({ eventId: event.id })
            if (stripeEventExists) {
                return res.status(200).send({ received: true })
            }
            await StripeEvent.create({ eventId: event.id })


            switch (event.type) {
                //Eventos de fallo de pago y cancelación
                case 'invoice.payment_failed':
                case 'customer.subscription.deleted':

                    const obj = event.data.object as any
                    const stripeCustomerId = obj.customer as string

                    await User.findOneAndUpdate({ stripeCustomerId: stripeCustomerId }, {
                        subscription: 'free'
                    })
                    break

                    //Evento de suscripción creada o actualizada
                case 'customer.subscription.updated':
                case 'customer.subscription.created':

                    const updatedSubscription = event.data.object
                    const updatedPlan = pricePlanMap[updatedSubscription.items.data[0].price.id]
                    const userForUpdate = await User.findOne({ stripeCustomerId: updatedSubscription.customer.toString() })
                    if (!userForUpdate) break


                    await User.findOneAndUpdate({ stripeCustomerId: updatedSubscription.customer.toString() }, {
                        stripeSubscriptionId: updatedSubscription.id,
                        subscription: updatedPlan
                    })
                    break

                    //Evento de factura pagada
                case 'invoice.paid':

                    let invoicePaid = event.data.object as Stripe.Invoice;


                    if (!invoicePaid.customer) {
                        console.warn('invoice.payment_succeeded sin customer, se omite')
                        break
                    }


                    let subscriptionId = invoicePaid.parent?.subscription_details?.subscription as string

                    if (!subscriptionId) {
                        console.warn('invoice.paid sin subscription id, se omite')
                        break
                    }
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId)


                    const priceId = subscription.items.data[0].price.id

                    const newPlan = pricePlanMap[priceId]
                    if (newPlan) {
                        await User.findOneAndUpdate({ stripeCustomerId: invoicePaid.customer?.toString() }, {
                            stripeCustomerId: invoicePaid.customer,
                            stripeSubscriptionId: subscriptionId,
                            subscription: newPlan
                        })
                    }

                    break

                case 'checkout.session.completed':
                    // Este es el evento MÁS importante
                    const session = event.data.object as Stripe.Checkout.Session;

                    if (!session.subscription) break
                    if (session.mode !== 'subscription') break
                    if (!session.metadata?.userId) break

                    const userId = session.metadata.userId

                    if (!userId) return

                    const user = await User.findOne({ _id: userId })

                    if (!user) {
                        console.warn('Usuario no encontrado para webhook de stripe')
                        break
                    }

                    await User.findOneAndUpdate({ _id: userId }, {
                        stripeCustomerId: session.customer,
                        stripeSubscriptionId: session.subscription
                    })

                    console.log('✅ Pago completado para la sesión:', session.id);
                    console.log('subscription id', session.subscription)
                    console.log('customer', session.customer)
                    break


                default:
                    console.log(`Unhandled event type ${event.type}.`);
            }

            // Stripe NECESITA un 200 rápido para saber que recibiste el aviso
            res.status(200).send({ received: true });

        } catch (error) {
            console.error('Error procesando el webhook:', error);
            return res.status(500).send('Webhook Error');
        }
    }


    static cancel = async (user: IUser) => {
        try {
            if (!user.stripeSubscriptionId) {
                throw new AppError('El usuario no tiene una suscripción activa')
            }

            await stripe.subscriptions.cancel(user.stripeSubscriptionId)
            await User.findOneAndUpdate({ stripeCustomerId: user.stripeCustomerId }, {
                stripeSubscriptionId: null
            })

            return true
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) throw error
            throw new Error('Error en cancelación de subscripción')
        }
    }
} 

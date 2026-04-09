// Importamos la librería que acabas de instalar con npm
import Stripe from 'stripe'

const stripe = new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'))

async function createStripeProduct() {
    try {
        // 1. Creamos el Producto
        const product = await stripe.products.create({
            name: 'Starter Subscription',
            description: '$12/Month subscription',
        });

        // 2. Creamos el Precio asociado a ese producto
        const price = await stripe.prices.create({
            unit_amount: 1200, // 1200 céntimos = $12.00
            currency: 'usd',
            recurring: {
                interval: 'month',
            },
            product: product.id,
        });

        console.log('¡Éxito! ID del producto:', product.id);
        console.log('¡Éxito! ID del precio:', price.id);
    } catch (error) {
        console.error('Hubo un error:', error.message);
    }
}

createStripeProduct();
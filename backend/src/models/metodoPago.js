import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config('../.env')

const stripe = new Stripe('sk_test_51Rafko2LimiVsaRzOfKB06A6OkIkvifDljVE7xVKZo48IZmaPPkrb01YyoY5i8XQu47O4xJFICzQR3TTcVSurPiT00SJHA1Trm')

export class ModeloMetodoPago {
  static async crearMetodoPago (input) {
    const total = input.reduce((acc, item) => acc + (item.precio * item.quantity), 0)
    console.log('Total a pagar:', total)
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: 'bob',
        automatic_payment_methods: {
          enabled: true
        }
      })
      return paymentIntent.client_secret
    } catch (error) {
      console.error('Error al crear el método de pago:', error)
      return { error: 'Error al crear el método de pago' }
    }
  }

  static async obtenerPagosPorEmail (email) {
    try {
      const pagos = await stripe.paymentIntents.list({
        limit: 100
      })
      console.log(email)
      const resultados = []

      for (const pago of pagos.data) {
        if (pago.payment_method) {
          const paymentMethod = await stripe.paymentMethods.retrieve(pago.payment_method)

          if (paymentMethod.billing_details.email && paymentMethod.billing_details.email.toLowerCase() === email.toLowerCase()) {
            resultados.push({
              id: pago.id,
              fecha: new Date(pago.created * 1000).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }),
              amount: pago.amount,
              currency: pago.currency,
              status: pago.status,
              email: paymentMethod.billing_details.email,
              name: paymentMethod.billing_details.name,
              created: pago.created
            })
          }
        }
      }

      return resultados
    } catch (error) {
      console.error('Error al obtener los pagos del usuario:', error)
      return { error: 'Error al obtener los pagos del usuario' }
    }
  }
}

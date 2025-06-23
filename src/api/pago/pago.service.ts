import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PagoService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: this.configService.get<string>('STRIPE_API_VERSION') as Stripe.LatestApiVersion,
    });
  }

  async crearPago(monto: number, moneda: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: monto,
        currency: moneda,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw error;
    }
  }
}
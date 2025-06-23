import { Controller, Post, Req, Res } from '@nestjs/common';
import { PagoService } from './pago.service';

@Controller('')
export class PagoController {
    
    constructor(
        private readonly pagoService: PagoService, 
    ) {}

    @Post('crearPago')
    async crearPago(@Req() req, @Res() res) {
        console.log('Petición recibida en /crearPago');
        console.log('Body recibido:', req.body);

        try {
            const { monto, moneda } = req.body;
            console.log('Datos extraídos - monto:', monto, ', moneda:', moneda);

            const paymentIntent = await this.pagoService.crearPago(monto, moneda);
            console.log('PaymentIntent creado:', paymentIntent);

            // Devuelve solo el client_secret
            return res.json({ client_secret: paymentIntent.client_secret });
        } catch (error) {
            console.error('Error al crear el pago:', error);
            // Devuelve el error al frontend
            return res.status(500).json({ error: error.message || 'Error interno' });
        }
    }

}

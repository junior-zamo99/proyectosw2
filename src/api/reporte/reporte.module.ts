import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { VentaSchema } from 'src/schemas/ventas.schema';
import { ReporteController } from './reporte.controller';
import { MailService } from './mail.service';
import { ReporteService } from './reporte.service';
import { PdfService } from './pdf.service';
import { JwtModule } from '@nestjs/jwt';
import { IngresoDetalleSchema } from 'src/schemas/ingresoDetalle.schema';
import { VentaDetalleSchema } from 'src/schemas/ventaDetalle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'venta', schema: VentaSchema },
      { name: 'ingreso', schema: IngresoSchema },
      { name:'ingresoDetalle', schema: IngresoDetalleSchema},
      {name:'ventaDetalle', schema: VentaDetalleSchema}
    ]),
    JwtModule.register({
      secret: 'junior',
      signOptions: {
        expiresIn: '1d'
      }
    }),
  ],
  controllers: [ReporteController],
  providers: [ReporteService, PdfService, MailService]
})
export class ReporteModule { }

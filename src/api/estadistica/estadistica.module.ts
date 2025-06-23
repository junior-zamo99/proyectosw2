import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadisticaService } from './estadistica.service';
import { EstadisticaController } from './estadistica.controller';
import { VentaSchema } from 'src/schemas/ventas.schema';
import { VentaDetalleSchema } from 'src/schemas/ventaDetalle.schema';
import { JwtModule } from '@nestjs/jwt';
import { IngresoSchema } from 'src/schemas/ingreso.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'venta', schema: VentaSchema },
      { name: 'ventaDetalle', schema: VentaDetalleSchema },
      { name: 'ingreso', schema: IngresoSchema },
    ]),
    JwtModule.register({
      secret: 'junior',
      signOptions: {
        expiresIn: '1d'
      }
    }),
  ],
  controllers: [EstadisticaController],
  providers: [EstadisticaService],
})
export class EstadisticaModule { }

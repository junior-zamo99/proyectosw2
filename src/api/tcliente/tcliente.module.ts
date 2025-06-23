import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LogModule } from '../log/log.module';
import { ClienteSchema } from 'src/schemas/cliente.schema';
import { TclienteService } from './tcliente.service';
import { TclienteController } from './tcliente.controller';
import { TenantSchema } from 'src/schemas/tienda.schema';
import { TenantModule } from '../tenant/tenant.module';

import { EmailsModule } from '../emails/emails.module';
import { CarritoSchema } from 'src/schemas/carrito.schema';
import { VentaSchema } from 'src/schemas/ventas.schema';
import { VentaDetalleSchema } from 'src/schemas/ventaDetalle.schema';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { IngresoDetalleSchema } from 'src/schemas/ingresoDetalle.schema';
import { CuponSchema } from 'src/schemas/cupon.schema';
import { CuponDetalleSchema } from 'src/schemas/cupon_detalle.schema';

@Module({
    imports:[
        MongooseModule.forFeature([
          {name:'cliente',schema:ClienteSchema},
          {name:'tenant',schema:TenantSchema},
          {name:'carrito',schema:CarritoSchema},
          {name:'venta',schema:VentaSchema},
          {name:'ventaDetalle',schema:VentaDetalleSchema},
          {name:'cupon',schema:CuponSchema},
          {
            name:'cupon_detalle', schema: CuponDetalleSchema
        },
          {
            name:'ingreso', schema: IngresoSchema
        },
        {
            name:'ingresoDetalle', schema: IngresoDetalleSchema
        },
        {name:'tenant',schema:TenantSchema}
        ]),
        JwtModule.register({ 
          secret: 'junior',
        signOptions:{
          expiresIn:'1d'
        } }),
        LogModule,
        TenantModule,
        EmailsModule

      ],
      providers: [TclienteService,
       /* {
          provide: APP_INTERCEPTOR,
          useClass:AdminInterceptorInterceptor
        },
        {
          provide: APP_INTERCEPTOR,
          useClass:ClienteInterceptorInterceptor
        }*/],
      controllers: [TclienteController],
      exports:[TclienteService]
})
export class TclienteModule {}

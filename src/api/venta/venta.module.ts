import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductoSchema } from 'src/schemas/producto.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.schema';
import { FuncionalidadModule } from '../funcionalidad/funcionalidad.module';
import { LogModule } from '../log/log.module';
import { VentaSchema } from 'src/schemas/ventas.schema';
import { VentaDetalleSchema } from 'src/schemas/ventaDetalle.schema';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';

@Module({
    imports: [
        MongooseModule.forFeature([
        {
            name:'producto', schema: ProductoSchema
        },
        {
            name:'producto_variedad', schema: Producto_variedadSchema
        },
        {
            name:'venta', schema: VentaSchema
        },
        {
            name:'ventaDetalle', schema: VentaDetalleSchema
        }
    ]),
    JwtModule.register({ 
        secret: 'junior',
      signOptions:{
        expiresIn:'1d'
      } }),
      LogModule,
      FuncionalidadModule
],
    controllers: [VentaController],
    providers: [VentaService],
})
export class VentaModule {}

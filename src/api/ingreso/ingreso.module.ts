import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { IngresoController } from './ingreso.controller';
import { IngresoService } from './ingreso.service';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.schema';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { IngresoDetalleSchema } from 'src/schemas/ingresoDetalle.schema';
import { LogModule } from '../log/log.module';
import { FuncionalidadModule } from '../funcionalidad/funcionalidad.module';


@Module({
    imports:[
        MongooseModule.forFeature([
            {
                name:'producto', schema: ProductoSchema
            },
            {
                name:'producto_variedad', schema: Producto_variedadSchema
            },
            {
                name:'ingreso', schema: IngresoSchema
            },
            {
                name:'ingresoDetalle', schema: IngresoDetalleSchema
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
    controllers:[IngresoController],
    providers:[IngresoService]
})
export class IngresoModule {}

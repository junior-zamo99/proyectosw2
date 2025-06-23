import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from 'src/schemas/categoria.schema';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.schema';
import { LogModule } from '../log/log.module';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { IngresoDetalleSchema } from 'src/schemas/ingresoDetalle.schema';


@Module({
    imports:[
        MongooseModule.forFeature([
            {
                name:'categoria', schema: CategoriaSchema
            },
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
          

    ],
    controllers:[InventarioController],
    providers:[InventarioService]
})
export class InventarioModule {}

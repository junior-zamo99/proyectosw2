import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from 'src/schemas/categoria.schema';
import { JwtModule } from '@nestjs/jwt';
import { Producto_galeriaSchema } from 'src/schemas/producto_galeria.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.schema';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { LogModule } from '../log/log.module';
import { FuncionalidadModule } from '../funcionalidad/funcionalidad.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { IngresoDetalleSchema } from 'src/schemas/ingresoDetalle.schema';
import { CuponSchema } from 'src/schemas/cupon.schema';
import { CuponDetalleSchema } from 'src/schemas/cupon_detalle.schema';


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
                name:'producto_galeria', schema: Producto_galeriaSchema
            },
            {
                name:'producto_variedad', schema: Producto_variedadSchema
            },{
                name:'ingreso', schema: IngresoSchema
            },
            {
                name:'ingresoDetalle', schema: IngresoDetalleSchema
            },
            {
                name:'cupon', schema: CuponSchema
            },
            {
                name:'cupon_detalle', schema: CuponDetalleSchema
            }
            
        ]),
        JwtModule.register({ 
            secret: 'junior',
          signOptions:{
            expiresIn:'1d'
          } }),
          LogModule,
          FuncionalidadModule,
          UsuarioModule

    ],
    controllers:[ProductoController],
    providers:[ProductoService]
})
export class ProductoModule {}

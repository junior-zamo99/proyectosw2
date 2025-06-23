import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from 'src/schemas/categoria.schema';
import { ProductoSchema } from 'src/schemas/producto.schema';
import { Producto_galeriaSchema } from 'src/schemas/producto_galeria.schema';
import { Producto_variedadSchema } from 'src/schemas/producto_variedad.schema';
import { VisitanteController } from './visitante.controller';
import { VisitanteService } from './visitante.service';
import { IngresoDetalleSchema } from 'src/schemas/ingresoDetalle.schema';
import { IngresoSchema } from 'src/schemas/ingreso.schema';
import { TenantSchema } from 'src/schemas/tienda.schema';

@Module({
    imports: [
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
            },
            {
                name:'ingreso', schema: IngresoSchema
            },
            {
                name:'ingresoDetalle', schema: IngresoDetalleSchema
            },
            {name:'tenant',schema:TenantSchema},
        ])
    ],
    controllers: [VisitanteController],
    providers: [VisitanteService],
})
export class VisitanteModule {}

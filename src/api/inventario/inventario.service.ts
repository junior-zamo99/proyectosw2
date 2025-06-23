import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class InventarioService {

    constructor(
        @InjectModel('categoria') private categoriaModel,
        @InjectModel('producto') private productoModel,
        @InjectModel('producto_variedad') private productoVariedadModel,
        @InjectModel('ingreso') private ingresoModel,
        @InjectModel('ingresoDetalle') private ingresoDetalleModel
    ) { }

    async getProductosInventario(filtro,tenant) {
        try {
            const arregloProducto = [];
            let productos;
            if (filtro == 'todos') {
                productos = await this.productoModel.find({tenant:tenant}).populate('categoria').sort({ createdAT: -1 })
            } else {
                productos = await this.productoModel.find({tenant:tenant, titulo: new RegExp(filtro, 'i') }).populate('categoria').sort({ createdAT: -1 })
            }

            for (const producto of productos) {
                const arregloVariaciones = [];
                const variaciones = await this.productoVariedadModel.find({tenant:tenant, producto: producto._id })
                const unidades = await this.ingresoDetalleModel.find({ tenant:tenant,producto: producto._id, estado: true, estado_: 'Confirmado', }).populate('almacen')


                for (const variacion of variaciones) {
                    const unidadesVariacion = await this.ingresoDetalleModel.find({ tenant:tenant,producto_variedad: variacion._id, estado: true, estado_: 'Confirmado' })
                    arregloVariaciones.push({
                        cantidad: variacion.cantidad,
                        precio: variacion.precio,
                        hxd: variacion.hxd,
                        sku: variacion.sku,
                        talla: variacion.talla,
                        _id: variacion._id,
                        color: variacion.color,
                        createdAT: variacion.createdAT,
                        producto: variacion.producto,
                        unidades: unidadesVariacion.length

                    })
                }



                arregloProducto.push({
                    producto: producto,
                    unidades: unidades.length,

                    variaciones: arregloVariaciones
                })
            }

            return { data: arregloProducto }

        } catch (error) {
            return { data: undefined, message: 'no se pudo obtener los productos' }
        }
    }



    async getVariacionInventario(id,tenant) {

        try {

            const variacion = await this.productoVariedadModel.findOne({ _id: id,tenant:tenant }).populate('producto')

            if (variacion) {
                const unidades = await this.ingresoDetalleModel.find({ tenant:tenant, producto_variedad: variacion._id, estado: true, estado_: 'Confirmado' }).populate('ingreso')
                return { data: { variacion: variacion, unidades: unidades } }
            } else {
                return { data: undefined, message: 'no se encontró la variación' }
            }


        } catch (error) {

            return { data: undefined, message: 'no se pudo obtener las variaciones' }
        }

    }

}

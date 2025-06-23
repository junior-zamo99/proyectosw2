import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class VisitanteService {
    constructor(
        @InjectModel('categoria') private categoriaModel,
        @InjectModel('producto') private productoModel,
        @InjectModel('producto_galeria') private productoGaleriaModel,
        @InjectModel('producto_variedad') private productoVariedadModel,
        @InjectModel('ingreso') private ingresoModel,
        @InjectModel('ingresoDetalle') private ingresoDetalleModel,
        @InjectModel('tenant') private tenantModel
    ) {}

    async getProductosTienda(
        page: number,
        limit: number, 
        genero?: string,
        categorias?: string,
        precio?: string,
        tenant?: string
    ) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({nombreTienda: tenant});
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const filtro: any = { estado: true, tenant: tenantData._id };

            console.log(page,limit)

            if (genero && genero !== 'Todos') {
                filtro.clasificacion = genero;
            }
    
            if (categorias) {
                const categoriasArray = categorias.split(',');
                filtro.categoria = { $in: categoriasArray };
            }
    
            const totalProducts = await this.productoModel.countDocuments(filtro);
            const productos = await this.productoModel
                .find(filtro)
                .populate('categoria')
                .sort({ createdAT: -1 })
                .skip((page-1) * limit)
                .limit(limit);
            const arr_productos = [];
            for (const element of productos) {
                const variaciones = await this.productoVariedadModel.find({
                    producto: element._id,
                    precio: { $gt: 0 },
                    tenant: tenantData._id
                });
                let cantidadesTotal = 0;
                for (const subItem of variaciones) {
                    const unidades = await this.ingresoDetalleModel.find({
                        producto_variedad: subItem._id,
                        estado: true,
                        estado_: 'Confirmado',
                        tenant: tenantData._id
                    });
                    cantidadesTotal += unidades.length;
                }
    
                if (cantidadesTotal > 0 && variaciones.length > 0) {
                    const precioBase = variaciones[0].precio;
    
                    if (precio) {
                        const [min, max] = precio.split('-').map(Number);
                        if (precioBase < min || precioBase > max) continue;
                    }
    
                    arr_productos.push({
                        _id: element._id,
                        titulo: element.titulo,
                        portada: element.portada,
                        slug: element.slug,
                        clasificacion: element.clasificacion,
                        etiqueta: element.etiqueta,
                        categoria: element.categoria,
                        precio: precioBase,
                    });
                }
            }
    
          
    
            return { data: arr_productos, total: totalProducts };
        } catch (error) {
            console.log(error);
            return {
                data: undefined,
                message: 'Error al obtener los productos de la tienda'
            };
        }
    }

    async getCategoriasTienda(clasificacion,tenant:string) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({nombreTienda: tenant});
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const categorias = await this.categoriaModel.find({ genero: clasificacion,tenant: tenantData._id });
            return { data: categorias };
        } catch (error) {
            return { data: undefined, message: 'no se pudo obtener la categoria' };
        }
    }

    async getProductoTienda(slug,tenant:string) {
        try {
            if (!tenant) {
                return { data: undefined, message: 'Tenant no proporcionado' };
            }
            const tenantData = await this.tenantModel.findOne({nombreTienda: tenant});
            if (!tenantData) {
                return { data: undefined, message: 'Tenant no encontrado' };
            }
            const producto = await this.productoModel.findOne({ slug: slug,tenant:tenantData._id }).populate('categoria');
            const arr_variaciones = [];

            if (producto) {
                const variaciones = await this.productoVariedadModel.find({
                    producto: producto._id,
                    precio: { $gt: 0 },
                    tenant: tenantData._id
                });

                const galeria = await this.productoGaleriaModel.find({ producto: producto._id, tenant: tenantData._id });

                for (const subItem of variaciones) {
                    const unidades = await this.ingresoDetalleModel.find({
                        producto_variedad: subItem._id,
                        estado: true,
                        estado_: 'Confirmado',
                        tenant: tenantData._id
                    });

                    if (unidades.length > 0) {
                        arr_variaciones.push({
                            _id: subItem._id,
                            hxd: subItem.hxd,
                            color: subItem.color,
                            talla: subItem.talla,
                            precio: subItem.precio,
                            cantidad: unidades.length,
                            createdAT: subItem.createdAT,
                            producto: subItem.producto,
                            sku: subItem.sku,
                            cantidades: unidades.length
                        });
                    }
                }

                return { data: { producto: producto, variaciones: arr_variaciones, galeria: galeria } };
            } else {
                return { data: undefined, message: 'Producto no encontrado' };
            }
        } catch (error) {
            return { data: undefined, message: 'Error al obtener el producto' };
        }
    }
}

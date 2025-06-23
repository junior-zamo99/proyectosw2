import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import slugify from 'slugify';

import * as fs from 'fs-extra'
import * as path from 'path'


@Injectable()
export class ProductoService {

    constructor(
        @InjectModel('categoria') private categoriaModel,
        @InjectModel('producto') private productoModel,
        @InjectModel('producto_galeria') private productoGaleriaModel,
        @InjectModel('producto_variedad') private productoVariedadModel, 
        @InjectModel('ingreso') private ingresoModel,
        @InjectModel('ingresoDetalle') private ingresoDetalleModel,
        @InjectModel('cupon') private cuponModel,
        @InjectModel('cupon_detalle') private cuponDetalleModel



    ){}
    
    async createCategoria(data:any,tenant:any){
        try {
            data.tenant=tenant
            const categoria=await this.categoriaModel.find({titulo:data.titulo,tenant:tenant})
            console.log(data)
            if(categoria.length>=1){
                return{data:undefined, message:'la categoria no esta disponible'}
            }else{
                data.slug=data.titulo.toLowerCase().replace(/[^a-z0-9]+/g,"-").trim()
                const reg= await this.categoriaModel.create(data)
                return {data:reg}
            }
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo crear la categoria'}
        }
    }


    async getCategorias(clasificacion,tenant){
        try {
            const categorias=await this.categoriaModel.find({genero:clasificacion,tenant:tenant})
            return {data:categorias}
        } catch (error) {
            return{data:undefined, message:'no se pudo obtener la categoria'}
        }
    }


    async getCategoriasAll(tenant){
        try {
            const categorias= await this.categoriaModel.find({tenant:tenant})
            return {data:categorias}
        }
        catch (error) {
            return{data:undefined, message:'no se pudo obtener la categoria'}
        }
    }

    async cambioEstadoCategoria(id: any, data: any,tenant:any) {
        const usuario = await this.categoriaModel.findOne({ _id: id, genero:data.genero,tenant:tenant });
        if (usuario) {
            const estadoActual = data.estado;
            const reg = await this.categoriaModel.findOneAndUpdate({ _id: id }, {
                estado: !estadoActual
            });
            
            return {data:reg};
        } else {
            return { data: undefined, message: 'No se pudo obtener los usuarios' };
        }
    }

     
    async getCategoria(id:any,tenant){
        try {
            const categoria = await this.categoriaModel.findOne({ _id: id,tenant:tenant });
        if(categoria){
            return {data:categoria}
        }else{
            return { data: undefined, message: 'No se pudo obtener la categoria' };
        }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener la categoria' };
        }
    }


    async updateCategoria(id: any, data: any,tenant:any) {
        try {
           
            const regCategoria= await this.categoriaModel.findOne({_id:id,tenant:tenant})
            if(regCategoria){
                const categoria = await this.categoriaModel.findOneAndUpdate({ _id: id,tenant:tenant }, {
                    titulo: data.titulo,
                    genero: data.genero,
                    subcategorias:data.subcategorias,
                    estado:data.estado
                
                })
                return {data:categoria}
            }else{
                return { data: undefined, message: 'No se pudo obtener la categoria' };
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo actualizar la categoria', error: error.message };
        }
    }


    async createProducto(data:any,files:any,tenant){
        try{
            data.tenant=tenant
            data.portada=files[0].filename
            data.slug= slugify(data.titulo,{lower:true})
            data.labels=JSON.parse(data.etiquetas)
            const producto= await this.productoModel.create(data)

            data.variaciones=JSON.parse(data.variaciones)
            let strClasificacion
            const categoriaP= await this.categoriaModel.findOne({_id:data.categoria})
            if(data.clasificacion=='Masculino') strClasificacion=1;
            if(data.clasificacion=='Femenino') strClasificacion=2;
            if(data.clasificacion=='Niños') strClasificacion=3;
            if(data.clasificacion=='Niñas') strClasificacion=4;

            for(const item of data.variaciones){
                item.producto=producto._id
                item.tenant=tenant
                item.sku=('0'+strClasificacion+categoriaP.titulo.substring(0,3)+data.subcategorias.substring(0,3)+item.color.substring(0,3)+data.titulo.substring(0,3)+item.talla).toUpperCase()
                await this.productoVariedadModel.create(item)
            }
            
            data.galeria=JSON.parse(data.galeria)
            data.galeria.forEach(async(element,index) => {
                element.producto=producto._id
                element.imagen=files[index].filename
                element.tenant=tenant
                await this.productoGaleriaModel.create(element)
            })

            
           
            return {data:producto}
            
        }catch(error){
            return {data:undefined, message:'no se pudo crear el producto'}
        }
    }

    async getProductosByArrayId(data: any,tenant) {
        try {
          console.log(data);
          const arregloProducto = [];
          
         
          let idsArray: any[];
          
          if (data.productos && Array.isArray(data.productos)) {
         
            idsArray = data.productos.map(item => item.id);
          } else if (Array.isArray(data)) {
            
            idsArray = data.map(item => typeof item === 'string' ? item : item.id);
          } else {
            throw new Error('Formato de datos no válido');
          }
          
          for (const id of idsArray) {
            const producto = await this.productoModel.findOne({ _id: id,tenant:tenant })
              .populate('categoria')
              .sort({createdAT: -1});
            
            if (producto) {
              
              arregloProducto.push({producto});
            }
          }
          
          return {data: arregloProducto};
        } catch (error) {
          return {data: undefined, message: 'No se pudo obtener los productos'};
        }
      }

    async getProductos(filtro,tenant){
        try {
            const arregloProducto=[];
            let productos ;
            if(filtro=='todos'){
               productos = await this.productoModel.find({tenant:tenant}).populate('categoria').sort({createdAT:-1})
            }else{
                 productos = await this.productoModel.find({tenant:tenant,titulo: new RegExp(filtro, 'i')}).populate('categoria').sort({createdAT:-1})
            }

            for(const producto of productos){ 
                const galeria= await this.productoGaleriaModel.find({tenant:tenant,producto:producto._id})
                const variaciones= await this.productoVariedadModel.find({tenant:tenant,producto:producto._id})
                arregloProducto.push({producto:producto,galeria,variaciones})
            }
            return {data:arregloProducto}
        } catch (error) {
            return{data:undefined, message:'no se pudo obtener los productos'}
        }
    }

    async cambioEstadoProducto(id: any, data: any,tenant) {
        const producto = await this.productoModel.findOne({ tenant:tenant,_id: id});
        if (producto) {
            const estadoActual = data.estado;
            const reg = await this.productoModel.findOneAndUpdate({tenant:tenant, _id: id }, {
                estado: !estadoActual
            });
    
            return {data:reg};
        } else {
            return { data: undefined, message: 'No se pudo obtener el producto' };
        }
    }

    async getProducto(id:any,tenant){
        try {
            const producto = await this.productoModel.findOne({ tenant:tenant,_id: id })
        
            return {data:producto}
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener el producto' };
        }
    }

    async getVariacionesProducto(id:any,tenant){
        try {
            const producto = await this.productoModel.findOne({ tenant:tenant,_id: id})
            if(producto){
                const variaciones= await this.productoVariedadModel.find({tenant:tenant,producto:producto._id})
                const arr_variaciones=[]

                for(const item of variaciones){
                    const unidades= await this.ingresoDetalleModel.find({tenant:tenant,producto_variedad:item._id,estado:true,estado_:'Confirmado'})
                    arr_variaciones.push({
                        color:item.color,
                        createdAT:item.createdAT,
                        hxd:item.hxd,
                        precio:item.precio,
                        producto:item.producto,
                        sku:item.sku,
                        talla:item.talla,
                        _id:item._id,
                        cantidad:unidades.length
                        
                    })
                }

                return {data:arr_variaciones}
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener las variaciones' };
        }
    }

    async getGaleriaProducto(id:any,tenant){
        try {
            const producto = await this.productoModel.findOne({ _id: id,tenant:tenant })
            if(producto){
                const galeria= await this.productoGaleriaModel.find({tenant:tenant,producto:producto._id})
                return {data:galeria}
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo obtener la galeria' };
        }
    }

    async updateProducto(id:any, data:any,tenant){
        try {
            const regProducto= await this.productoModel.findOne({_id:id,tenant:tenant})
            if(regProducto){
                const producto = await this.productoModel.findOneAndUpdate({ _id: id,tenant:tenant }, {
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    clasificacion: data.clasificacion,
                    categoria: data.categoria,
                    subcategorias:data.subcategorias,
                    labels:data.etiquetas
                })
                return {data:producto}
            }else{
                return { data: undefined, message: 'No se pudo obtener el producto' };
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo actualizar el producto', error: error.message };
        }
    }

    async addVariacion(data:any,tenant:any){
        try {
            data.tenant=tenant
            const producto = await this.productoModel.findOne({ _id: data.producto,tenant:tenant}).populate('categoria')
            let strClasificacion
            if(producto.clasificacion=='Masculino') strClasificacion=1;
            if(producto.clasificacion=='Femenino') strClasificacion=2;
            if(producto.clasificacion=='Niños') strClasificacion=3;
            if(producto.clasificacion=='Niñas') strClasificacion=4;
            data.sku=('0'+strClasificacion+producto.categoria.titulo.substring(0,3)+producto.subcategorias.substring(0,3)+data.color.substring(0,3)+producto.titulo.substring(0,3)+data.talla).toUpperCase()
            const variacion= await this.productoVariedadModel.create(data)
            return {data:variacion}
        } catch (error) {
            console.log(error)
            return { data: undefined, message: 'No se pudo agregar la variacion' };
        }
    } 

    async AddImagenProducto(data: any, file: any,tenant) {
        try {
            data.tenant=tenant
            data.imagen = file.filename;
            const imagen = await this.productoGaleriaModel.create(data);
            const galeria = await this.productoGaleriaModel.find({ producto: data.producto,tenant:tenant });
            
            if (galeria.length === 1) {
                await this.productoModel.findByIdAndUpdate(data.producto, { portada: file.filename });
            }
    
            return { data: imagen };
        } catch (error) {
            return { data: undefined, message: 'No se pudo agregar la imagen' };
        }
    }

    async deleteVariacion(id:any,tenant){
        try {
            const variacion=await this.productoVariedadModel.findOne({_id:id,tenant:tenant})
            if(variacion){
                if(variacion.cantidad==0){
                    await this.productoVariedadModel.findByIdAndDelete({_id:id,tenant:tenant})
                    return {data:true}
                }else{
                    return { data: undefined, message: 'hay unidades en la variacion' };
                }
                    
            }else{
                return { data: undefined, message: 'No se pudo obtener la variacion' };
            }
            
        } catch (error) {
            console.log(error)
            return { data: undefined, message: 'No se pudo eliminar la variacion' }
            
        }
    }

    async deleteImagen(id:any,tenant){
        try {
            const imagen=await this.productoGaleriaModel.findOne({_id:id,tenant:tenant})
            if(imagen){
                await fs.remove(path.resolve('./uploads/productos/'+imagen.imagen))
                await this.productoGaleriaModel.findByIdAndDelete({_id:id,tenant:tenant})

                const producto = await this.productoModel.findOne({ _id: imagen.producto,tenant:tenant });
                if (producto.portada === imagen.imagen) {
                    const siguienteImagen = await this.productoGaleriaModel.findOne({ producto: producto._id,tenant:tenant });
                    if (siguienteImagen) {
                        
                        await this.productoModel.findByIdAndUpdate(producto._id, { portada: siguienteImagen.imagen });
                    } else {
                        
                        await this.productoModel.findByIdAndUpdate(producto._id, { portada: '' });
                    }
                }

                return {data:true}
            }else{
                return { data: undefined, message: 'No se pudo obtener la imagen' };
            }
            
        } catch (error) {
            return { data: undefined, message: 'No se pudo eliminar la imagen' }
            
        }
    }

    async buscarProducto(filtro,tenant){
        try {
            console.log(filtro)
            
            const productos = await this.productoModel.find({tenant:tenant,titulo: new RegExp(filtro, 'i',   ),estado:true }).populate('categoria').sort({createdAT:-1})
            console.log(productos)
            return {data:productos}

        } catch (error) {
            return{data:undefined, message:'no se pudo obtener los productos'}
        }
    }

   


    async updateVariacionPrecio(id:any, data:any,tenant){
        try {
            const regVariacion= await this.productoVariedadModel.findOne({_id:id,tenant:tenant})
            if(regVariacion){
                const variacion = await this.productoVariedadModel.findOneAndUpdate({ _id: id,tenant }, {
                    precio: data.precio
                })
                return {data:variacion}
            }else{
                return { data: undefined, message: 'No se pudo obtener la variacion' };
            }
        } catch (error) {
            return { data: undefined, message: 'No se pudo actualizar la variacion', error: error.message };
        }
    }


    async getCategoriasCupon(filtro:any,tenant){
        try {
            const categorias=await this.categoriaModel.find({tenant:tenant,titulo: new RegExp(filtro, 'i')});
            return {data:categorias}
        } catch (error) {
            return{data:undefined, message:'no se pudo obtener la categoria'}
        }
    }

    async getProductosCupon(filtro:any,tenant){
        try {
            const arregloProducto=[];
            const productos=await this.productoModel.find({tenant:tenant,titulo: new RegExp(filtro, 'i')}).populate('categoria')
            for(const producto of productos){ 
                const galeria= await this.productoGaleriaModel.find({tenant:tenant,producto:producto._id})
                const variaciones= await this.productoVariedadModel.find({tenant:tenant,producto:producto._id})
                arregloProducto.push({producto:producto,galeria,variaciones})
            }
            return {data:arregloProducto}
        } catch (error) {
            return{data:undefined, message:'no se pudo obtener la categoria'}
        }
    }

    async crearCupon(data:any,tenant){
        try {   
                data.tenant=tenant
                data.f_inicio=new Date(data.f_inicio+'T00:00:00')
                data.f_fin=new Date(data.f_fin+'T23:59:59')
                const existeCupon=await this.cuponModel.find({tenant:tenant,codigo:data.codigo})
                if(existeCupon.length>=1){
                    return{data:undefined, message:'el cupon ya esta registrado'}
                }else{
                    const cupon=await this.cuponModel.create(data)
                    for(const item of data.detalles){
                        item.cupon=cupon._id
                        await this.cuponDetalleModel.create(item)
                    }
                    return {data:cupon}
                }

            
        } catch (error) {
            return{data:undefined, message:'no se pudo crear el cupon'}
        }
    }


    async getCupones(codigo:any,tenant){
        try {
            if(codigo=='Todos'){
                const cupones=await this.cuponModel.find({tenant:tenant}).sort({createdAT:-1})
                return {data:cupones}
            }else{
                const cupones=await this.cuponModel.find({codigo:codigo,tenant:tenant}).sort({createdAT:-1})
                return {data:cupones}
            }
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo obtener los cupones'}
        }
    }

    async getCupon(id,tenant){
        try {   
            const cupon = await this.cuponModel.findOne({_id:id,tenant:tenant});

            if(cupon){
                return {data:cupon}
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el cupon.' }
        }
    }

    async updateCupon(id,data,tenant){
        try {   
            const cupon = await this.cuponModel.findOne({_id:id,tenant:tenant});

            if(cupon){

                const reg = await this.cuponModel.findOneAndUpdate({_id:id,tenant:tenant},{
                    codigo: data.codigo,
                    descuento: data.descuento,
                    monto_max: data.monto_max,
                    canjes: data.canjes,
                    f_inicio: data.f_inicio+'T00:00:00',
                    f_fin: data.f_fin+'T23:59:59'
                });

                return {data:reg}
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo actualizar el cupon.' }
        }
    }


    async getDetallesCupon(id,tenant){
        try {   
            const cupon = await this.cuponModel.findOne({_id:id,tenant:tenant});

            if(cupon){
                const detalles = await this.cuponDetalleModel.find({cupon:id,tenant:tenant}).populate('producto').populate('categoria');
                return {data:detalles}
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo obtener el cupon.' }
        }
    }   

    async addDetalleCupon(data,tenant){
        try {   
            const cupon = await this.cuponModel.findOne({_id:data.cupon,tenant:tenant});

            if(cupon){
                let validate = false;

                if(cupon.tipo == 'Producto'){
                    const reg = await this.cuponDetalleModel.find({cupon:cupon._id,producto:data.producto,tenant:tenant});

                    if(reg.length == 0) validate = true;
                }else if(cupon.tipo == 'Categoria'){
                    const reg = await this.cuponDetalleModel.find({cupon:cupon._id,categoria:data.categoria,tenant:tenant});

                    if(reg.length == 0) validate = true;
                }
                
                if(validate){
                    data.tenant=tenant
                    const detalle = await this.cuponDetalleModel.create(data);
                    return {data:detalle}
                }else{
                    return { data: undefined, message:'El detalle ya existe en el cupón.' }
                }
            }else{
                return {data:undefined}
            }
        } catch (error) {
            return { data: undefined, message:'No se pudo agregar el detalle.' }
        }
    }

    async deleteCupon(id,tenant){
        try {   
            const detalle = await this.cuponDetalleModel.findOne({_id:id,tenant:tenant});

            if(detalle){
                const reg = await this.cuponDetalleModel.findByIdAndDelete(id);
                return {data:reg}
            }else{
                return {data:undefined}
            }
        } catch (error) {
            
            return { data: undefined, message:'No se pudo eliminar el detalle.' }
        }
    }
}

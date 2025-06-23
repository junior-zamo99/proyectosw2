import { Controller, Delete, Get, Param, Post,Put,Req,Res,UploadedFile,UploadedFiles,UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ProductoService } from './producto.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {v4 as uuidv4} from 'uuid'
import { extname } from 'path';
import * as path from 'path'
import * as fs from 'fs'
import { LogService } from '../log/log.service';
import { FuncionalidadService } from '../funcionalidad/funcionalidad.service';
@Controller()
export class ProductoController {
   
    constructor(
        private readonly _productoService:ProductoService,
        private readonly logService:LogService,
        private readonly funcionalidadService:FuncionalidadService
    ){}

    @Post('createCategoria')
    @UseGuards(AuthGuard)
    async createCategoria(@Res()res, @Req() req){
        try {
            console.log(req.body)
            const user=req.user
            const data=req.body
            data.tenant=user.tenant
            const tenant=user.tenant
        const categoria=await this._productoService.createCategoria(data,tenant)
        res.status(200).send(categoria)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al crear la categoría', error })
        }
    }


    @Get('getCategorias/:clasificacion')
    @UseGuards(AuthGuard)
    async getCategorias(@Res() res, @Req() req, @Param('clasificacion') clasificacion){
        const user=req.user
        const tenant=user.tenant
        const categorias= await this._productoService.getCategorias(clasificacion,tenant)
        res.status(200).send(categorias)
    }

    @Get('getCategoriasAll')
    @UseGuards(AuthGuard)
    async getCategoriasAll(@Res() res, @Req() req){
        const user=req.user
        const tenant=user.tenant
        const categorias= await this._productoService.getCategoriasAll(tenant)
        res.status(200).send(categorias)
    }


    @Put('cambioEstadoCategoria/:id')
    @UseGuards(AuthGuard)
    async cambioEstado(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const categoria=await this._productoService.cambioEstadoCategoria(id,data,tenant)
        res.status(200).send(categoria)
    }

    @Get('getCategoria/:id')
    @UseGuards(AuthGuard)
    async getCategoria(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const usuario=await this._productoService.getCategoria(id,tenant )
        res.status(200).send(usuario)
    }

    @Put('updateCategoria/:id')
    @UseGuards(AuthGuard)
    async updateCategoria(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const categoria=await this._productoService.updateCategoria(id,data,tenant)
        res.status(200).send(categoria)
    }
    



    //PRODUCTOS
    
    //crear producto
    @Post('createProducto')
    @UseInterceptors(FilesInterceptor('files[]', 10, {
        storage:diskStorage({
            destination:'./uploads/productos',
            filename:(req,file,cb)=>{
                cb(null,uuidv4()+''+extname(file.originalname))
            }

        }),
        limits:{
            fileSize:1024*1024*10},
        fileFilter:(req,file,cb)=>{
            if(file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)){
                cb(null,true)
            }else{
                cb(new Error('Formato de archivo no permitido'),false)
            }
        }
    }
    ))
    @UseGuards(AuthGuard)
    async createProducto(@Res()res, @Req() req,@UploadedFiles() files){
        try {
            const user=req.user
            const tenant=user.tenant
            const data = req.body
            const producto= await this._productoService.createProducto(data,files,tenant)
            res.status(200).send(producto) 
        } catch (error) {
            res.status(500).send({ message: 'Error al crear el producto', error })
        }
    }

    // adicionar imagen
    @Post('AddImagenProducto')
    @UseInterceptors(FileInterceptor('imagen', {
        storage:diskStorage({
            destination:'./uploads/productos',
            filename:(req,file,cb)=>{
                cb(null,uuidv4()+''+extname(file.originalname))
            }

        }),
        limits:{
            fileSize:1024*1024*10},
        fileFilter:(req,file,cb)=>{
            if(file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)){
                cb(null,true)
            }else{
                cb(new Error('Formato de archivo no permitido'),false)
            }
        }
    }
    ))
    @UseGuards(AuthGuard)
    async AddImagenProducto(@Res()res, @Req() req,@UploadedFile() file){
        try {
            const user=req.user
            const tenant=user.tenant
            const data = req.body
            const imagen= await this._productoService.AddImagenProducto(data,file,tenant)
            res.status(200).send(imagen) 
        } catch (error) {
            res.status(500).send({ message: 'Error al crear el producto', error })
        }
    }

    //Obtener productos por array de ids
    @Post('getProductosByArrayId')
    async getProductosByArrayId(@Res()res, @Req() req){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const productos=await this._productoService.getProductosByArrayId(data,tenant)
        res.status(200).send(productos)
    }

    //obtener productos
    @Get('getProductos/:filtro')
    @UseGuards(AuthGuard)
    async getProductos(@Res() res, @Req() req, @Param('filtro') filtro){
        const user=req.user
        const tenant=user.tenant
       const productos= await this._productoService.getProductos(filtro,tenant)
        res.status(200).send(productos)
    }

    @Get('getProductoPortada/:img')
    
    async getProductoPortada(@Res() res, @Param('img') img){
        const filename='uploads/productos/'+img
        if(fs.existsSync(filename)){
            res.sendFile(path.resolve(filename))
            console.log('existe')
        }else{  
            res.status(200).send({message:'no existe la imagen'})
            console.log('no existe')
        }
    }

    @Put('cambioEstadoProducto/:id')
    @UseGuards(AuthGuard)
    async cambioEstadoProducto(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const producto=await this._productoService.cambioEstadoProducto(id,data,tenant)
        res.status(200).send(producto)
    }

    @Get('getProducto/:id')
    @UseGuards(AuthGuard)
    async getProducto(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const producto=await this._productoService.getProducto(id,tenant)
        res.status(200).send(producto)
    }

    @Get('getVariacionesProducto/:id')
    @UseGuards(AuthGuard)
    async getVariacionesProducto(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const variaciones=await this._productoService.getVariacionesProducto(id,tenant)
        res.status(200).send(variaciones)
    }

    @Get('getGaleriaProducto/:id')
    @UseGuards(AuthGuard)
    async getGaleriaProducto(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const galeria=await this._productoService.getGaleriaProducto(id,tenant)
        res.status(200).send(galeria)
    }

    @Put('updateProducto/:id')
    @UseGuards(AuthGuard)
    async updateProducto(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const producto=await this._productoService.updateProducto(id,data,tenant)
        res.status(200).send(producto)
    }

    @Post('addVariacion')
    @UseGuards(AuthGuard)
    async addVariacion(@Res()res, @Req() req){
        const data=req.body
        const user=req.user
        const tenant=user.tenant
        const variacion=await this._productoService.addVariacion(data,tenant)
        res.status(200).send(variacion)
    }

    @Delete('deleteVariacion/:id')
    @UseGuards(AuthGuard)
    async deleteVariacion(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const variacion=await this._productoService.deleteVariacion(id,tenant)
        res.status(200).send(variacion)
    }

    @Delete('deleteImagen/:id')
    @UseGuards(AuthGuard)
    async deleteImagenProducto(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const imagen=await this._productoService.deleteImagen(id,tenant)
        res.status(200).send(imagen)
    }

    
    @Get('buscarProducto/:filtro')
    @UseGuards(AuthGuard)
    async buscarProductoAlmacen(@Res()res, @Req() req,@Param('filtro') filtro:any){
        const user=req.user
        const tenant=user.tenant
        const productos=await this._productoService.buscarProducto(filtro,tenant)
        res.status(200).send(productos)
    }

    @Put('updateVariacionPrecio/:id')
    @UseGuards(AuthGuard)
    async updateVariacionPrecio(@Res()res, @Req() req,@Param('id') id:any){
        const data=req.body
        const user=req.user
        const tenant=user.tenant
        const variacion=await this._productoService.updateVariacionPrecio(id,data,tenant)
        res.status(200).send(variacion)
    }
    
    
    @Get('getCategoriasCupon/:filtro')
    @UseGuards(AuthGuard)
    async getCategoriasCupon(@Res() res, @Req() req, @Param('filtro') filtro){
        const user=req.user
        const tenant=user.tenant
        const categorias= await this._productoService.getCategoriasCupon(filtro,tenant)
        res.status(200).send(categorias)
    }

    @Get('getProductosCupon/:filtro')
    @UseGuards(AuthGuard)
    async getProductosCupon(@Res() res, @Req() req, @Param('filtro') filtro){
        const user=req.user
        const tenant=user.tenant
        const productos= await this._productoService.getProductosCupon(filtro,tenant)
        res.status(200).send(productos)
    }

    @Post('crearCupon')
    @UseGuards(AuthGuard)
    async crearCupon(@Res()res, @Req() req){
        try {
            const data=req.body
            const user=req.user
            const tenant=user.tenant
            const cupon=await this._productoService.crearCupon(data,tenant)
            res.status(200).send(cupon)
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el cupón', error })
        }
    }

    @Get('getCupones/:codigo')
    @UseGuards(AuthGuard)
    async getCupones(@Res() res, @Req() req, @Param('codigo') codigo){
        const user=req.user
        const tenant=user.tenant
        const cupones= await this._productoService.getCupones(codigo,tenant)
        res.status(200).send(cupones)
    }

    @Get('getCupon/:id')
    @UseGuards(AuthGuard)
    async getCupon(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const cupon=await this._productoService.getCupon(id,tenant)
        res.status(200).send(cupon)
    }

    @Put('updateCupon/:id')
    @UseGuards(AuthGuard)
    async updateCupon(@Res()res, @Req() req,@Param('id') id:any){
        const data=req.body
        const user=req.user
        const tenant=user.tenant
        const cupon=await this._productoService.updateCupon(id,data,tenant)
        res.status(200).send(cupon)
    }

    @Get('getDetallesCupon/:id')
    @UseGuards(AuthGuard)
    async getDetallesCupon(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const detalles=await this._productoService.getDetallesCupon(id,tenant)
        res.status(200).send(detalles)
    }

    @Post('addDetalleCupon')
    @UseGuards(AuthGuard)
    async addDetalleCupon(@Res()res, @Req() req){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const detalle=await this._productoService.addDetalleCupon(data,tenant)
        res.status(200).send(detalle)
    }


    @Delete('deleteCupon/:id')
    @UseGuards(AuthGuard)
    async deleteCupon(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const detalle=await this._productoService.deleteCupon(id,tenant)
        res.status(200).send(detalle)
    }
}

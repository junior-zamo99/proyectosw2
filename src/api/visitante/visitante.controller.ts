import { Controller, Get, Req, Res, Param, Query } from '@nestjs/common';
import { VisitanteService } from './visitante.service';
import * as path from 'path';

@Controller('')
export class VisitanteController {
    constructor(
        private readonly vistanteService: VisitanteService
    ) {}

    
    @Get('getProductosTienda')
    async getProductosTienda(
        @Req() req,
        @Res() res,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('genero') genero?: string,
        @Query('categorias') categorias?: string, 
        @Query('precio') precio?: string          
    ) {
        try {
             const tenant = req['tenant'];
           
            console.log(page, limit, genero, categorias, precio);
            const productos = await this.vistanteService.getProductosTienda(
                page,
                limit,
                genero,
                categorias,
                precio,
                tenant
            );
            res.status(200).send(productos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener productos', error });
        }
    }

    @Get('getProductoImagenes/:file')
    async getProductoImagenes(@Req() req, @Res() res, @Param('file') file) {
        const file_ = path.join(__dirname, '../../../uploads/productos/', file);
        res.status(200).sendFile(file_);
    }

    @Get('getCategoriasTienda/:clasificacion')
    async getCategoriasTienda(@Req() req, @Res() res , @Param('clasificacion') clasificacion) {
        const tenant = req['tenant'];
        const categorias = await this.vistanteService.getCategoriasTienda(clasificacion, tenant);
        res.status(200).send(categorias);
    }

    @Get('getProductoTienda/:slug')
    async getProductoTienda(@Req() req, @Res() res , @Param('slug') slug) {
        const tenant = req['tenant'];
        const producto = await this.vistanteService.getProductoTienda(slug,tenant);
        res.status(200).send(producto);
    }
}

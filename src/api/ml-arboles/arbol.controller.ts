import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ArbolService } from './arbol.service';

@Controller('arbol')
export class ArbolController {
    constructor(private readonly arbolService: ArbolService) { }

    //? ==== CICLOS TEMPORALES ====
    @Get('ciclos/temporal')
    async getCiclosTemporal(@Query('tipo') tipo: string) {
        return this.arbolService.getCiclosTemporal(tipo);
    }

    @Get('ciclos/producto')
    async getCiclosProducto(
        @Query('tipo') tipo: string,
        @Query('productoId') productoId?: string
    ) {
        return this.arbolService.getCiclosProducto(tipo, productoId);
    }

    @Get('ciclos/debug')
    async getDebugInfo() {
        return this.arbolService.getDebugInfo();
    }

    //? ==== ML INVENTARIO ====
    @Post('inventario/prediccion')
    async predecirInventario(@Body() body: { productos: any[] }) {
        return this.arbolService.predecirInventario(body.productos);
    }

    @Get('inventario/analisis')
    async obtenerAnalisis(@Query('limite') limite?: number) {
        return this.arbolService.obtenerAnalisis(limite || 10);
    }

    @Get('inventario/criticos')
    async obtenerCriticos(
        @Query('limite') limite?: number,
        @Query('offset') offset?: number
    ) {
        return this.arbolService.obtenerCriticos(limite || 50, offset || 0);
    }

    @Get('inventario/recomendaciones')
    async obtenerRecomendaciones(
        @Query('limite') limite?: number,
        @Query('diasMinimos') diasMinimos?: number
    ) {
        return this.arbolService.obtenerRecomendaciones(limite || 20, diasMinimos || 14);
    }

    //? ==== ML MODEL ====
    @Get('modelo/info')
    async obtenerInfoModelo() {
        return this.arbolService.obtenerInfoModelo();
    }

    @Post('modelo/entrenar')
    async entrenarModelo() {
        return this.arbolService.entrenarModelo();
    }

    @Get('modelo/versiones')
    async obtenerVersiones() {
        return this.arbolService.obtenerVersiones();
    }

    @Get('modelo/versiones/:id')
    async obtenerVersion(@Param('id') id: string) {
        return this.arbolService.obtenerVersion(id);
    }

    @Post('modelo/versiones/:id/activar')
    async activarVersion(@Param('id') id: string) {
        return this.arbolService.activarVersion(id);
    }

    @Get('modelo/versiones/comparar')
    async compararVersiones(
        @Query('version1') version1: string,
        @Query('version2') version2: string
    ) {
        return this.arbolService.compararVersiones(version1, version2);
    }
}
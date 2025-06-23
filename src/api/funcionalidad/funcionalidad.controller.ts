/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { FuncionalidadService } from './funcionalidad.service';
import { LogService } from '../log/log.service';

@Controller('')
export class FuncionalidadController {
    constructor(
        private readonly funcionalidadService: FuncionalidadService,
        private readonly logService: LogService
    ) { }


    @Post('createFuncionalidad')

    async createFuncionalidad(@Res() res, @Req() req) {
        const data = req.body
        const funcionalidad = await this.funcionalidadService.createFuncionalidad(data)
        res.status(200).send(funcionalidad)
    }

    @Get('getFuncionalidades')

    async getFuncionalidades(@Res() res, @Req() req) {

        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar usuarios', descripcion: 'permite gestionar a los usuarios', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar roles', descripcion: 'permite gestionar a los roles', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar inventario', descripcion: 'permite gestionar el inventario', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar productos', descripcion: 'permite gestionar los productos', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear usuario', descripcion: 'permite crear un usuario', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear rol', descripcion: 'permite crear un rol', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear producto', descripcion: 'permite crear un producto', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'actualizar usuario', descripcion: 'permite actualizar un usuario', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'actualizar rol', descripcion: 'permite actualizar un rol', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'actualizar producto', descripcion: 'permite actualizar un producto', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar categorias', descripcion: 'permite gestionar las categorias', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear categoria', descripcion: 'permite crear una categoria', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'actualizar categoria', descripcion: 'permite actualizar una categoria', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'stock ', descripcion: 'permite ver el stock del un producto', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'detalle de inventario ', descripcion: 'permite ver los detalles de un inventario', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'exportar detalle de inventario ', descripcion: 'permite exportar los detalles de un inventario', tipo: 2 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar ventas ', descripcion: 'permite gestionar las ventas', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear venta ', descripcion: 'permite crear una venta', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear proveedor ', descripcion: 'permite crear un proveedor', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'actualizar proveedor ', descripcion: 'permite actualizar un proveedor', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar proveedores ', descripcion: 'permite gestionar los proveedores', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar almacen ', descripcion: 'permite gestionar los almacenes', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear almacen ', descripcion: 'permite crear un almacen', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'detalles de venta ', descripcion: 'permite ver los detalles de una venta', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'gestionar cupon', descripcion: 'permite gestionar los cupones', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear cupon', descripcion: 'permite crear un cupon', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'actualizar cupon', descripcion: 'permite actualizar un cupon', tipo: 1 })

        //ajustes de inventario

        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'ajustar inventario', descripcion: 'permite ajustar el inventario', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear ingreso', descripcion: 'permite crear un ingreso', tipo: 1 })
        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'crear egreso', descripcion: 'permite crear una egreso', tipo: 1 })

        await this.funcionalidadService.createFuncionalidad(
            { nombre: 'detalles de ingreso', descripcion: 'permite detallar ingreso', tipo: 1 })
        
        const funcionalidades = await this.funcionalidadService.getFuncionalidades()
        res.status(200).send(funcionalidades)
    }
}
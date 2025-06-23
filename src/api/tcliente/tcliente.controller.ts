import { Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';

import { LogService } from '../log/log.service';
import { TclienteService } from './tcliente.service';
import { ClienteGuard } from 'src/guards/cliente/cliente.guard';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('')
export class TclienteController {
    constructor(
        private readonly logService:LogService,
        private readonly tclienteService:TclienteService
    ){}

    @Post('createClienteTienda')
    async createClienteTienda(@Res()res, @Req() req){
        const data=req.body
        const tenant = req['tenant'];
        const cliente=await this.tclienteService.createClienteTienda(data,tenant)
        return res.status(200).send(cliente)
    }

    @Post('loginCliente')
    async loginCliente(@Res()res, @Req() req){
        const data=req.body
        const tenant = req['tenant'];
        const cliente=await this.tclienteService.loginCliente(data,tenant)
        return res.status(200).send(cliente)
    }

    @Get('getClientes/:filtro')
    @UseGuards(AuthGuard)
    async getClientes(@Res()res, @Req() req,@Param('filtro') filtro:any){
        console.log(filtro)
        const clientes=await this.tclienteService.getClientes( filtro)
        return res.status(200).send(clientes)
    }

    @Get('getVentasCliente/:id')
    @UseGuards(AuthGuard)
    async getClientesVentas(@Res()res, @Req() req,@Param('id') id:any){
        const ventas=await this.tclienteService.getVentasCliente(id)
        return res.status(200).send(ventas)
    }


    @Get('verificacionCliente/:token')
    async verificacionCliente(@Res()res, @Req() req,@Param('token') token:any){
       
        const clientes=await this.tclienteService.verificacionCliente( token)
        return res.status(200).send(clientes)
    }

    @Post('addProductoCarrito')
    @UseGuards(ClienteGuard)
    async addProductoCarrito(@Res()res, @Req() req){
        const data=req.body
        const tenant = req['tenant'];
        const producto=await this.tclienteService.addProductoCarrito(data,req.user.sub,tenant)
        return res.status(200).send(producto)
    }

    @Get('getCliente/:id')
    @UseGuards(ClienteGuard)
    async getCliente(@Res()res, @Req() req,@Param('id') id:any){    
        const tenant = req['tenant'];
        const cliente=await this.tclienteService.getCliente(id,tenant)
        return res.status(200).send(cliente)
    }
    

    @Get('getCarritoCliente')
    @UseGuards(ClienteGuard)
    async getCarritoCliente(@Res()res, @Req() req){
        const tenant = req['tenant'];
        const carrito=await this.tclienteService.getCarritoCliente(req.user.sub,tenant)
        return res.status(200).send(carrito)
    }

    @Delete('deleteProductoCarrito/:id')
    @UseGuards(ClienteGuard)
    async deleteProductoCarrito(@Res()res, @Req() req,@Param('id') id:any){
        const tenant = req['tenant'];    
        const carrito=await this.tclienteService.deleteProductoCarrito(id,tenant)
        return res.status(200).send(carrito)
    }

    @Put('updateCantidadProductoCarrito/:id')
    @UseGuards(ClienteGuard)
    async updateCantidadProductoCarrito(@Res()res, @Req() req,@Param('id') id:any){    
        const data=req.body
        const tenant = req['tenant'];
        const carrito=await this.tclienteService.updateCantidadProductoCarrito(id,data,tenant)
        return res.status(200).send(carrito)
    }
    
    @Post('createVentaCliente')
    @UseGuards(ClienteGuard)
    async createVentaCliente(@Res()res, @Req() req){    
        const data=req.body
        const tenant = req['tenant'];
        const carrito=await this.tclienteService.createVentaCliente(data,tenant)
        return res.status(200).send(carrito)
    }
    
    @Put('aplicarCupon/:codigo')
    async aplicarCupon(@Res()res, @Req() req,@Param('codigo') codigo:any){
        const data=req.body
        const tenant = req['tenant'];
        const carrito=await this.tclienteService.aplicarCupon(codigo,data,tenant)
        return res.status(200).send(carrito)
    }

}



import { Controller,UseGuards,Post,Get,Res,Req } from '@nestjs/common';


import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ProveedorService } from './proveedor.service';

@Controller('')
export class ProveedorController {
    constructor(
        private readonly proveedorService: ProveedorService,
        
    ){}


    @Post('createProveedor')
    @UseGuards(AuthGuard)
    async createProveedor(@Res()res, @Req() req){
        const data=req.body
        const user=req.user
        const tenant=user.tenant
        const proveedor=await this.proveedorService.createProveedor(data,tenant)
        res.status(200).send(proveedor)
    }

    @Get('getProveedores')
    @UseGuards(AuthGuard)
    async getProveedores(@Res()res,@Req() req){
        const user=req.user
        const tenant=user.tenant
        const proveedores=await this.proveedorService.getProveedores(tenant)
        res.status(200).send(proveedores)
    }
}

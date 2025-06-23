import { Controller,UseGuards,Post,Get,Res,Req } from '@nestjs/common';


import { AuthGuard } from 'src/guards/auth/auth.guard';

import { AlmacenService } from './almacen.service';

@Controller('')
export class AlmacenController {
    constructor(
        private readonly almacenService: AlmacenService ,
        
    ){}


    @Post('createAlmacen')
    @UseGuards(AuthGuard)
    async createAlmacen(@Res()res, @Req() req){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const almacen=await this.almacenService.createAlmacen(data,tenant)
        res.status(200).send(almacen)
    }

    @Get('getAlmacenes')
    @UseGuards(AuthGuard)
    async getAlmacenes(@Res()res,@Req() req){
         const user=req.user
        const tenant=user.tenant
        const almacenes=await this.almacenService.getAlmacenes(tenant)
        res.status(200).send(almacenes)
    }
}

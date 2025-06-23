import { Controller,UseGuards,Post,Get,Put,Res,Req, Param } from '@nestjs/common';
import { RolService } from './rol.service';
import { LogService } from '../log/log.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';


@Controller('')
export class RolController {

    constructor(
        private readonly rolService: RolService,
        private readonly logService:LogService,
    ){}

    @Post('createRol')
    @UseGuards(AuthGuard)
    async createRol(@Res()res, @Req() req){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const rol=await this.rolService.createRol(data,tenant)
        console.log(data)
        console.log(rol)
        res.status(200).send(rol)
    }

    @Get('getRoles')
    @UseGuards(AuthGuard)
    async getRoles(@Res()res,@Req() req){
        const user=req.user
        const tenant=user.tenant
        const roles=await this.rolService.getRoles(tenant)
        res.status(200).send(roles)
    }

    @Put('updateRol/:id')
    @UseGuards(AuthGuard)
    async updateRol(@Res()res, @Req() req, @Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const data=req.body
        const rol=await this.rolService.updateRol(id,data,tenant)
        res.status(200).send(rol)
    }

    @Get('getRol/:id')
    @UseGuards(AuthGuard)
    async getRol(@Res()res, @Req() req, @Param('id') id:any){
        const user=req.user
        const tenant=user.tenant
        const rol=await this.rolService.getRol(id,tenant)
        res.status(200).send(rol)
    }
}

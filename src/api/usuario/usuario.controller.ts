import {  Controller, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';




@Controller('')
export class UsuarioController {
    
   
    constructor(
        private readonly usuarioService: UsuarioService,

    ){}

    @Post('createUsuario')
    @UseGuards(AuthGuard)
    async createUsuario(@Res()res, @Req() req){
        const user=req.user
        const tenantID=user.tenant
        const data=req.body
        const usuario=await this.usuarioService.createUsuario(data,tenantID)
        res.status(200).send(usuario)
    }

    @Get('getUsuarios/:filtro')
    @UseGuards(AuthGuard)
    async getUsuarios(@Res()res, @Req() req,@Param('filtro') filtro:any){
        const user=req.user
        const tenantID=user.tenant
        const usuarios=await this.usuarioService.getUsuarios(filtro,tenantID)
        res.status(200).send(usuarios)
    }

    @Put('cambioEstado/:id')
    @UseGuards(AuthGuard)
    async cambioEstado(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenantID=user.tenant
        const data=req.body
        const usuarios=await this.usuarioService.cambioEstado(id,data,tenantID)
        res.status(200).send(usuarios)
    }

    @Get('getUsuario/:id')
    @UseGuards(AuthGuard)
    async getUsuario(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenantID=user.tenant
        const usuario=await this.usuarioService.getUsuario(id,tenantID)
        res.status(200).send(usuario)
    }

    @Put('updateUsuario/:id')
    @UseGuards(AuthGuard)
    async updateUsuario(@Res()res, @Req() req,@Param('id') id:any){
        const user=req.user
        const tenantID=user.tenant
        const data=req.body
        const usuario=await this.usuarioService.updateUsuario(id,data,tenantID)
        res.status(200).send(usuario)
    }



    @Post('login')
    async login(@Res()res, @Req() req){
        const data=req.body
        const usuario=await this.usuarioService.login(data)       
        res.status(200).send(usuario)
    }
}

import {  Controller, Get, Post, Req, Res,  } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Controller('')
export class TenantController {

    constructor(
           private readonly tenantService: TenantService, 
                   
        ){}


        @Post('createTenant')
        async createTenant(@Res()res, @Req() req){
            const data=req.body
            const tenant=await this.tenantService.createTenant(data)
            res.status(200).send(tenant)
        }

        @Get('getTenants')
        
        async getTenants(@Res()res){
            const tenants=await this.tenantService.getTenants()
            res.status(200).send(tenants)
        }

        @Get('getTenantPorNombre')
        async getTenantPorNombre(@Res()res, @Req() req){
            const nombre=req.body
            const tenant=await this.tenantService.getTenantPorNombre(nombre)
            res.status(200).send(tenant)
        }

     

}

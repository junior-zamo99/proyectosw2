import { Controller, Post, Req, Res, UseGuards,Get, Param, Put } from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth/auth.guard';
import { LogService } from '../log/log.service';
import { IngresoService } from './ingreso.service';
import { FuncionalidadService } from '../funcionalidad/funcionalidad.service';

@Controller('')
export class IngresoController {

constructor(
    private readonly ingresoService: IngresoService,
    private readonly logService: LogService,
    private readonly funcionalidadService: FuncionalidadService
) { }



@Post('createIngreso')
@UseGuards(AuthGuard)
async createIngreso(@Res() res,@Req() req) {
    const data=req.body;
    const user=req.user;
    const tenant=user.tenant;
    const ingreso = await this.ingresoService.createIngreso(data, req.user,tenant);
    res.status(200).send(ingreso);
}



@Get('getIngresos/:inicio/:fin')
@UseGuards(AuthGuard)
async getIngresos(@Res() res, @Req() req, @Param('inicio') inicio,@Param('fin') fin) {
    const user=req.user;
    const tenant=user.tenant;
    const ingresos = await this.ingresoService.getIngresos(inicio,fin,tenant);
    res.status(200).send(ingresos);     

  }
  

  @Get('getIngreso/:id')
  @UseGuards(AuthGuard)
  async getIngreso(@Res() res, @Req() req, @Param('id') id) {
      const user=req.user;
      const tenant=user.tenant;
      const ingreso = await this.ingresoService.getIngreso(id,tenant);
      res.status(200).send(ingreso);     
  
    }


    @Put('cambiarEstadoIngreso/:id')
    @UseGuards(AuthGuard)
    async cambiarEstadoIngreso(@Res() res, @Req() req, @Param('id') id) {
            const user=req.user;
            const tenant=user.tenant;
            const data=req.body;
            const ingreso = await this.ingresoService.cambiarEstadoIngreso(id,data,tenant);
            res.status(200).send(ingreso);     
        
        }


      @Get('getIngresosAlmacen/:id')
      @UseGuards(AuthGuard)
      async getIngresosAlmacen(@Res() res, @Req() req, @Param('id') id){
        const user=req.user;
        const tenant=user.tenant;
        const ingresos = await this.ingresoService.getIngresosAlmacen(id,tenant);
        res.status(200).send(ingresos);     
      }

      @Post('createEgreso')
      @UseGuards(AuthGuard)
      async createEgreso(@Res() res,@Req() req) {
        console.log("entre")
          const user=req.user;
          const tenant=user.tenant;
          const data=req.body;
          const ingreso = await this.ingresoService.createEgreso(data, req.user,tenant);
          res.status(200).send(ingreso);
      }

      @Get('BuscarProductoAlmacen/:almacen/:producto/:variedad/:cantidad')
      @UseGuards(AuthGuard)
      async BuscarProductoAlmacen(@Res() res, @Req() req, @Param('almacen') almacen,@Param('producto') producto,@Param('variedad') variedad,@Param('cantidad') cantidad) {
      const user=req.user;
      const tenant=user.tenant;
        const ingresos = await this.ingresoService.BuscarProductoAlmacen( almacen,producto,variedad,cantidad,tenant);
        res.status(200).send(ingresos);     
      }
    


}



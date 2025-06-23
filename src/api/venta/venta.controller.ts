import { Controller,  Req, Res, UseGuards,Get, Param, Put } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { LogService } from '../log/log.service';
import { VentaService } from './venta.service';

@Controller('')
export class VentaController {
    constructor(
        private readonly ventaService: VentaService,
        private readonly logService: LogService,
       
    ) { }
    

    @Get('getVentas/:inicio/:fin')
    @UseGuards(AuthGuard)
    async getIngresos(@Res() res, @Req() req, @Param('inicio') inicio,@Param('fin') fin) {
  
        const user = req.user;
        const tenant = user.tenant;
        const ventas = await this.ventaService.getVentas(inicio,fin,tenant);
        res.status(200).send(ventas);     

    }

    @Get('getVentasConDetalles/:inicio/:fin')
    @UseGuards(AuthGuard)
    async getVentasConDetalles(@Res() res, @Req() req, @Param('inicio') inicio,@Param('fin') fin) {
        const user = req.user;
        const tenant = user.tenant;
        const ventas = await this.ventaService.getVentasConDetalles(inicio,fin,tenant);
        res.status(200).send(ventas);     

    }

    @Get('getVenta/:id')
  @UseGuards(AuthGuard)
  async getIngreso(@Res() res, @Req() req, @Param('id') id) {
    const user = req.user;
    const tenant = user.tenant;
      const ventas = await this.ventaService.getVenta(id,tenant);
      res.status(200).send(ventas);     
    }


    @Put('cambiarEstadoVenta/:id')
    @UseGuards(AuthGuard)
    async cambiarEstadoIngreso(@Res() res, @Req() req, @Param('id') id) {
            const data=req.body;
            const user = req.user;
            const tenant = user.tenant;
            const ventas = await this.ventaService.cambiarEstadoVenta(id,data,tenant);
            res.status(200).send(ventas);     
        
        }

}

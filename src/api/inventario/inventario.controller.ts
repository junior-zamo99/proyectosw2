import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { InventarioService } from './inventario.service';

@Controller('')
export class InventarioController {

constructor(
    private readonly inventarioService: InventarioService
){}
    
@Get('getProductosInventario/:filtro')
@UseGuards(AuthGuard)
async getProductos(@Res() res ,@Req() req,@Param('filtro') filtro){
    const user=req.user;
    const tenant=user.tenant;
    const productos = await this.inventarioService.getProductosInventario(filtro,tenant);
    res.status(200).json(productos);
}

@Get('getVariacionInventario/:id')
@UseGuards(AuthGuard)
async getVariacionInventario(@Res() res ,@Req() req,@Param('id') id){
    const user=req.user;
    const tenant=user.tenant;
    const productos = await this.inventarioService.getVariacionInventario(id,tenant);
    res.status(200).json(productos);
}



}

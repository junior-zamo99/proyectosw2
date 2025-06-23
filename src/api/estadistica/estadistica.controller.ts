import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EstadisticaService } from './estadistica.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('estadisticas')
export class EstadisticaController {
  constructor(private readonly estadisticaService: EstadisticaService) { }

  @Get('total-ventas')
  @UseGuards(AuthGuard)
  async totalVentas(
    @Query('filtro') filtro?: string,
    @Query('agruparPorMes') agruparPorMes?: string
  ) {
    const agrupar = agruparPorMes === 'true';
    return await this.estadisticaService.totalVentas(filtro, agrupar);
  }


  @Get('cantidad-ventas')
  @UseGuards(AuthGuard)
  async cantidadVentasRealizadas(@Query('filtro') filtro?: string) {
    const { totalVentas, detallePorEstado } = await this.estadisticaService.cantidadVentasRealizadas(filtro);
    return { totalVentas, detallePorEstado };
  }

  @Get('ingresos')
  @UseGuards(AuthGuard)
  async ingresosGenerados(@Query('filtro') filtro?: string) {
    const detalle = await this.estadisticaService.ingresosGenerados(filtro);
    return { ingresos: detalle.totalIngresos, detallePorProducto: detalle.detallePorProducto };
  }

  @Get('productos-mas-vendidos')
  @UseGuards(AuthGuard)
  async productosMasVendidos(@Query('limit') limit?: string) {
    const detalle = await this.estadisticaService.productosMasVendidos(Number(limit));
    return detalle
  }
} 

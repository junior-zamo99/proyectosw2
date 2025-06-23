import { Controller, Get } from '@nestjs/common';
import { SegmentacionService } from './segmentation.service';

@Controller('segmentacion')
export class SegmentacionController {
  constructor(private readonly segmentacionService: SegmentacionService) {}

  @Get('segmentacion-resumen')
  async getSegmentacionResumen() {
    return this.segmentacionService.obtenerResumenSegmentacion();
  }

  @Get('clientes-normalizados')
  async getClientesNormalizados() {
    return this.segmentacionService.obtenerClientesNormalizados();
  }

  @Get('consolidado')
  async obtenerConsolidadoClientes() {
    return await this.segmentacionService.obtenerConsolidadoClientes();
  }

  
}

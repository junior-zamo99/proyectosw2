import { Controller, Get, Param } from '@nestjs/common';
import { RecomendacionService } from './recomendacion.service';

@Controller('api/recomendaciones')
export class RecomendacionController {
  constructor(private readonly recomendacionService: RecomendacionService) {}

  @Get('populares')
  async getPopulares() {
    return await this.recomendacionService.obtenerProductosPopulares();
  }

  @Get(':clienteId')
  async getRecomendados(@Param('clienteId') clienteId: string) {
    return await this.recomendacionService.obtenerProductosRecomendados(clienteId);
  }
}

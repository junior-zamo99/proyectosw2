import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegresionService } from './regresion.service';

@Controller('regresion')
export class RegresionController {
  constructor(private readonly regresionService: RegresionService) {}

  @Get('historico')
  async getHistoricalData() {
    return this.regresionService.getHistoricalData();
  }

  @Post('predecir')
  async getPredictions(@Body() body: { meses?: number }) {
    return this.regresionService.getPredictions(body.meses || 8);
  }

  @Get('dashboard')
  async getDashboardData() {
    return this.regresionService.getDashboardData();
  }

  @Get('metricas')
  async getModelMetrics() {
    return this.regresionService.getModelMetrics();
  }
}
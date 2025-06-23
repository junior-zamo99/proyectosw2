
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegresionService {
  private readonly logger = new Logger(RegresionService.name);
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // URL de tu API FastAPI desplegada en Render
    this.apiUrl = this.configService.get<string>('REGRESION_API_URL') || 
      'https://plankton-app-z3kke.ondigitalocean.app';
  }

  /**
   * Obtiene datos históricos de ventas
   */
  async getHistoricalData() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/historical`)
      );
      return response.data;
    } catch (error) {
      this.handleError('Error obteniendo datos históricos', error);
    }
  }

  /**
   * Genera predicciones de ventas para los próximos meses
   */
  async getPredictions(meses: number = 8) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/predict`, { meses })
      );
      return response.data;
    } catch (error) {
      this.handleError('Error generando predicciones', error);
    }
  }

  /**
   * Obtiene datos combinados para mostrar en dashboard
   */
  async getDashboardData() {
    try {
      const [historico, predicciones] = await Promise.all([
        this.getHistoricalData(),
        this.getPredictions(8),
      ]);

      return {
        historico,
        predicciones,
        ultima_actualizacion: new Date().toISOString(),
      };
    } catch (error) {
      this.handleError('Error obteniendo datos para dashboard', error);
    }
  }

  /**
   * Obtiene métricas del modelo de regresión
   */
  async getModelMetrics() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/metrics`)
      );
      return response.data;
    } catch (error) {
      this.handleError('Error obteniendo métricas del modelo', error);
    }
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(message: string, error: any) {
    this.logger.error(`${message}: ${error.message}`, error.stack);
    
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `${message}: ${error.message}`,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
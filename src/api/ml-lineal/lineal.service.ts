import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';

@Injectable()
export class LinealService {
  private readonly apiUrl: string;
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('PREDICTION_API_URL') || 'https://lionfish-app-6fmwa.ondigitalocean.app/api';
  }

  async predecirVentasCategoria(categoriaId: string, meses: number = 3, incluirGrafico: boolean = true): Promise<any> {
    try {
      const response = await this.httpService.post(`${this.apiUrl}/predict`, {
        categoria: categoriaId,
        meses: meses,
        incluir_grafico: incluirGrafico
      }).pipe(map(res => res.data)).toPromise();
      
      return response;
    } catch (error) {
      console.error('Error al obtener predicción:', error);
      throw new Error('No se pudo obtener la predicción');
    }
  }

  async listarCategorias(): Promise<any> {
    try {
      const response = await this.httpService.get(`${this.apiUrl}/categorias`)
        .pipe(map(res => res.data)).toPromise();
      
      return response;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return [];
    }
  }

  async obtenerTendencias(): Promise<any> {
    try {
      const response = await this.httpService.get(`${this.apiUrl}/predicciones/tendencias`)
        .pipe(map(res => res.data)).toPromise();
      
      return response;
    } catch (error) {
      console.error('Error al obtener tendencias:', error);
      return {
        categorias_tendencia: [],
        productos_destacados: []
      };
    }
  }
}
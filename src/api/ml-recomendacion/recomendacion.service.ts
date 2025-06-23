import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // 👈 Importarlo desde @nestjs/axios
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios'; // 👈 Importa AxiosResponse para tipar la respuesta

@Injectable()
export class RecomendacionService {
  private readonly API_RECOMENDACION_BASE = 'https://endpointrecomendacion-qjj5u.ondigitalocean.app/api/productos'; 

  constructor(private readonly httpService: HttpService) {}

  async obtenerProductosPopulares(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${this.API_RECOMENDACION_BASE}/populares`)
      );
      return response.data;
      
    } catch (error) {
      console.error('Error obteniendo productos populares:', error);
      throw new Error('Error al obtener productos populares');
    }
  }

  async obtenerProductosRecomendados(clienteId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${this.API_RECOMENDACION_BASE}/recomendados/${clienteId}`)
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo recomendaciones individuales:', error);
      throw new Error('Error al obtener recomendaciones para el cliente');
    }
  }
}

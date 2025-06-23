import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map, catchError } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class ArbolService {
    private readonly apiUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiUrl = this.configService.get<string>('ARBOL_API_URL') || 'https://ml-arbol-hon2b.ondigitalocean.app/api';
    }

    //? Métodos para el manejo de ciclos temporales y de producto
    async getCiclosTemporal(tipoCliclo: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/cycle/temporal/simple`, {
                    params: { cycle_type: tipoCliclo }
                }).pipe(
                    map(res => res.data),
                    catchError(e => throwError(() => new Error(`Error obteniendo ciclos temporales: ${e.message}`)))
                )
            );

            return response;
        } catch (error) {
            console.error('Error en ciclos temporales:', error);
            throw new Error('No se pudieron obtener los ciclos temporales');
        }
    }

    async getCiclosProducto(tipoCliclo: string, productoId?: string): Promise<any> {
        try {
            const params: any = { cycle_type: tipoCliclo };
            if (productoId) {
                params.product_id = productoId;
            }

            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/cycle/product/simple`, { params })
                    .pipe(
                        map(res => res.data),
                        catchError(e => throwError(() => new Error(`Error obteniendo ciclos de producto: ${e.message}`)))
                    )
            );

            return response;
        } catch (error) {
            console.error('Error en ciclos de producto:', error);
            throw new Error('No se pudieron obtener los ciclos de producto');
        }
    }

    async getDebugInfo(): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/cycle/debug`)
                    .pipe(
                        map(res => res.data),
                        catchError(e => throwError(() => new Error(`Error obteniendo debug info: ${e.message}`)))
                    )
            );

            return response;
        } catch (error) {
            console.error('Error obteniendo debug info:', error);
            throw new Error('No se pudo obtener la información de diagnóstico');
        }
    }

    //? Métodos para el manejo de predicciones de inventario
    async predecirInventario(productos: any[]): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.apiUrl}/inventory/predict`, { productos })
                    .pipe(
                        map(res => res.data),
                        catchError(e => throwError(() => new Error(`Error en predicción: ${e.message}`)))
                    )
            );

            return response;
        } catch (error) {
            console.error('Error en predicción de inventario:', error);
            throw new Error('No se pudo realizar la predicción');
        }
    }

    async obtenerAnalisis(limite: number = 10): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/inventory/analysis`, {
                    params: { limit: limite }
                }).pipe(
                    map(res => res.data),
                    catchError(e => throwError(() => new Error(`Error obteniendo análisis: ${e.message}`)))
                )
            );

            return response;
        } catch (error) {
            console.error('Error en análisis de inventario:', error);
            throw new Error('No se pudo obtener el análisis de inventario');
        }
    }

    async obtenerCriticos(limite: number = 50, offset: number = 0): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/inventory/critical`, {
                    params: { limit: limite, offset }
                }).pipe(
                    map(res => res.data),
                    catchError(e => throwError(() => new Error(`Error obteniendo productos críticos: ${e.message}`)))
                )
            );

            return response;
        } catch (error) {
            console.error('Error obteniendo productos críticos:', error);
            throw new Error('No se pudieron obtener los productos críticos');
        }
    }

    async obtenerRecomendaciones(limite: number = 20, diasMinimos: number = 14): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/inventory/recommendations`, {
                    params: { limit: limite, min_days: diasMinimos }
                }).pipe(
                    map(res => res.data),
                    catchError(e => throwError(() => new Error(`Error obteniendo recomendaciones: ${e.message}`)))
                )
            );

            return response;
        } catch (error) {
            console.error('Error obteniendo recomendaciones:', error);
            throw new Error('No se pudieron obtener las recomendaciones');
        }
    }

    //? Métodos para el manejo del modelo de ML
    async obtenerInfoModelo(): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/model/info`)
                    .pipe(
                        map(res => res.data),
                        catchError(e => throwError(() => new Error(`Error obteniendo info del modelo: ${e.message}`)))
                    )
            );

            return response;
        } catch (error) {
            console.error('Error obteniendo info del modelo:', error);
            throw new Error('No se pudo obtener información del modelo');
        }
    }

    async entrenarModelo(): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.apiUrl}/model/train`, {})
                    .pipe(
                        map(res => res.data),
                        catchError(e => throwError(() => new Error(`Error entrenando modelo: ${e.message}`)))
                    )
            );

            return response;
        } catch (error) {
            console.error('Error entrenando modelo:', error);
            throw new Error('No se pudo entrenar el modelo');
        }
    }

    async obtenerVersiones(): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/model/versions`)
                    .pipe(
                        map(res => res.data),
                        catchError(e => throwError(() => new Error(`Error obteniendo versiones: ${e.message}`)))
                    )
            );

            return response;
        } catch (error) {
            console.error('Error obteniendo versiones:', error);
            throw new Error('No se pudieron obtener las versiones del modelo');
        }
    }

    async obtenerVersion(versionId: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/model/versions/${versionId}`)
                    .pipe(
                        map(res => res.data),
                        catchError(e => throwError(() => new Error(`Error obteniendo versión: ${e.message}`)))
                    )
            );

            return response;
        } catch (error) {
            console.error('Error obteniendo versión:', error);
            throw new Error('No se pudo obtener la versión del modelo');
        }
    }

    async activarVersion(versionId: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.apiUrl}/model/versions/${versionId}/activate`, {})
                    .pipe(
                        map(res => res.data),
                        catchError(e => throwError(() => new Error(`Error activando versión: ${e.message}`)))
                    )
            );

            return response;
        } catch (error) {
            console.error('Error activando versión:', error);
            throw new Error('No se pudo activar la versión del modelo');
        }
    }

    async compararVersiones(version1Id: string, version2Id: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}/model/versions/compare`, {
                    params: { version1_id: version1Id, version2_id: version2Id }
                }).pipe(
                    map(res => res.data),
                    catchError(e => throwError(() => new Error(`Error comparando versiones: ${e.message}`)))
                )
            );

            return response;
        } catch (error) {
            console.error('Error comparando versiones:', error);
            throw new Error('No se pudieron comparar las versiones del modelo');
        }
    }
}
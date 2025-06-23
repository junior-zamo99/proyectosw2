import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
//import axios from 'axios';

@Injectable()
export class SegmentacionService {
  private readonly API_BASE = 'https://endpointsegmentacion-ykgn9.ondigitalocean.app/api';
  private readonly API_BASE_CLIENTES = 'https://endpointsegmentacion-ykgn9.ondigitalocean.app/api'; 


  constructor(private readonly httpService: HttpService) {}



  async obtenerResumenSegmentacion() {
    const respuesta = await firstValueFrom(
      this.httpService.get(`${this.API_BASE}/segmentation/status`)
    );
    return respuesta.data;
  }

  async obtenerClientesNormalizados() {
    const [normalizadosRes, originalesRes] = await Promise.all([
      firstValueFrom(this.httpService.get(`${this.API_BASE}/segmentation/customers`)),
      firstValueFrom(this.httpService.get(`${this.API_BASE}/clientes`)),
    ]);

    const clientesNormalizados = normalizadosRes.data.clientes;
    const clientesOriginales = originalesRes.data.clientes;

    const mapaFullnames = new Map(
      clientesOriginales.map((cliente: any) => [cliente.cliente_id, cliente.fullname])
    );

    const clientesConNombre = clientesNormalizados.map((cli: any) => ({
      cliente_id: cli.cliente_id,
      fullname: mapaFullnames.get(cli.cliente_id) || 'Nombre desconocido',
      num_compras: cli.num_compras,
      recencia_dias: cli.recencia_dias,
      total_gastado: cli.total_gastado,
      segmento: cli.segmento,
    }));

    return { clientes_normalizados: clientesConNombre };
  }

  async obtenerConsolidadoClientes() {
    const respuesta = await firstValueFrom(
      this.httpService.get(`${this.API_BASE_CLIENTES}/clientes/consolidado`)
    );
    return respuesta.data;
  }

}

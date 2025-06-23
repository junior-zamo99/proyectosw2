import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EstadisticaService {
  constructor(
    @InjectModel('venta') private readonly ventaModel,
    @InjectModel('ventaDetalle') private readonly ventaDetalleModel,
    @InjectModel('ingreso') private readonly ingresoModel,
  ) { }

  async totalVentas(filtro?: string, agruparPorMes: boolean = false) {
    let matchStage = {};

    // ⚠️ Solo aplicamos el filtro si no agrupamos por mes
    if (filtro && !agruparPorMes) {
      matchStage = this.getFechaFiltro(filtro);
    }

    const pipeline: any[] = [
      { $match: matchStage }
    ];

    if (agruparPorMes) {
      pipeline.push(
        {
          $group: {
            _id: { mes: { $month: '$createdAT' }, anio: { $year: '$createdAT' } },
            total: { $sum: '$total' }
          }
        },
        { $sort: { '_id.anio': 1, '_id.mes': 1 } },
        {
          $project: {
            _id: 0,
            mes: '$_id.mes',
            anio: '$_id.anio',
            total: 1
          }
        }
      );
    } else {
      pipeline.push({
        $group: { _id: null, total: { $sum: '$total' } }
      });
    }

    const resultado = await this.ventaModel.aggregate(pipeline);
    return agruparPorMes ? resultado : (resultado.length > 0 ? resultado[0].total : 0);
  }

  async cantidadVentasRealizadas(filtro?: string): Promise<any> {
    let matchStage = {};

    // 👇 Solo filtramos si se especifica
    if (filtro && filtro !== 'todos') {
      matchStage = this.getFechaFiltro(filtro);
    }

    const resultado = await this.ventaModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { estado: "$estado", mes: { $month: "$createdAT" }, anio: { $year: "$createdAT" } },
          cantidad: { $sum: 1 }
        }
      },
      { $sort: { '_id.anio': 1, '_id.mes': 1 } }
    ]);

    const totalVentas = resultado.reduce((acc, curr) => acc + curr.cantidad, 0);
    const detallePorEstado = resultado.map(item => ({
      estado: item._id.estado,
      mes: this.getNombreMes(item._id.mes),
      anio: item._id.anio,
      cantidad: item.cantidad
    }));

    return { totalVentas, detallePorEstado };
  }

  async ingresosGenerados(filtro?: string): Promise<any> {
    let matchStage = {};

    // 👇 Solo filtramos si no pedimos "todos"
    if (filtro && filtro !== 'todos') {
      matchStage = this.getFechaFiltro(filtro);
    }

    const resultado = await this.ventaDetalleModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'productos',
          localField: 'producto',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: '$productoInfo' },
      {
        $group: {
          _id: '$productoInfo.titulo',
          ingresos: { $sum: { $multiply: ['$cantidad', '$precio'] } },
          cantidadVendida: { $sum: '$cantidad' }
        }
      },
      { $sort: { ingresos: -1 } }
    ]);

    const totalIngresos = resultado.reduce((acc, curr) => acc + curr.ingresos, 0);
    return { totalIngresos, detallePorProducto: resultado };
  }

  async productosMasVendidos(limit: string | number = 5): Promise<any[]> {
    const limitNumber = Number(limit);
    if (isNaN(limitNumber) || limitNumber <= 0) {
      throw new Error("El parámetro 'limit' debe ser un número válido mayor a 0.");
    }

    const resultado = await this.ventaDetalleModel.aggregate([
      {
        $group: {
          _id: '$producto',
          totalVendidos: { $sum: '$cantidad' },
          totalGenerado: { $sum: { $multiply: ['$cantidad', '$precio'] } }
        }
      },
      { $sort: { totalVendidos: -1 } },
      { $limit: limitNumber },
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'productoInfo'
        }
      },
      { $unwind: '$productoInfo' },
      {
        $project: {
          _id: 0,
          producto: '$productoInfo.titulo',
          totalVendidos: 1,
          totalGenerado: 1
        }
      }
    ]);

    return resultado;
  }

  private getFechaFiltro(periodo: string): object {
    const fechaInicio = new Date();
    if (periodo === 'dia') {
      fechaInicio.setHours(0, 0, 0, 0);
    } else if (periodo === 'semana') {
      fechaInicio.setDate(fechaInicio.getDate() - 7);
    } else if (periodo === 'mes') {
      fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    } else if (periodo === 'anio') {
      fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
    }
    return { createdAT: { $gte: fechaInicio } };
  }

  private getNombreMes(numeroMes: number): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[numeroMes - 1];
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';

@Injectable()
export class ReporteService {
  constructor(
    @InjectModel('venta') private readonly ventaModel: Model<any>,
    @InjectModel('ingreso') private readonly ingresoModel: Model<any>,
    @InjectModel('ingresoDetalle') private readonly ingresoDetalleModel: Model<any>,
    @InjectModel('ventaDetalle') private readonly ventaDetalleModel: Model<any>,
  ) { }

  async obtenerDatosPorRango(entidad: string, inicio: string, fin: string,tenant:any) {
    try {
     
      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);

      if (fechaFin < fechaInicio) {
        return { success: false, message: "La fecha de fin no puede ser menor que la fecha de inicio." };
      }

     if(entidad === 'ventas'){
      
        const datos = await this.ventaModel.find({
          createdAT: {
            $gte: fechaInicio,
            $lte: fechaFin
          },
tenant:tenant
        }).populate('cliente');
        

       
        return { success: true, entidad:entidad, data: datos };
      }else if(entidad === 'ingresos'){
        const datos = await this.ingresoModel.find({
          createdAT: {
            $gte: fechaInicio,
            $lte: fechaFin
          },
          tenant:tenant,
          tipo: 'Ingreso'
        }).populate('usuario').populate('proveedor').populate('almacen');

        return { success: true, entidad:entidad, data: datos };
      }else if(entidad === 'egresos'){
        const datos = await this.ingresoModel.find({
          createdAT: {
            $gte: fechaInicio,
            $lte: fechaFin
          },
          tenant:tenant,
          tipo: 'Egreso'

        }).populate('usuario').populate('proveedor').populate('almacen');

        return { success: true, entidad:entidad, data: datos };
      }else if(entidad === 'compras'){
        const datos = await this.ingresoModel.find({
          createdAT: {
            $gte: fechaInicio,
            $lte: fechaFin
          },
          tipo: 'Compra'
        ,tenant:tenant
        }).populate('usuario').populate('proveedor').populate('almacen');
        
        return { success: true, entidad:entidad, data: datos };
      }else{
        return { success: false, message: "La entidad seleccionada no es válida." };
      }

      

     
    } catch (error) {
      console.error("Error en obtenerDatosPorRango:", error);
      return { success: false, message: "Ocurrió un error al obtener los datos." };
    }
  }


  async obtenerDetallesPorRango(entidad: string, inicio: string, fin: string,tenant:any) {

    const detalles = [];
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    if (fechaFin < fechaInicio) {
      return { success: false, message: "La fecha de fin no puede ser menor que la fecha de inicio." };
    }
    
    if(entidad === 'ventas'){
      const ventas = await this.ventaModel.find({
        createdAT: {
          $gte: fechaInicio,
          $lte: fechaFin
        },
        tenant:tenant
      });

      for (const venta of ventas) {
        const encontrado = await this.ventaDetalleModel.find({ venta: venta._id,tenant:tenant }).populate('producto').populate('variedad').populate('cliente');
        detalles.push(...encontrado);
      }

      return { success: true, entidad:entidad, data: detalles };
    }else if(entidad === 'ingresos'){
      const ingresos = await this.ingresoModel.find({
        createdAT: {
          $gte: fechaInicio,
          $lte: fechaFin
        },
        tipo: 'Ingreso',
        tenant:tenant
      })

      for (const ingreso of ingresos) {
        const encontrado = await this.ingresoDetalleModel.find({ ingreso: ingreso._id,tenant:tenant }).populate('producto_variedad').populate('producto').populate('almacen');
        detalles.push(...encontrado);
      }



      return { success: true, entidad:entidad, data: detalles };

    }else if(entidad === 'egresos'){
      const egresos = await this.ingresoModel.find({
        createdAT: {
          $gte: fechaInicio,
          $lte: fechaFin
        },
        tipo: 'Egreso',
        tenant:tenant
      });

      for (const egreso of egresos) {
        const encontrado = await this.ingresoDetalleModel.find({ ingreso: egreso._id,tenant:tenant }).populate('producto_variedad').populate('producto').populate('almacen');
        detalles.push(...encontrado);
      }

      return { success: true, entidad:entidad, data: detalles };
    }else if(entidad === 'compras'){
      const compras = await this.ingresoModel.find({
        createdAT: {
          $gte: fechaInicio,
          $lte: fechaFin
        },
        tipo: 'Compra',
        tenant:tenant
      });

      for (const compra of compras) {
        const encontrado = await this.ingresoDetalleModel.find({ ingreso: compra._id,tenant:tenant }).populate('producto_variedad').populate('producto').populate('almacen');
        detalles.push(...encontrado);
      }

      console.log('detalles del servicio', detalles);

      return { success: true, entidad:entidad, data: detalles };
    }

    
    

  }


}

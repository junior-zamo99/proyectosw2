
import { Schema } from "mongoose";

export const IngresoDetalleSchema = new Schema({
    ingreso: {
        type: Schema.Types.ObjectId,
        ref: 'ingreso',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'producto',
        required: true
    },
    venta: {
        type: Schema.Types.ObjectId,
        ref: 'venta',
        required: false
    },
    ventaDetalle: {
        type: Schema.Types.ObjectId,
        ref: 'ventaDetalle',
        required: false
    },
    producto_variedad: {
        type: Schema.Types.ObjectId,
        ref: 'producto_variedad',
        required: true
    },
    almacen: {
        type: Schema.Types.ObjectId,
        ref: 'almacen',

    },
    precioUnidad: {
        type: Number,
        required: true
    },
    codigo: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    estado_: {
        type: String,
        required: true,
        default: 'Procesado'
    },
     tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
    createdAT: { type: Date, default: Date.now }
});
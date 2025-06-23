
import { Schema } from "mongoose";

export const IngresoSchema = new Schema({
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    proveedor:{
        type:Schema.Types.ObjectId,
        ref:'proveedor',
    },
    almacen:{
        type:Schema.Types.ObjectId,
        ref:'almacen',
    },
    total:{
        type:Number,
        required: false   
    },
    tipo:{
        type:String,
    },
    razon:{
        type:String,
    },
    codigo:{
        type:Number,
        required: true
    },
    estado:{
        type:String,
        default:'Procesado',
        required: true
    },
     tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
    createdAT: { type: Date, default: Date.now }


});
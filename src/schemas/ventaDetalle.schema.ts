

import { Schema } from "mongoose";

export const VentaDetalleSchema = new Schema({
    cliente:{
        type: Schema.Types.ObjectId,
        ref: 'cliente',
        required: true
    },
    venta:{
        type: Schema.Types.ObjectId,
        ref: 'venta',
        required: true
    },
    producto:{
        type: Schema.Types.ObjectId,
        ref: 'producto',
        required: true
    },
    variedad:{
        type: Schema.Types.ObjectId,
        ref: 'producto_variedad',
        required: true
    },
    
    cantidad:{
        type:Number,
        required: true
    },
     tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
    precio:{
        type:Number,
        required: true
    },
    createdAT: { type: Date, default: Date.now }


});
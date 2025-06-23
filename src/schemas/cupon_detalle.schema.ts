import { Schema } from 'mongoose'

export const CuponDetalleSchema = new Schema({
    cupon:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'cupon'
    },
    producto:{
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'producto'
    },
    tipo:{
        type: String,
        require: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        require: false,
        ref: 'categoria'
    },
    createdAT:{
        type: Date,
        default: Date.now
    },
    updatedAT:{
        type: Date,
        default: Date.now
    },
     tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
})
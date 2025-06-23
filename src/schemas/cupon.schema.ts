
import { Schema } from 'mongoose'

export const CuponSchema = new Schema({
    codigo:{
        type: String,
        require: true,
        trim: true,
    },
    tipo:{
        type: String,
        require: true,
        trim: true,
    },
    descuento:{
        type: Number,
        require: true,
    },
    f_fin:{
        type: Date,
        require: true,
    },
    f_inicio:{
        type: Date,
        require: true,
    },
    canjes:{
        type: Number,
        require: true,
        default: 0
    },
    monto_max:{
        type: Number,
        require: true,
        default: 1
    },
    estado:{
        type: Boolean,
        default:false
    },
    createdAT:{
        type: Date,
        default: Date.now
    },
     tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
    updatedAT:{
        type: Date,
        default: Date.now
    }
})
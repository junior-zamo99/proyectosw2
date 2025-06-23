import { Schema } from 'mongoose';

export const LogSchema = new Schema({
    usuario: {
        type: String,
        require: true,
        trim: true,
    },
    accion: {
        type: String,
        require: true,
        trim: true,
    },
    fecha: {
        type: Date,
        require: true,
        trim: true,
    },
    detalles: {
        type: Schema.Types.Mixed,
        require: false,
        trim: true,
    },
    ip: { 
        type: String,
        require: false,
        trim: true,
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        require: true,
      },
       tenant_id: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
    createdAT: { type: Date, default: Date.now },
});


import { Schema } from 'mongoose';

export const ProductoSchema = new Schema({
  id: { 
    type: String, 
    required: true 
  },
  nombre: { 
    type: String, 
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true, 
    min: 1 
  },
   tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  precio: { 
    type: Number, 
    required: true, 
    min: 0 
  }
});

export const TransaccionSchema = new Schema({
  transaccion_id: { 
    type: String, 
    required: true,
    unique: true
  },
  cliente_id: { 
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  fecha_compra: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  monto: { 
    type: Number, 
    required: true,
    min: 0
  },
  tenant:{
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  productos: [ProductoSchema]
}, {
  timestamps: true
});

// Índices para optimizar consultas
TransaccionSchema.index({ cliente_id: 1 });
TransaccionSchema.index({ fecha_compra: -1 });
TransaccionSchema.index({ transaccion_id: 1 });
import { Schema } from 'mongoose';

export const SegmentacionSchema = new Schema({
  cliente_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: true 
  },
  recencia_dias: { 
    type: Number, 
    required: true 
  },
  num_compras: { 
    type: Number, 
    required: true 
  },
  total_gastado: { 
    type: Number, 
    required: true 
  },
  segmento: { 
    type: String, 
    required: true 
  }, 
  segmento_numero: { 
    type: Number, 
    required: true 
  },
  fecha_calculo: { 
    type: Date, 
    default: Date.now 
  },
   tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
}, {
  timestamps: true
});

// Índices para optimizar consultas
SegmentacionSchema.index({ cliente_id: 1 }, { unique: true });
SegmentacionSchema.index({ segmento: 1 });
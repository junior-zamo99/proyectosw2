import { Schema } from 'mongoose';

export const SegmentoMetricaSchema = new Schema({
  segmento: { 
    type: String, 
    required: true,
    unique: true
  },
  recencia_promedio: { 
    type: Number, 
    required: true 
  },
  frecuencia_promedio: { 
    type: Number, 
    required: true 
  },
  monetario_promedio: { 
    type: Number, 
    required: true 
  },
  valor_cliente: { 
    type: Number, 
    required: true 
  },
  clientes_total: { 
    type: Number, 
    required: true 
  },
   tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  fecha_calculo: { 
    type: Date, 
    default: Date.now 
  }
});
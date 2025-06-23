import { Schema } from 'mongoose';

export const TenantSchema = new Schema({
  nombreTienda: {
    type: String,
    required: true,
    trim: true,
  },
  tipo:{
    type: Number,
    required: true,
    trim: true,
  },
  fecha_suscripcion: {
    type: Date,
    required: true,
 
  },
  fecha_vencimiento: {
    type: Date,
    required: true,
  },
  estado:{
    type: Boolean,
    required: true,
    default: true,
  },

  
});
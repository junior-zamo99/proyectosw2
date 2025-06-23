import { Schema } from 'mongoose';

export const ConfigTiendaTenantSchema = new Schema({
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  logo: {
    type: String,
    require: false,
    trim: true,
  },
  colorPrimario: {
    type: String,
    require: false,
    trim: true,
  },
  colorSecundario: {
    type: String,
    require: false,
    trim: true,
  },
  contacto: {
    type: Schema.Types.ObjectId,
    ref: 'contacto',
    require: false,
  },
    banner: {
    type: String,
    require: false,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
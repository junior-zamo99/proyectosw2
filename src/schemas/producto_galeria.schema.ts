import { Schema } from 'mongoose';

export const Producto_galeriaSchema = new Schema({
  titulo: {
    type: String,
    require: true,
    trim: true,
  },
   tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  imagen: { type: String, require: true, trim: true },
  producto: { type: Schema.Types.ObjectId, ref: 'Producto' },
  createdAT: { type: Date, default: Date.now }
});

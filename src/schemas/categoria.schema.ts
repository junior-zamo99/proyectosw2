import { Schema } from 'mongoose';

export const CategoriaSchema = new Schema({
  titulo: {
    type: String,
    require: true,
    trim: true,
  },
  slug: {
    type: String,
    require: true,
    trim: true,
  },
  genero: {
    type: String, 
    require: true,
    trim: true,
  },
  subcategorias: [
    {
      type: Object,

      trim: true,
    },
  ],
  estado: {
    type: Boolean,
    default: true,
    require: true,
    trim: true,
  },
   tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  createdAT: { type: Date, default: Date.now },
});

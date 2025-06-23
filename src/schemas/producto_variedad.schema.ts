import { Schema } from 'mongoose';

export const Producto_variedadSchema = new Schema({
  
  hxd:{ type: String, require: true, trim: true },
  color:{ type: String, require: true, trim: true },
  talla:{ type: String, require: true, trim: true },
  sku:{ type: String, require: true, trim: true },
  cantidad:{ type: Number, require: true, trim: true,default:0 },
  precio: {
    type: Number,
    default: 0,
    require: true,
    trim: true,
  },
   tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  producto:{type:Schema.Types.ObjectId,ref:'producto'},
  createdAT: { type: Date, default: Date.now }
});

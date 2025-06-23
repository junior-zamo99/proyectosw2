import { Schema } from 'mongoose';

export const CarritoSchema = new Schema({
  titulo: {
    type: String,
    require: true,
    trim: true,
  },
 producto:{
    type: Schema.Types.ObjectId,
    ref: 'producto',
    require: true,
    trim: true,
 },
 producto_variedad:{
    type: Schema.Types.ObjectId,
    ref: 'producto_variedad',
    require: true,
    trim: true,
 },
    cantidad:{
        type: Number,
        require: true,
        trim: true,},
    cliente: {
    type: Schema.Types.ObjectId,
    ref: 'cliente',
    require: true,
    },
    tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  createdAT: { type: Date, default: Date.now },
});

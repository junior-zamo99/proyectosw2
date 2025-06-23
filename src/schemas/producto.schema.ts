import { Schema } from 'mongoose';

export const ProductoSchema = new Schema({
  titulo: {
    type: String,
    require: true,
    trim: true,
  },
  portada: {
    type: String,
    require: true,
    trim: true,
  },
  slug: {
    type: String,
    require: true,
    trim: true,
  },
  descripcion: {
    type: String,
    require: true,
    trim: true,
  },   
  descuento: {
    type: Number,
    require: false,
    trim: true,      
  },
  etiqueta: {
    type: String,
    default:'Nuevo',
    require: true,          
    trim: true,
  },
  clasificacion: {
    type: String,
    require: true,
    trim: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    require: true,
    trim: true,
    ref: 'categoria',
  },
 subcategorias:{
    type:String,
    require:true
 },
 labels:[{
    type: Object,
    require:true
 }], 
  estado: {
    type: Boolean,
    default: false,
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

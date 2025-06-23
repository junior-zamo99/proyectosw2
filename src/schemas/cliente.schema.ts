import { Schema } from 'mongoose';

export const ClienteSchema = new Schema({
  nombres: {
    type: String,
    require: true,
    trim: true,
  },
  apellidos: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String, 
    require: true,
    trim: true,
  },
  email_validacion:{
    type: Boolean,
    default: true,
   
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  estado: {
    type: Boolean,
    default: true,
    require: true,
    trim: true,
  },
  fullname: {
    type: String,
    require: true,
    trim: true,
  },
  tenant:{
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
  createdAT: { type: Date, default: Date.now },
});

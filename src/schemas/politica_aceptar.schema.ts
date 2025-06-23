import { Schema } from "mongoose";


export const PoliticaAceptarSchema = new Schema({
  fecha: { type: Date, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'usuario', required: true },
  tenant: { type: Schema.Types.ObjectId, ref: 'tenant', required: true },
  version: { type: String, required: true },
});
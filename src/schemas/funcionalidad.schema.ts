import { Schema } from 'mongoose';

export const FuncionalidadSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true,
    },
    descripcion: {
        type: String,
        require: true,
        trim: true,
    },
    tipo:{
        type: Number,
        require: true,
        trim: true,
    },
    createdAT: { type: Date, default: Date.now }
});


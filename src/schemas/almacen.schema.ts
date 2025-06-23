import { Schema } from 'mongoose'


export const AlmacenSchema = new Schema({  
    nombre:{
        type: String,
        require: true,
        trim: true,
    },
    direccion:{
        type: String,
        require: true,
        trim: true,
    },
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        require: true,
    },
    })
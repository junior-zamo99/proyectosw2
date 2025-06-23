import { Schema } from 'mongoose'


export const RolSchema = new Schema({  
    nombre:{
        type: String,
        require: true,
        trim: true,
    },
     tenant: {
    type: Schema.Types.ObjectId,
    ref: 'tenant',
    require: true,
  },
    funcionalidades: [{
        type: Schema.Types.ObjectId,
        require: false,
        trim: true,
        ref: 'funcionalidad'
    }]
    })
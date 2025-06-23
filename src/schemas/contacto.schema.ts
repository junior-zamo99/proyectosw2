
import { Schema } from "mongoose";

export const ContactoSchema = new Schema({
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        require: true,
    },
    telefono: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    facebook:{
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    },
    twitter: {
        type: String,
        trim: true
    },
    whatsapp: {
        type: String,
        trim: true
    },
    tiktok: {
        type: String,
        trim: true
    },

});
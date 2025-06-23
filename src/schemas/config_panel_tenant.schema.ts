import { Schema } from "mongoose";

export const ConfigPanelTenantSchema = new Schema({
    
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        require: true,
    },
    logo:{
        type: String,
        require: false,
        trim: true
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

});

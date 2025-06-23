import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProveedorService {
    constructor(
        @InjectModel('proveedor' ) private proveedorModel
    ){}

    async createProveedor(data:any,tenant){
        try {
            data.tenant=tenant
            const proveedor= await this.proveedorModel.create(data)
            return {data:proveedor}
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo crear el proveedor'}  
        }
    }

    async getProveedores(tenant:any){
        try {
            const proveedores=await this.proveedorModel.find({tenant:tenant})
            return {data:proveedores}
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo obtener los proveedores'}  
        }
    }
}

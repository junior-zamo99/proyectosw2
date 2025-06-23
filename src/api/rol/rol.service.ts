import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RolService {

    constructor(
        @InjectModel('rol' ) private rolModel
    ){}

    async createRol(data:any, tenant:any) {
        try {
            data.tenant=tenant
            const rol= await this.rolModel.create(data)
            return {data:rol}
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo crear el rol'}  
        }
    }
    
    async getRoles(tenant:any){
        try {
            const roles=await this.rolModel.find({tenant:tenant}).populate('funcionalidades')
            return {data:roles}
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo obtener los roles'}  
        }
    }

    async updateRol(id: any, data: any,tenant:any) {
        try {
            data.tenant=tenant
            const rol = await this.rolModel.findOneAndUpdate({ _id: id,tenant:tenant }, {
                nombre: data.nombre,
                funcionalidades: data.funcionalidades,
                tenant: data.tenant
            });
            return rol;
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo actualizar el rol'}  
        }
    }

    async getRol(id: any,tenant:any) {
        try {
            const rol = await this.rolModel.findOne({ _id: id,tenant:tenant}).populate('funcionalidades');
            return rol;
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo obtener el rol '}  
        }
    }

}

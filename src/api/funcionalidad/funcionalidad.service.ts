import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FuncionalidadService {
    
    constructor(
        @InjectModel('funcionalidad' ) private funcionalidadModel
    ){}

    async createFuncionalidad(data:any){
        try {
            const funcionalidad=await this.funcionalidadModel.find({nombre:data.nombre})
            if(funcionalidad.length>0){
                return {data:undefined, message:'la funcionalidad ya existe'}
            }else{
                const nueva=await this.funcionalidadModel.create(data)
                return {data:nueva}
            }
            
         
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo crear la funcionalidad'}  
        }
    }

    async getFuncionalidades(){
        try {
            const funcionalidades= await this.funcionalidadModel.find()
            return {data:funcionalidades}
        } catch (error) {
            console.log(error)
            return{data:undefined, message:'no se pudo obtener las funcionalidades'}  
        }
    }
}

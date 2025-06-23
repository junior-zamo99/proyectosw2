import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LogService {

    constructor(
        @InjectModel('log','logsConnection') private logModel,
    ){}

    async registrarAccion(usuario, accion, detalles, ip,tenant){
        try {
            const data={
                usuario:usuario,
                accion:accion,
                detalles:detalles,
                fecha: new Date(),
                ip:ip,
                tenant:tenant
            }
            const reg= await this.logModel.create(data)
            return {data:reg}
        } catch (error) {
            return{data:undefined, message:'no se pudo registrar la accion'}
        }
    }
}

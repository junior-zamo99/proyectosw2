import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class EmailsService {

    constructor(
        @InjectModel('cliente') private readonly clienteModel,
        private readonly mailerService: MailerService,
        private jwtService: JwtService,
        private configService:ConfigService
    ){}

   async sendEmail(id:any,tenant:any){
        try {
            
            const cliente=await this.clienteModel.findOne({_id:id, tenant:tenant})


            if(cliente){
                
                const tokenEmail = this.jwtService.sign({
                    cliente:cliente._id,
                })

                console.log(tokenEmail)
                const context={
                    nombres:cliente.nombres.split(' ')[0].toUpperCase(),
                    apellidos:cliente.apellidos.split(' ')[0].toUpperCase(),
                    _id:cliente._id,
                    tokenEmail:tokenEmail,
                    url:'tiendasi2.azurewebsites.net'
                }


                await this.mailerService.sendMail({
                    to:cliente.email,
                    subject:'Bienvenido a Shopper',
                    template:'email-verification',
                    context:context
                })
            }else{
                return 'No se encontro el cliente'
            }

            
        } catch (error) {
            console.log(error)
            return 'Error al enviar el correo'
        }
   }

}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClienteSchema } from 'src/schemas/cliente.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path'
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'cliente', schema: ClienteSchema}
        ]),MailerModule.forRoot({
            transport:{
              service:'Gmail',
              auth:{
                user:'junior.zf.99@gmail.com',
                pass:'exis igvj uegr tmjc'
              },
              tls:{
                rejectUnauthorized:false
              }
            },
            defaults:{
              from:'"Shopper" <junior.zf.99@gmail>'
            },
            template:{
              dir: path.join(__dirname,'..','..','..','src','./email'),
              adapter:new EjsAdapter(),
              options:{
                strict:false
              }
            },
            
          }),
          JwtModule.register({ 
            secret: 'junior',
          signOptions:{
            expiresIn:'1d'
          } }),
          ConfigModule.forRoot({
            isGlobal:true
          })
    ],
    controllers: [EmailsController],
    providers: [EmailsService],
    exports: [EmailsService]
})
export class EmailsModule {}

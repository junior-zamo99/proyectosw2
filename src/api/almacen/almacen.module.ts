import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AlmacenSchema } from 'src/schemas/almacen.schema';
import { AlmacenController } from './almacen.controller';
import { AlmacenService } from './almacen.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name:'almacen', schema: AlmacenSchema
            },
           
            
        ]),
        JwtModule.register({ 
            secret: 'junior',
          signOptions:{
            expiresIn:'1d'
          } }),
        ],
    controllers: [AlmacenController],
    providers: [AlmacenService],
})
export class AlmacenModule {}

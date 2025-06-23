import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RolSchema } from 'src/schemas/rol.schema';
import { LogModule } from '../log/log.module';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { FuncionalidadModule } from '../funcionalidad/funcionalidad.module';


@Module({
    imports: [
       
        MongooseModule.forFeature([
            {name:'rol',schema:RolSchema},
           
        ]),
        JwtModule.register({ 
            secret: 'junior',
          signOptions:{
            expiresIn:'1d'
          } }),
          LogModule,
          FuncionalidadModule,
           
    ],
    controllers: [RolController],
    providers: [RolService],
    
    
})
export class RolModule {}

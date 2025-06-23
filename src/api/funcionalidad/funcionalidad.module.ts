import { Module } from '@nestjs/common';
import { FuncionalidadService } from './funcionalidad.service';
import { FuncionalidadController } from './funcionalidad.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { LogModule } from '../log/log.module';
import { FuncionalidadSchema } from 'src/schemas/funcionalidad.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:'funcionalidad',schema:FuncionalidadSchema}
    ]),
    JwtModule.register({ 
      secret: 'junior',
    signOptions:{
      expiresIn:'1d'
    } }),
    LogModule
  ],
  providers: [FuncionalidadService],
  controllers: [FuncionalidadController],
  exports: [FuncionalidadService],
})
export class FuncionalidadModule {}

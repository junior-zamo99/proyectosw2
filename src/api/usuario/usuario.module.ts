import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { usuarioSchema } from 'src/schemas/usuario.schema';
import { JwtModule } from '@nestjs/jwt/dist';
import { LogModule } from '../log/log.module';
import { FuncionalidadModule } from '../funcionalidad/funcionalidad.module';
import { RolModule } from '../rol/rol.module';
import { RolSchema } from 'src/schemas/rol.schema';
import { FuncionalidadSchema } from 'src/schemas/funcionalidad.schema';
import { AdminInterceptorInterceptor } from 'src/interceptors/admin-interceptor/admin-interceptor.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClienteInterceptorInterceptor } from 'src/interceptors/cliente-interceptor/cliente-interceptor.interceptor';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:'usuario',schema:usuarioSchema},
      {name:'rol',schema:RolSchema},
      {name:'funcionalidad',schema:FuncionalidadSchema}
    ]),
    JwtModule.register({ 
      secret: 'junior',
    signOptions:{
      expiresIn:'1d'
    } }),
    LogModule,
    FuncionalidadModule,
    RolModule
  ],
  providers: [UsuarioService,
    {
      provide: APP_INTERCEPTOR,
      useClass:AdminInterceptorInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass:ClienteInterceptorInterceptor
    }],
  controllers: [UsuarioController],
  exports:[UsuarioService]
})
export class UsuarioModule {}

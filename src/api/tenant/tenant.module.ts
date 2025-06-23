import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantSchema } from 'src/schemas/tienda.schema';
import { JwtModule } from '@nestjs/jwt';
import { LogModule } from '../log/log.module';
import { FuncionalidadModule } from '../funcionalidad/funcionalidad.module';
import { RolModule } from '../rol/rol.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { usuarioSchema } from 'src/schemas/usuario.schema';
import { RolSchema } from 'src/schemas/rol.schema';
import { FuncionalidadSchema } from 'src/schemas/funcionalidad.schema';
import { TerminosAceptarSchema } from 'src/schemas/terminos_aceptar.schema';
import { PoliticaAceptarSchema } from 'src/schemas/politica_aceptar.schema';
@Module({
  imports:[
    MongooseModule.forFeature([
      {name:'tenant',schema:TenantSchema},
      {name :'usuario',schema:usuarioSchema},
      {name:'rol',schema:RolSchema},
      {name:'funcionalidad',schema:FuncionalidadSchema},
      {name:'terminos_aceptar',schema:TerminosAceptarSchema},
      {name:'politica_aceptar',schema:PoliticaAceptarSchema}
    
      
    ]),
    JwtModule.register({ 
      secret: 'junior',
    signOptions:{
      expiresIn:'1d'
    } }),
    LogModule,
    FuncionalidadModule,
    RolModule,
    UsuarioModule
  ],
  providers: [TenantService],
  controllers: [TenantController],
  exports:[TenantService]
})
export class TenantModule {}
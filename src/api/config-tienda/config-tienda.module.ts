import { Module } from '@nestjs/common';
import { ConfigTiendaService } from './config-tienda.service';
import { ConfigTiendaController } from './config-tienda.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantSchema } from 'src/schemas/tienda.schema';
import { ContactoSchema } from 'src/schemas/contacto.schema';
import { ConfigTiendaTenantSchema } from 'src/schemas/config_tienda_tenant.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
        {name:'tenant',schema:TenantSchema},
        {name:'configTienda',schema:ConfigTiendaTenantSchema},
        {name:'contacto',schema:ContactoSchema}
        
      ]),
    JwtModule.register({ 
                secret: 'junior',
              signOptions:{
                expiresIn:'1d'
              } }),],
  providers: [ConfigTiendaService],
  controllers: [ConfigTiendaController]
})
export class ConfigTiendaModule {}

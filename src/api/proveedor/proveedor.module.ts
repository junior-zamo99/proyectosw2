import { Module } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { JwtModule } from '@nestjs/jwt';
import { proveedorSchema } from 'src/schemas/proveedor.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProveedorController } from './proveedor.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
          name:'proveedor', schema: proveedorSchema
      },
      
  ]),
  JwtModule.register({ 
      secret: 'junior',
    signOptions:{
      expiresIn:'1d'
    } }),
  ],
  controllers: [ProveedorController],
  providers: [ProveedorService],
})
export class ProveedorModule {}

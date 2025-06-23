import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecomendacionService } from './recomendacion.service';
import { RecomendacionController } from './recomendacion.controller';

@Module({
  imports: [HttpModule],
  controllers: [RecomendacionController],
  providers: [RecomendacionService],
})
export class RecomendacionModule {}

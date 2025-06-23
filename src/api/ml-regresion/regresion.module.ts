import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RegresionService } from './regresion.service';
import { RegresionController } from './regresion.controller';


@Module({
  imports: [HttpModule],
  providers: [RegresionService],
  controllers: [RegresionController],
})
export class RegresionModule {}
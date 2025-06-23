import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LinealController } from './lineal.controller';
import { LinealService } from './lineal.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
  ],
  controllers: [LinealController],
  providers: [LinealService],
  exports: [LinealService],
})
export class LinealModule {}
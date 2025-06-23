import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ArbolController } from './arbol.controller';
import { ArbolService } from './arbol.service';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot(),
    ],
    controllers: [ArbolController],
    providers: [ArbolService],
    exports: [ArbolService],
})
export class ArbolModule { }
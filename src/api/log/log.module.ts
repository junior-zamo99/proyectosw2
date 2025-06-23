import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from 'src/schemas/log.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'log',
                schema: LogSchema,
            },
        ],'logsConnection'), JwtModule.register({ 
            secret: 'junior',
          signOptions:{
            expiresIn:'1d'
          } })
    ],
    controllers: [LogController],
    providers: [LogService],
    exports: [LogService],
})
export class LogModule {}

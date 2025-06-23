import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SegmentacionController } from './segmentation.controller';
import { SegmentacionService } from './segmentation.service';


@Module({
  imports: [HttpModule],
  controllers: [SegmentacionController],
  providers: [SegmentacionService],
})
export class SegmentacionModule {}

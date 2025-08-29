
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReviewController],
  providers: [PrismaService],
})
export class ReviewModule {}


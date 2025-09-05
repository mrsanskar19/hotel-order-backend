
import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ReviewController],
  providers: [PrismaService,ReviewService],
})
export class ReviewModule {}


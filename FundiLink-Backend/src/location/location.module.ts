import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LocationService } from './location.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [LocationController],
  providers: [PrismaService,LocationService],
})
export class LocationModule {}

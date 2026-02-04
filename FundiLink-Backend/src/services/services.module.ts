import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServicesService } from './services.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [ServicesController],
  providers: [PrismaService, ServicesService]
})
export class ServicesModule {}

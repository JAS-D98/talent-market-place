import { Module } from '@nestjs/common';
import { FundiApplicationsController } from './fundi_applications.controller';
import { FundiApplicationsService } from './fundi_applications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({ 
  imports:[PrismaModule],
  controllers: [FundiApplicationsController],
  providers:[FundiApplicationsService,PrismaService]
})
export class FundiApplicationsModule {}

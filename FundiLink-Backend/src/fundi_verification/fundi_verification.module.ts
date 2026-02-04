import { Module } from '@nestjs/common';
import { FundiVerificationService } from './fundi_verification.service';
import { FundiVerificationController } from './fundi_verification.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [FundiVerificationService,PrismaService],
  controllers: [FundiVerificationController]
})
export class FundiVerificationModule {}

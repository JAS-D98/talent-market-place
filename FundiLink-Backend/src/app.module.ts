import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesService } from './services/services.service';
import { ServicesModule } from './services/services.module';
import { FundiApplicationsService } from './fundi_applications/fundi_applications.service';
import { FundiApplicationsModule } from './fundi_applications/fundi_applications.module';
import { LocationService } from './location/location.service';
import { LocationModule } from './location/location.module';
import { FundiVerificationModule } from './fundi_verification/fundi_verification.module';

@Module({
  imports: [ConfigModule.forRoot( {
    isGlobal: true,
    envFilePath: ['.env',], // Load .env and .env.local files
    load: [() => ({
      PORT: process.env.PORT || 3000,
      DATABASE_URL: process.env.DATABASE_URL,
      JWT_SECRET: process.env.JWT_SECRET,
    })]
  }),AuthenticationModule, UsersModule, PrismaModule, ServicesModule, FundiApplicationsModule, LocationModule, FundiVerificationModule],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, AuthenticationService, PrismaService, ServicesService, FundiApplicationsService, LocationService],
})
export class AppModule {}

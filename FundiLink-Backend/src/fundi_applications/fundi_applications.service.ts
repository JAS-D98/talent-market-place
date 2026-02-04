import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFundiDto } from './dto/create-fundi.dto';

@Injectable()
export class FundiApplicationsService {
    constructor(private prisma:PrismaService){}

    async getFundiProfile(userId: string){
        try {
            const fundiProfile = await this.prisma.fundiProfile.findFirst({
                where: { userId },
            });
            if (!fundiProfile) {
                throw new BadRequestException("Fundi profile not found.");
            }
            return { success: true, data: fundiProfile };
        } catch (error) {
            console.error("Error getting fundi profile:", error);
            throw new BadRequestException("An error occurred while getting the fundi profile.");
        }
    }


    async getPendingFundiProfiles(){
        try {
            const fundiProfiles = await this.prisma.fundiProfile.findMany({
                where: { status: "PENDING" },
                include: {
                    user: true,
                    service: true,
                    location: true,
                }
            });
            if (!fundiProfiles) {
                throw new BadRequestException("No fundi profiles found.");
            }
            return { success: true, data: fundiProfiles };
        } catch (error) {
            console.error("Error getting fundi profiles:", error);
            throw new BadRequestException("An error occurred while getting the fundi profiles.");
        }
    }

    async getAllFundiProfiles(){
        try {
            const fundiProfiles = await this.prisma.fundiProfile.findMany({
                include: {
                    user: true,
                    service: true,
                    location: true,
                }
            });
            if (!fundiProfiles) {
                throw new BadRequestException("No fundi profiles found.");
            }
            return { success: true, data: fundiProfiles };
        } catch (error) {
            console.error("Error getting fundi profiles:", error);
            throw new BadRequestException("An error occurred while getting the fundi profiles.");
        }
    }

    

    async createFundiProfile(userId: string, payload: CreateFundiDto) {
        try {
        const { serviceId, hourlyRate, locationId, documents } = payload;
      
        // Check if this user already has a profile
        const existing = await this.prisma.fundiProfile.findFirst({
          where: { userId },
        });
        if (existing) {
          throw new BadRequestException("Fundi profile already exists.");
        }
      
        // Check if service exists
        const service = await this.prisma.service.findFirst({
          where: { id: serviceId },
        });
        if (!service) {
          throw new BadRequestException("Selected service does not exist.");
        }
      
        // Create profile
        const fundi = await this.prisma.fundiProfile.create({
          data: {
            userId,
            serviceId,
            hourlyRate,
            locationId,
            appliedDate: new Date(),
            documents,
            status: "PENDING",
          },
        });
      
        return { message: "Application submitted successfully.", success:true };
      } catch (error) {
        console.error("Error creating fundi profile:", error);
        throw new BadRequestException("An error occurred while creating the fundi profile.");
    }   
    }
}

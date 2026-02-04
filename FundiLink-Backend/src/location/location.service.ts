import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationResponse, LocationsResponse } from './location.interface';

@Injectable()
export class LocationService {
    constructor(private prisma:PrismaService){}

    async getLocations():Promise<LocationsResponse> {
        try {
            const locations = await this.prisma.location.findMany();
            if (!locations) {
                throw new BadRequestException('No locations found');
            }
            return { success: true, data:locations };
        } catch (error) {
            console.log("Error getting locations:", error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred during getting locations');
        }
    }


    async createLocation(payload:CreateLocationDto):Promise<LocationResponse> {
        try {
            const { name } = payload;

            const findLocation=await this.prisma.location.findFirst({
                where:{name}
            })

            if(findLocation){
                throw new BadRequestException('Location already exists');
            }

            const location = await this.prisma.location.create({
                data: {name}
            });
            return { success: true, message: 'Location created successfully' };
        } catch (error) {
            console.log("Error creating location:", error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred during creating location');
        }
    }


}

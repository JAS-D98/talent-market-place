import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { addServiceResponse, getServiceByIdResponse, getServicesResponse, updateServiceResponse } from './services.interface';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
    constructor(private prisma:PrismaService){}


    async getServices():Promise<getServicesResponse>{
        try {
            const services = await this.prisma.service.findMany();
            if (!services) {
                throw new BadRequestException('No services found');
            }
            return { success: true, data:services };
        } catch (error) {
            console.log("Error getting services:", error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred during sign up');
        }
    }

    async getServiceById(serviceId:string):Promise<getServiceByIdResponse>{
        try {
            const service = await this.prisma.service.findUnique({
                where: { id: serviceId }
            })
            if (!service) {
                throw new BadRequestException('No service found');
            }
            return { success: true, data:service };
        } catch (error) {
            console.log("Error getting service:", error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred during sign up');
        }
    }

    async createService(payload:CreateServiceDto):Promise<addServiceResponse>{
        try {
            const { service } = payload;

            const serviceExists = await this.prisma.service.findFirst({
                where: { name: service }
            })

            if (serviceExists) {
                throw new BadRequestException('Service already exists');
            }

            const addService = await this.prisma.service.create({
                data: { name: service }
            })

            return { message: 'Service created successfully', success: true };
        } catch (error) {
            console.log("Error creating service:", error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred during sign up');
        }
    }

    async updateService(payload:UpdateServiceDto):Promise<updateServiceResponse>{
        try {
            const { serviceId, service } = payload;

            const serviceExists = await this.prisma.service.findFirst({
                where: { id: serviceId }
            })

            if (!serviceExists) {
                throw new BadRequestException('Service does not exists');
            }

            const updateService = await this.prisma.service.update({
                where: { id: serviceId },
                data: { name: service }
            })

            return { message: 'Service updated successfully', success: true };
        } catch (error) {
            console.log("Error updating service:", error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('An error occurred during sign up');
        }
    }
}



import { Controller, Patch, Post, Body, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { addServiceResponse, getServiceByIdResponse, getServicesResponse, updateServiceResponse } from './services.interface';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('/api/services/v1')
export class ServicesController {
    constructor(private servicesService: ServicesService) {}

    @Get("/")
    getServices():Promise<getServicesResponse>{
        return this.servicesService.getServices();
    }

    @Get("/:serviceId")
    getServiceById(@Param('serviceId') serviceId: string):Promise<getServiceByIdResponse>{
        return this.servicesService.getServiceById(serviceId);
    }   

    @Post("/create")
    createService(@Body() payload:CreateServiceDto):Promise<addServiceResponse>{
        return this.servicesService.createService(payload);
    }

    @Patch("/update/:serviceId")
    updateService(@Param('serviceId') serviceId: string, @Body() payload: UpdateServiceDto): Promise<updateServiceResponse> {
        return this.servicesService.updateService({ ...payload, serviceId });
    }
}

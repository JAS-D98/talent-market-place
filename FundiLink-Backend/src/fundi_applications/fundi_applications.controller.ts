import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FundiApplicationsService } from './fundi_applications.service';
import { CreateFundiDto } from './dto/create-fundi.dto';
import { CreateFundiApplicationDto, GetAllFundiProfilesResponse, GetPendingFundiProfilesResponse } from './fundi_applications.interface';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { RolesGuard } from '../authentication/roles.guard'; 
import { Roles } from '../authentication/roles.decorator';

@Controller('/api/fundi/v1')
export class FundiApplicationsController {
    constructor(private fundiApplicationsService:FundiApplicationsService){}

    @Post('/apply')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("USER","SUPERADMIN","ADMIN")
    createFundiProfile(@Req() req, @Body() payload: CreateFundiDto): Promise<CreateFundiApplicationDto> {
        const userId: string = req.user.id;
        return this.fundiApplicationsService.createFundiProfile(userId, payload);
    }

    @Get('/pending')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("SUPERADMIN","ADMIN")
    getPendingFundiProfiles(): Promise<GetPendingFundiProfilesResponse> {
        return this.fundiApplicationsService.getPendingFundiProfiles();
    }

    @Get('/all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("SUPERADMIN","ADMIN")
    getAllFundiProfiles(): Promise<GetAllFundiProfilesResponse> {
        return this.fundiApplicationsService.getAllFundiProfiles();
    }
    
}

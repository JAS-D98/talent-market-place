import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { FundiVerificationService } from './fundi_verification.service';
import { FundiVerificationResponse } from './fundi_verification.interface';
import { Roles } from 'src/authentication/roles.decorator';
import { RolesGuard } from 'src/authentication/roles.guard';
import { JwtAuthGuard } from 'src/authentication/jwt-auth.guard';
import { CreateFundiVerificationDto } from './dto/create_fundi_verification.dto';

@Controller('/api/fundi/v1/')
export class FundiVerificationController {
    constructor(private fundiVerificationService:FundiVerificationService){}
    
    @Patch('/verify/:fundiId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("SUPERADMIN","ADMIN")
    verifyFundiProfile(@Param('fundiId') fundiId: string, @Body() payload: CreateFundiVerificationDto): Promise<FundiVerificationResponse> {
        return this.fundiVerificationService.verifyFundiProfile({...payload,fundiId});
    }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FundiVerificationResponse } from './fundi_verification.interface';

@Injectable()
export class FundiVerificationService {
    constructor(private prisma:PrismaService){}

   // verifyFundiProfile and Update Status to VERIFIED
    async verifyFundiProfile(payload:{fundiId:string, verificationStatus:string}): Promise<FundiVerificationResponse> {
        try {
            const {fundiId, verificationStatus} = payload;
            // console.log("Fundi ID", fundiId)
            const fundiProfile = await this.prisma.fundiProfile.findUnique({
                where: { id: fundiId },
            });

            if (!fundiProfile) {
                throw new BadRequestException("Fundi profile not found.");
            }

            // Update the status to VERIFIED
            await this.prisma.fundiProfile.update({
                where: { id: fundiId },
                data: { status: verificationStatus },
            });

            await this.prisma.user.update({
                where: { id: fundiProfile.userId },
                data: { verified: verificationStatus },
            });

            return { success: true, message: "Fundi profile verified successfully." };
        } catch (error) {
            console.error("Error verifying fundi profile:", error);
            throw new BadRequestException("An error occurred while verifying the fundi profile.");
        }
    }
}

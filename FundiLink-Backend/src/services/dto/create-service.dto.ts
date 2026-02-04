import { IsNotEmpty, IsString } from "class-validator";

export class CreateServiceDto{
    @IsString()
    @IsNotEmpty({message: "Service is required"})
    service: string
}
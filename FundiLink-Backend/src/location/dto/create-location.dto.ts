import { IsNotEmpty, IsString } from "class-validator";

export class CreateLocationDto {
    @IsString()
    @IsNotEmpty({message: "Location name is required"})
    name: string;
}
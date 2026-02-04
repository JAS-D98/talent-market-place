import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(3, {message: "Name should have a minimum of 3 characters"})
  @IsNotEmpty({message:"Name is required"})
  name: string;

  @IsString()
  @IsNotEmpty({message: "Password is required"})
  password: string;

  @IsEmail({},{message: "Use a valid email"})
  @IsNotEmpty({message: "Email Address is required"})
  email: string;


  @IsString()
  @IsNotEmpty({message: "Phone number is required"})
  phone:string;

}
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInUserDto {

  @IsNotEmpty({ message: 'Email is required' })
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;
 
  
}

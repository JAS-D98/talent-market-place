import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignInResponse, SignUpResponse } from './users.interface';
import { SignInUserDto } from './dto/sign-in-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService, private jwtService: JwtService) {}

  async signUp(payload:CreateUserDto):Promise<SignUpResponse>{
    try {
      const {email, password, name, phone, agreeToTerms, role} = payload;

      if (!email || !password || !name || !phone || !agreeToTerms) {
        throw new BadRequestException('All fields are required');
      }

      //check if user already exists
      const userExists=await this.prisma.user.findUnique({
        where:{email}
      })

      if(userExists){
        throw new BadRequestException('User already exists with this email');
      }

      const numberOfRounds=10;
      const hashedPasword=await this.encryptPassword(password,numberOfRounds);

      const user=await this.prisma.user.create({
        data: {
          email,
          password: hashedPasword,
          name,
          phone,
          agreeToTerms,
          role 
        }
      })

      return { message: 'Sign up successful', success: true };
    } catch (error) {
        console.error('Error during sign up:', error);
        if (error instanceof HttpException) {
          throw error;
        }
        throw new InternalServerErrorException('An error occurred during sign up');
    }
  }

  async encryptPassword(
    password: string,
    saltOrRounds: string | number,
  ): Promise<string> {
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async signIn(payload: SignInUserDto): Promise<SignInResponse> {
    try {
      const { email, password } = payload;

      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid email or password');
      }

      // Generate JWT token
      const accessToken = this.jwtService.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: '5d' } // Set token expiration time to 5 days
      );

      return {
        message: 'Sign in successful',
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          isVerified: user.verified || "unverified", // Assuming 'verified' is a field in your user model
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Error during sign in:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during sign in');
      }
  }
}


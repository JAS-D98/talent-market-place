import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/authenticate/v1')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/sign-up')
  async signUp(@Body() payload: CreateUserDto) {
    return this.usersService.signUp(payload);
  }

  @Post('/sign-in')
  async signIn(@Body() payload: CreateUserDto) {
    return this.usersService.signIn(payload);
  }
  

}

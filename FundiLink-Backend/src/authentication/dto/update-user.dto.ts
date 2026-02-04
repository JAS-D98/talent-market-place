import { CreateUserDto } from "./create-user.dto";
import { PartialType } from '@nestjs/mapped-types';  //install @nestjs/mapped-types

export class UpdateUserDto extends PartialType(CreateUserDto) {}
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Post,
} from '@nestjs/common';
import { UserDto } from './dto/userDto.dto';
import { UserModel } from './user-model';
import { UserService } from './user.service';
import {} from 'bcryptjs';
import { genSaltSync } from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private userSerice: UserService) {}

  @Get()
  async getUsers() {
    return await this.userSerice.getItems(1);
  }
}

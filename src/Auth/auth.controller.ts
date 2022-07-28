import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { response } from 'express';
import { UserDto } from 'src/user/dto/userDto.dto';
import { UserModel } from 'src/User/user-model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/logIn')
  async logIn(@Body() user: UserDto) {
    return await this.authService.findValidUser(
      user['email'],
      user['password'],
    );
  }

  @Post()
  @HttpCode(201)
  async register(@Body() user: UserDto) {
    await this.authService.createValidUser(user);
  }
}

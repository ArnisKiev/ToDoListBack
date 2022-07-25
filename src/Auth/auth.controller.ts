import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
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
  async register(@Body() user: UserDto) {
    return this.authService.createValidUser(user);
  }
}

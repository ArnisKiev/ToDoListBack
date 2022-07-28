import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserDto } from 'src/user/dto/userDto.dto';
import { UserModel } from 'src/User/user-model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async findValidUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (user === null) {
      throw new UnauthorizedException('User not found');
    }

    if (!(await compare(password, user['passwordHash']))) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload = {
      id: user['_id'],
    };
    const jwt = await this.jwtService.signAsync(payload);

    return {
      access_token: jwt,
      user: {
        email: user.email,
        id: user.id,
      },
    };
  }

  async createValidUser(user: UserDto) {
    const oldUser = await this.userService.findUserByEmail(user.email);

    if (oldUser != null) {
      throw new BadRequestException('The user with this email was registered');
    }

    const addedUser = await this.userService.create(user);

    return true;
  }
}

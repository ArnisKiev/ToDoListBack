import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UserDto } from 'src/user/dto/userDto.dto';
import { UserModel } from 'src/User/user-model';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async findValidUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (Object.keys(user).length === 0) {
      throw new UnauthorizedException('User not found');
    }
    const isCorrectPassword = await compare(password, user['passwordHash']);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect password');
    }
    return { email: user['email'], id: user['_id'] };
  }

  async createValidUser(user: UserDto) {
    const oldUser = await this.userService.findUserByEmail(user.email);

    if (oldUser != null) {
      throw new BadRequestException('The user with this email was registered');
    }

    const addedUser = await this.userService.create(user);
    return {
      id: addedUser['_id'],
      email: addedUser.email,
    };
  }
}

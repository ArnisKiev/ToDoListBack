import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { async } from 'rxjs';

import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockedUserService = {
  findUserByEmail(email: string) {
    return { email: 'test-email' };
  },
};

/*
describe('Auth controller', () => {
  let authService: any;
  let userService: any;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should generete exception "user not found"', async () => {

    expect(authService.findValidUser).rejects.toThrowError(
      UnauthorizedException
    );
  });

  it('should return user from LOgIn', async () => {});
});
*/

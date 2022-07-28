import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { genSalt, hash } from 'bcryptjs';

import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

describe('Auth controller', () => {
  let authService: AuthService;

  const mockedUserService = {
    findUserByEmail: (email: string) => ({}),
    create: () => ({}),
  };

  const mockedJwtService = {
    signAsync: (data: any) => new Promise(() => ({})),
  };

  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockedUserService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
      ],
    }).compile();

    authService = testModule.get<AuthService>(AuthService);
  });

  it('should generete exception "user not found"', async () => {
    jest.spyOn(mockedUserService, 'findUserByEmail').mockReturnValueOnce(null);

    let hasError = false;
    await authService
      .findValidUser('test-email', 'test-password')
      .catch((err) => {
        if (err instanceof UnauthorizedException) {
          hasError = true;
        }
      });

    expect(hasError).toEqual(true);
  });

  it('should generate exception "Incorrect password"', async () => {
    const salt = await genSalt(10);
    let password = 'test-password';
    const user = { passwordHash: await hash(password, salt) };
    jest.spyOn(mockedUserService, 'findUserByEmail').mockReturnValueOnce(user);

    let hasIncorrectPasswordError = false;

    await authService
      .findValidUser('test-email', 'incorrect-password')
      .catch((err) => {
        if (err.message == 'Incorrect password') {
          hasIncorrectPasswordError = true;
        }
      });
    expect(hasIncorrectPasswordError).toEqual(true);
  });

  it('should generate error, if user has been created', async () => {
    jest
      .spyOn(mockedUserService, 'findUserByEmail')
      .mockReturnValue({ email: 'test-email' });

    let hasError = false;

    await authService
      .createValidUser({ email: 'email', password: 'password' })
      .catch((err) => {
        if (err instanceof BadRequestException) {
          hasError = true;
        }
      });

    expect(hasError).toBe(true);
  });

  it('should create user', async () => {
    const userDB = { _id: 'test-id', email: 'test-email' };

    jest.spyOn(mockedUserService, 'findUserByEmail').mockReturnValueOnce(null);
    jest.spyOn(mockedUserService, 'create').mockReturnValueOnce(userDB);

    const isCreated = await authService.createValidUser({
      email: 'test-email',
      password: 'test-password',
    });

    expect(isCreated).toEqual(true);
  });
});

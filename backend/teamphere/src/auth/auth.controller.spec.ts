import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        LocalAuthGuard,
        JwtService,
        PrismaService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should login successfully and set cookies', async () => {
      const req = {
        user: { id: 1 },
      };
      const res = {
        cookie: jest.fn(),
        send: jest.fn(),
      };

      const tokens = {
        id: 1,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
      jest.spyOn(authService, 'login').mockResolvedValue(tokens);

      await authController.login(req as any, res as any as Response);

      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        tokens.accessToken,
        expect.any(Object),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        tokens.refreshToken,
        expect.any(Object),
      );
      expect(res.send).toHaveBeenCalledWith({ message: 'Login successful' });
    });

    it('should handle login failure', async () => {
      const req = {
        user: null,
      };
      const res = {
        cookie: jest.fn(),
        send: jest.fn(),
      };

      jest.spyOn(authService, 'login').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      try {
        await authController.login(req as any, res as any as Response);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }

      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });
});

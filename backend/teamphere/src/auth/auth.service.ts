import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { LoginModel } from './models/login-model/login.model';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private tokenService: TokenService,
  ) {}

  async register(
    prisma: Prisma.TransactionClient,
    email: string,
    password: string | null,
    userId: number,
  ) {
    if (await this.isEmailExist(email)) {
      throw new ConflictException('Email is already taken');
    }
    if (password) {
      const hashedPassword = await this.passwordService.hashPassword(password);
      const authData = await prisma.authData.create({
        data: {
          email,
          passwordHash: hashedPassword,
          userId,
        },
      });
      return authData;
    }
    const authData = await prisma.authData.create({
      data: {
        email,
        userId,
      },
    });
    return authData;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ id: number } | boolean> {
    const authData = await this.prisma.authData.findUnique({
      where: { email },
    });

    if (!authData) return false;

    const validation = await this.passwordService.comparePassword(
      password,
      authData.passwordHash,
    );

    if (validation) return { id: authData.userId };

    return false;
  }

  async login(user: LoginModel) {
    const payload = { id: user.id };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    await this.prisma.authData.update({
      where: {
        userId: user.id,
      },
      data: {
        refreshToken,
      },
    });
    return {
      id: user.id || '',
      accessToken,
      refreshToken,
    };
  }
  async loginWithGoogle(user: any) {
    const name = `${user.firstName} ${user.lastName || ''}`;
    const picture = user.picture;
    const email = user.email;

    const isUserExist = await this.prisma.authData.findUnique({
      where: { email: user.email },
    });
    if (!isUserExist) {
      const createUser = await this.prisma.$transaction(async (prisma) => {
        const createdUser = await prisma.user.create({
          data: {
            profile: {
              create: {
                img: picture || '',
                bio: '',
                tag: '',
                name: name || 'NAME',
                tagColor: '#ffffff',
                isPhotoVisible: false,
              },
            },
          },
        });

        const auth = await this.register(prisma, email, null, createdUser.id);

        return { user: createdUser, auth };
      });

      const payload = { id: createUser.user.id };
      const refreshToken = this.tokenService.generateRefreshToken(payload);
      await this.prisma.authData.update({
        where: { email: user.email },
        data: { refreshToken },
      });
      return {
        access_token: this.tokenService.generateAccessToken(payload),
        refresh_token: refreshToken,
      };
    }
    const payload = { id: isUserExist.userId };
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    await this.prisma.authData.update({
      where: { email: isUserExist.email },
      data: { refreshToken },
    });

    return {
      access_token: this.tokenService.generateAccessToken(payload),
      refresh_token: refreshToken,
    };
  }
  async logout(userId: number) {
    try {
      await this.prisma.authData.update({
        where: { userId },
        data: { refreshToken: null },
      });
    } catch (e) {
      console.log('error', e);
      throw e;
    }
  }
  async verifyToken(accessToken: string) {
    try {
      return await this.tokenService.verifyToken(accessToken);
    } catch (error: any) {
      console.log('error', error);
      throw error;
    }
  }

  async refresh(userId: number) {
    const newAccessToken = this.tokenService.generateAccessToken({
      id: userId,
    });

    return { accessToken: newAccessToken };
  }
  async isEmailExist(email: string) {
    const res = await this.prisma.authData.findUnique({
      where: { email },
    });
    return !!res;
  }
}

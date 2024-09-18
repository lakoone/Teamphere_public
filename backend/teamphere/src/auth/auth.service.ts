import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { LoginModel } from './models/login-model/login.model';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import * as chalk from 'chalk';
import { writeLog } from '../helpers/log';

const authServiceBgColor = chalk.bgYellow.black;
const authServiceTextColor = chalk.yellowBright;
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
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      `email: ${email} | password: ${password} | userID : ${userId}`,
    );
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
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      `email: ${email} | password: ${password}`,
    );

    const authData = await this.prisma.authData.findUnique({
      where: { email },
    });
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      `is user exist: `,
      authData,
    );
    if (!authData) return false;

    const validation = await this.passwordService.comparePassword(
      password,
      authData.passwordHash,
    );
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      `is valid user: `,
      !!validation,
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
    writeLog(authServiceBgColor, authServiceTextColor, `login user `, user.id);
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
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      `login with google user: ${name} | ${email}`,
    );

    const isUserExist = await this.prisma.authData.findUnique({
      where: { email: user.email },
    });
    if (!isUserExist) {
      writeLog(
        authServiceBgColor,
        authServiceTextColor,
        `creating user `,
        name,
      );
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
        writeLog(
          authServiceBgColor,
          authServiceTextColor,
          `created user id `,
          createdUser.id,
        );
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
    writeLog(authServiceBgColor, authServiceTextColor, `user exist`);
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
    writeLog(authServiceBgColor, authServiceTextColor, `user id`, userId);
    try {
      await this.prisma.authData.update({
        where: { userId },
        data: { refreshToken: null },
      });
      writeLog(authServiceBgColor, authServiceTextColor, `logout successfully`);
    } catch (e) {
      writeLog(authServiceBgColor, authServiceTextColor, `Error `, e);
      throw e;
    }
  }
  async verifyToken(accessToken: string) {
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      `access token: `,
      accessToken,
    );
    try {
      const result = await this.tokenService.verifyToken(accessToken);
      writeLog(
        authServiceBgColor,
        authServiceTextColor,
        `is valid: `,
        !!result,
      );
      return result;
    } catch (error: any) {
      writeLog(
        authServiceBgColor,
        authServiceTextColor,
        `Error: `,
        error.message,
      );
      throw error;
    }
  }

  async refresh(userId: number) {
    writeLog(authServiceBgColor, authServiceTextColor, `user ID: `, userId);

    const newAccessToken = this.tokenService.generateAccessToken({
      id: userId,
    });
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      `generated access token: `,
      newAccessToken,
    );
    return { accessToken: newAccessToken };
  }
  async isEmailExist(email: string) {
    const res = await this.prisma.authData.findUnique({
      where: { email },
    });
    return !!res;
  }
}

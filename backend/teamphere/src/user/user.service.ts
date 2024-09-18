import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserData, UserProfileType } from './dto/user-data.dto';
import { AuthService } from '../auth/auth.service';
import { AuthDataDTO } from '../auth/dto/auth-data.dto';

import * as chalk from 'chalk';
import { StorageService } from '../storage/storage.service';
import { writeLog } from '../helpers/log';

const userServiceBgColor = chalk.bgGreen.black;
const userServiceTextColor = chalk.green;
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly storage: StorageService,
  ) {}

  async createUser(
    authData: AuthDataDTO,
    userData: Omit<UserData['profile'], 'img'>,
    img?: Express.Multer.File,
  ) {
    writeLog(
      userServiceBgColor,
      userServiceTextColor,
      'auth data:',
      authData,
      'user data:',
      userData,
    );

    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({ data: {} });
      const auth = await this.authService.register(
        prisma,
        authData.email,
        authData.password || null,
        user.id,
      );

      let imgUrl: null | string = null;
      if (img) {
        img.originalname = decodeURIComponent(img.originalname);
        const file = await this.storage.uploadFile({
          userID: user.id,
          file: img,
        });
        imgUrl = file.url;
      }
      await prisma.userProfile.create({
        data: {
          img: imgUrl || '',
          ...userData,
          user: { connect: { id: user.id } },
        },
      });

      return { user, auth };
    });
  }
  async updateUser(
    data: Partial<UserProfileType>,
    id: number,
    newImg?: Express.Multer.File,
  ) {
    writeLog(
      userServiceBgColor,
      userServiceTextColor,
      'id:',
      id,
      'data:',
      data,
    );

    if (newImg) {
      const file = await this.storage.uploadFile({ file: newImg, userID: id });
      const userData = await this.prisma.userProfile.update({
        where: { userId: id },
        data: {
          ...data,
          img: file.url,
        },
      });
      const { userId, ...rest } = userData;
      return { userData: rest };
    } else {
      const userData = await this.prisma.userProfile.update({
        where: { userId: id },
        data,
      });
      return { userData };
    }
  }
  async findMany(data: {
    take?: number;
    skip?: number;
    name?: string;
    IDs?: number[];
  }) {
    const { take, skip = 0, name, IDs } = data;
    writeLog(
      userServiceBgColor,
      userServiceTextColor,
      'iDs:',
      IDs,
      'take:',
      take,
      'name',
      name,
    );

    if (name !== undefined) {
      if (name.length == 0) return [];
      const users = await this.prisma.user.findMany({
        where: { profile: { name: { contains: name, mode: 'insensitive' } } },
        select: { profile: true, id: true },
        take: take ?? null,
        skip,
      });
      users.forEach((user) => {
        if (!user.profile.isPhotoVisible) user.profile.img = '';
      });

      return users;
    } else if (IDs.length > 0) {
      const users = await this.prisma.user.findMany({
        where: { id: { in: IDs } },
        select: { profile: true, id: true },
        take,
        skip,
      });
      users.forEach((user) => {
        if (!user.profile.isPhotoVisible) user.profile.img = '';
      });

      return users;
    }
    throw Error('undefined arguments');
  }
  async findOne(id?: number, email?: string) {
    writeLog(
      userServiceBgColor,
      userServiceTextColor,
      'id:',
      id,
      ' email:',
      email,
    );

    if (email) {
      const user = await this.prisma.authData.findUnique({
        where: { email },
        select: { userId: true },
      });
      if (user) {
        writeLog(
          userServiceBgColor,
          userServiceTextColor,
          'User found with ID:',
          user.userId,
        );
        const userData = await this.prisma.user.findUnique({
          where: { id: user.userId },
          select: { profile: true, id: true },
        });
        return userData;
      }
      return false;
    } else if (id) {
      const parsedID = Number(id);
      const user = await this.prisma.user.findUnique({
        where: { id: parsedID },
        select: { profile: true, id: true },
      });
      writeLog(
        userServiceBgColor,
        userServiceTextColor,
        'User found with ID:',
        user.id,
      );
      return user;
    }
    writeLog(userServiceBgColor, userServiceTextColor, 'User not found');
    return false;
  }
}

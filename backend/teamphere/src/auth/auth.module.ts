import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategy/google.strategy';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';
import { CookieService } from './cookies.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn: '15m' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    TokenService,
    CookieService,
    PasswordService,
    PrismaService,
    LocalStrategy,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
  ],
  exports: [
    AuthService,
    JwtModule,
    PasswordService,
    CookieService,
    TokenService,
  ],
})
export class AuthModule {}

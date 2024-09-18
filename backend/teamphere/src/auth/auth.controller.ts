import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CookieService } from './cookies.service';
import { writeLog } from '../helpers/log';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import * as chalk from 'chalk';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
const authServiceBgColor = chalk.bgYellowBright.black;
const authServiceTextColor = chalk.yellowBright;
@Controller('/api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private configService: ConfigService,
  ) {}
  @Get('email')
  async checkEmail(@Res() response: Response, @Query('email') email?: string) {
    if (!email) throw new BadRequestException('Invalid data');
    writeLog(authServiceBgColor, authServiceTextColor, 'Email:', email);
    const isEmailExist = await this.authService.isEmailExist(email);
    response.send({ isEmailExist });
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res: Response) {
    writeLog(authServiceBgColor, authServiceTextColor, 'req.user:', req.user);

    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );
    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    res.send({ message: 'Login successful' });
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { user } = req;
    writeLog(authServiceBgColor, authServiceTextColor, 'user :', user);

    const tokens = await this.authService.loginWithGoogle(user);
    this.cookieService.setAccessToken(res, tokens.access_token);
    this.cookieService.setRefreshToken(res, tokens.refresh_token);
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      'GOOGLE CALLBACK REDIRECT : STATUS',
      this.configService.get<string>('STATUS'),
    );
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      'GOOGLE CALLBACK REDIRECT : DOMAIN',
      this.configService.get<string>('HOST_DOMAIN'),
    );

    return res.redirect(
      `${this.configService.get<string>('STATUS') === 'prod' ? this.configService.get<string>('HOST_DOMAIN') : 'http://localhost:3000'}/app/message`,
    );
  }
  @Throttle({ default: { ttl: 60000, limit: 50 } })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request & { user: { id: number } },
    @Res() res: Response,
  ) {
    writeLog(authServiceBgColor, authServiceTextColor, 'user ID:', req.user.id);
    try {
      const { accessToken } = await this.authService.refresh(req.user.id);
      this.cookieService.setAccessToken(res, accessToken);
      res.send({ message: 'Token refreshed' });
    } catch (error) {
      throw new UnauthorizedException('Refresh is ont valid');
    }
  }
  @UseGuards(JwtAccessGuard)
  @Post('logout')
  async logout(
    @Req() req: Request & { user: { id: number } },
    @Res() res: Response,
  ) {
    writeLog(
      authServiceBgColor,
      authServiceTextColor,
      'logout user ID:',
      req.user.id,
    );
    await this.authService.logout(req.user.id);
    this.cookieService.clearCookies(res);

    res.send('logout successful');
  }
  @Throttle({ default: { limit: 300, ttl: 60000 } })
  @UseGuards(JwtAccessGuard)
  @Post('validate')
  @HttpCode(200)
  async validate(@Req() req: Request, @Res() res: Response) {
    res.send({ message: 'validation successful' });
  }
}

import { Injectable } from '@nestjs/common';
import { Response } from 'express';
@Injectable()
export class CookieService {
  setAccessToken(res: Response, accessToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });
  }

  setRefreshToken(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/api/auth/refresh',
    });
  }

  clearCookies(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', {
      path: '/api/auth/refresh',
      httpOnly: true,
      secure: true,
    });
  }
}

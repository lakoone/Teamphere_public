import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '20m',
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '3d',
    });
  }

  async verifyToken(token: string): Promise<any> {
    console.log('[TokenService : refrsh - started with arg]', token);
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      console.log('[TokenService - refresh - after validation error :]', error);
      throw new UnauthorizedException('token is not valid');
    }
  }
}

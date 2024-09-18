import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginModel } from '../models/login-model/login.model';
import { Request } from 'express';
import { writeLog } from '../../helpers/log';

import * as chalk from 'chalk';

const jwtStrategyTextColor = chalk.yellow;
const jwtStrategyBgColor = chalk.bgYellow.black;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    console.log('JWT STRATEGY INITIALIZATION');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          console.log('request.cookies :', request.cookies);
          if (request && request.cookies) {
            token = request.cookies['access_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request & { userID?: number }, payload: LoginModel) {
    writeLog(jwtStrategyBgColor, jwtStrategyTextColor, ` payload: `, payload);

    return { id: payload.id };
  }
}

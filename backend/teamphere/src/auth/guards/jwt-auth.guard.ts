import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { writeLog } from '../../helpers/log';

import * as chalk from 'chalk';

const jwtGuardBgColor = chalk.bgYellow.black;
const jwtGuardTextColor = chalk.yellow;
@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    writeLog(jwtGuardBgColor, jwtGuardTextColor, 'Start ', request.url);
    return (await super.canActivate(context)) as boolean;
  }
}

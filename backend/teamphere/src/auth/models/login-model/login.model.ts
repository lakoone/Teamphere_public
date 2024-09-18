import { IsString } from 'class-validator';

export class LoginModel {
  @IsString()
  id: number;
}

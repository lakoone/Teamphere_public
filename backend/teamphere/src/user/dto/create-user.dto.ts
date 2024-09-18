import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserDataDTO } from './user-data.dto';
import { AuthDataDTO } from '../../auth/dto/auth-data.dto';

export class CreateUserDTO {
  @ValidateNested()
  @Type(() => UserDataDTO)
  userData: UserDataDTO;

  @ValidateNested()
  @Type(() => AuthDataDTO)
  authData: AuthDataDTO;
}

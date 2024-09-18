import {
  IsBoolean,
  IsHexColor,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class URL {
  @IsUrl()
  url: string;
}
export class FileUrl {
  @ValidateNested()
  @Type(() => URL)
  file: URL;
}
export class UserProfileType {
  @IsString()
  name: string;
  @IsString()
  img: string;
  @IsString()
  bio: string;
  @IsString()
  tag: string;
  @IsBoolean()
  isPhotoVisible: boolean;
  @IsHexColor()
  tagColor: string;
}
export class UserDataDTO {
  @ValidateNested()
  @Type(() => UserProfileType)
  profile: UserProfileType;
}
export class UserData {
  @IsNumber()
  id: number;
  @ValidateNested()
  @Type(() => UserProfileType)
  profile: UserProfileType;
}

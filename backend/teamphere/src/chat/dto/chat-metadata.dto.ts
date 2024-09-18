import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserData } from '../../user/dto/user-data.dto';
class MessageFileDTO {
  @IsString()
  name: string;
  @IsString()
  type: string;
  @IsNumber()
  size: number;
}
class MessageMetadata {
  @IsString()
  id: string;

  @IsDate()
  createdAt: Date;

  @IsNumber()
  authorID: number;

  @IsString()
  chatID: string;

  @IsString()
  text: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageFileDTO)
  files: MessageFileDTO[];
}
export class ChatMetadataDTO {
  @IsString()
  id: string;
  @IsString()
  img: string;
  @IsBoolean()
  isGroup: boolean;
  @IsString()
  title: string;
  @ValidateNested()
  @Type(() => MessageMetadata)
  lastMessage: MessageMetadata;
  @IsNumber()
  unreadMessages: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserData)
  participants?: UserData[];
}

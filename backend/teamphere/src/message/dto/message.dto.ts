import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class ReaderDTO {
  @IsNumber()
  userId: number;
}
class MessageFileDTO {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  url: string;
  @IsString()
  type: string;
  @IsNumber()
  size: number;
}
export class MessageDTO {
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
  @Type(() => ReaderDTO)
  readers: ReaderDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageFileDTO)
  files: MessageFileDTO[];
}

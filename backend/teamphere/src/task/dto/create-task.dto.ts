import { Type } from 'class-transformer';
import {
  IsDate,
  IsString,
  IsArray,
  IsInt,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  title: string;

  @IsDate()
  @Type(() => Date)
  deadline: Date;

  @IsArray()
  @IsInt({ each: true })
  @ArrayNotEmpty()
  forUsersID: number[];

  @IsString()
  taskText: string;

  @IsString()
  chatID: string;
}

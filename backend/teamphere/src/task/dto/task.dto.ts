import {
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { fileDTO } from '../../chat/dto/init-message.dto';
import { UserData } from '../../user/dto/user-data.dto';
import { Type } from 'class-transformer';
class UserType {
  user: UserData;
}
class FileType {
  file: fileDTO;
}
export enum TaskStatus {
  VERIFIED = 'verified',
  PROCESS = 'process',
  EXPIRED = 'expired',
  SENT = 'sent',
  CREATED = 'created',
}
export class TaskDTO {
  @IsString()
  id: string;
  @IsString()
  title: string;
  @IsNumber()
  createdByID: number;
  @IsDate()
  createdAt: Date;
  @IsNumber()
  changedByID: number;
  @IsDate()
  lastChangedAt: Date;
  @IsEnum(TaskStatus)
  status: TaskStatus;
  @IsDate()
  deadline: Date;
  @ValidateNested()
  @Type(() => UserType)
  usersAssigned: { user: UserData }[];
  @IsString()
  taskText: string;
  @ValidateNested()
  @Type(() => FileType)
  taskDescriptionFiles: { file: fileDTO }[];
  @IsString()
  answerText: string;
  @ValidateNested()
  @Type(() => FileType)
  taskAnswerFiles: { file: fileDTO }[];
  @IsString()
  chatID: string;
  @ValidateNested()
  @Type(() => UserData)
  createdBy: UserData;
}

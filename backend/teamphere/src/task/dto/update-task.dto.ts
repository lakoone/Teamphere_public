import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { fileDTO } from '../../chat/dto/init-message.dto';
import { Type } from 'class-transformer';
import { TaskStatus } from './task.dto';

class FileType {
  file: fileDTO;
}
export class UpdateTaskDTO {
  @IsOptional()
  @IsString()
  taskText?: string;
  @ValidateNested()
  @Type(() => FileType)
  taskDescriptionFiles: { file: fileDTO }[];
  @IsOptional()
  @IsString()
  answerText?: string;
  @ValidateNested()
  @Type(() => FileType)
  taskAnswerFiles: { file: fileDTO }[];
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

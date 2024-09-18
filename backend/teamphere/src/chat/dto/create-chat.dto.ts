import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateChatDTO {
  @IsString()
  name?: string;
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  participants: number[];
}
export class CreateChatDTOString {
  @ValidateNested({ each: true })
  @Transform(({ value }) => {
    try {
      const parsedData = JSON.parse(value);
      return { data: parsedData };
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  })
  @Type(() => CreateChatDTO)
  @IsNotEmpty()
  readonly data: CreateChatDTO;
}

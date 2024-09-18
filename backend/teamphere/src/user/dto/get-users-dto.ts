import {
  IsArray,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';
export class GetUsersDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  IDs?: number[];
  @IsOptional()
  @IsBoolean()
  friendsOnly?: boolean;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  take?: number;
  @IsOptional()
  @IsNumber()
  @IsPositive()
  skip?: number;
  @IsOptional()
  @IsString()
  name?: string;
}

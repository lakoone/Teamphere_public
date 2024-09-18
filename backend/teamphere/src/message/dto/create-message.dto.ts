import { IsArray, IsNumber, IsString } from 'class-validator';
type fileDTO = {
  url: string;
  id: string;
  size: number;
  type: string;
  name: string;
};
export class CreateMessageDto {
  @IsNumber()
  authorID: number;
  @IsString()
  chatID: string;
  @IsString()
  text: string;
  @IsArray()
  files: fileDTO[];
}

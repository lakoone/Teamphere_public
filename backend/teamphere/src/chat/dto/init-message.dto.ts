import { IsArray, IsNumber, IsString } from 'class-validator';

export type fileDTO = {
  url: string;
  id: string;
  size: number;
  name: string;
  type: string;
};
export class InitMessageDTO {
  @IsNumber()
  authorID: number;
  @IsString()
  text: string;
  @IsArray()
  files: fileDTO[];
}

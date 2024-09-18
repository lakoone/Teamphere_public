import { IsNumber } from 'class-validator';

export class PaginateFriendsDto {
  @IsNumber()
  skip: number;
  @IsNumber()
  take: number;
}

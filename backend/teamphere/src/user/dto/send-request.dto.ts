import { IsNumber, IsString } from 'class-validator';

export class SendRequestDTO {
  userId: number;
  friendIds: number[];
}
export class RequestData {
  @IsNumber()
  id: number;
  @IsNumber()
  fromUserId: number;
  @IsNumber()
  toUserId: number;
  @IsString()
  status: string;
}
